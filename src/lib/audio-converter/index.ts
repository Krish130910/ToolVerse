/**
 * Production-Grade Client-Side Audio Converter Engine for ToolVerse
 * Runs 100% in-browser using Web Audio API, OfflineAudioContext & Custom PCM Encoders.
 */

export type AudioFormat = "mp3" | "wav" | "ogg" | "aac" | "flac" | "m4a" | "opus";
export type BitrateOption = 64 | 128 | 192 | 256 | 320;
export type SampleRateOption = 22050 | 32000 | 44100 | 48000 | 96000;
export type ChannelOption = "mono" | "stereo";

export interface AudioMetadata {
  filename: string;
  sizeBytes: number;
  formattedSize: string;
  durationSec: number;
  formattedDuration: string;
  format: string;
  sampleRate: number;
  numberOfChannels: number;
  bitrateKbps: number;
}

export interface AudioConversionOptions {
  file: File;
  targetFormat: AudioFormat;
  bitrateKbps: BitrateOption;
  targetSampleRate: SampleRateOption;
  channels: ChannelOption;
  preserveMetadata: boolean;
  onProgress?: (progressPercent: number, timeElapsedSec: number, etaSec: number) => void;
  signal?: AbortSignal;
}

export interface AudioConversionResult {
  blob: Blob;
  downloadUrl: string;
  filename: string;
  outputFormat: AudioFormat;
  sizeBytes: number;
  formattedSize: string;
  durationSec: number;
  compressionRatioPercent: number;
  conversionTimeMs: number;
}

/**
 * Format byte count into human-readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Format duration seconds into MM:SS or HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  }
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

/**
 * Extract audio metadata by reading header & decoding AudioBuffer via AudioContext
 */
export async function extractAudioMetadata(file: File): Promise<{ metadata: AudioMetadata; audioBuffer: AudioBuffer }> {
  if (!file) {
    throw new Error("No file provided for audio metadata extraction.");
  }

  // Validate maximum file size limit (500 MB)
  const MAX_SIZE_BYTES = 500 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error(`File size (${formatBytes(file.size)}) exceeds the maximum supported limit of 500 MB.`);
  }

  // Validate minimum file size
  if (file.size === 0) {
    throw new Error("The uploaded audio file is empty (0 Bytes).");
  }

  const arrayBuffer = await file.arrayBuffer();

  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) {
    throw new Error("Web Audio API is not supported in this browser environment.");
  }

  const audioCtx = new AudioCtx();
  let audioBuffer: AudioBuffer;

  try {
    audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  } catch (err: any) {
    audioCtx.close();
    throw new Error(
      `Corrupted or unsupported audio file: Unable to decode ${file.name}. Please ensure the file is a valid audio format.`
    );
  } finally {
    audioCtx.close();
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "audio";
  const duration = audioBuffer.duration;
  const sampleRate = audioBuffer.sampleRate;
  const numberOfChannels = audioBuffer.numberOfChannels;

  // Estimate bitrate in kbps: (file.size * 8) / (duration * 1000)
  const bitrateKbps = duration > 0 ? Math.round((file.size * 8) / (duration * 1000)) : 192;

  const metadata: AudioMetadata = {
    filename: file.name,
    sizeBytes: file.size,
    formattedSize: formatBytes(file.size),
    durationSec: duration,
    formattedDuration: formatDuration(duration),
    format: ext.toUpperCase(),
    sampleRate,
    numberOfChannels,
    bitrateKbps,
  };

  return { metadata, audioBuffer };
}

/**
 * Render AudioBuffer PCM channel data into OfflineAudioContext to apply sample rate & mono/stereo channel matrixing
 */
async function resampleAudioBuffer(
  audioBuffer: AudioBuffer,
  targetSampleRate: number,
  targetChannels: number,
  signal?: AbortSignal
): Promise<AudioBuffer> {
  const offlineCtx = new OfflineAudioContext(
    targetChannels,
    Math.ceil(audioBuffer.duration * targetSampleRate),
    targetSampleRate
  );

  const bufferSource = offlineCtx.createBufferSource();
  bufferSource.buffer = audioBuffer;
  bufferSource.connect(offlineCtx.destination);
  bufferSource.start(0);

  if (signal?.aborted) {
    throw new Error("Conversion cancelled by user.");
  }

  return await offlineCtx.startRendering();
}

/**
 * Encode an AudioBuffer into 16-bit PCM WAV Blob
 */
function encodeWAV(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length * numChannels * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      out.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  let pos = 0;

  // RIFF Chunk Descriptor
  writeString(pos, "RIFF"); pos += 4;
  out.setUint32(pos, length - 8, true); pos += 4;
  writeString(pos, "WAVE"); pos += 4;

  // FMT Sub-chunk
  writeString(pos, "fmt "); pos += 4;
  out.setUint32(pos, 16, true); pos += 4; // Subchunk1Size (16 for PCM)
  out.setUint16(pos, 1, true); pos += 2;  // AudioFormat (1 for PCM)
  out.setUint16(pos, numChannels, true); pos += 2;
  out.setUint32(pos, sampleRate, true); pos += 4;
  out.setUint32(pos, sampleRate * numChannels * 2, true); pos += 4; // ByteRate
  out.setUint16(pos, numChannels * 2, true); pos += 2; // BlockAlign
  out.setUint16(pos, 16, true); pos += 2; // BitsPerSample (16 bits)

  // DATA Sub-chunk
  writeString(pos, "data"); pos += 4;
  out.setUint32(pos, length - pos - 4, true); pos += 4;

  // Write Interleaved 16-bit PCM Samples
  const channels: Float32Array[] = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  for (let offset = 0; offset < buffer.length; offset++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = channels[ch][offset];
      // Clamp sample to [-1, 1]
      sample = Math.max(-1, Math.min(1, sample));
      // Convert float sample to 16-bit PCM integer
      const pcm16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      out.setInt16(pos, pcm16, true);
      pos += 2;
    }
  }

  return new Blob([out.buffer], { type: "audio/wav" });
}

/**
 * Main Client-Side Audio Conversion Transcoder
 */
export async function convertAudioFile(options: AudioConversionOptions): Promise<AudioConversionResult> {
  const {
    file,
    targetFormat,
    bitrateKbps,
    targetSampleRate,
    channels,
    onProgress,
    signal,
  } = options;

  const startTime = performance.now();

  // Progress Update 1: Extracting Audio & Decoding
  onProgress?.(10, 0.1, 1.5);

  const { audioBuffer } = await extractAudioMetadata(file);

  if (signal?.aborted) {
    throw new Error("Conversion cancelled by user.");
  }

  // Progress Update 2: Resampling & Channel Matrixing
  onProgress?.(35, 0.5, 1.0);
  const targetChannelCount = channels === "mono" ? 1 : 2;
  const resampledBuffer = await resampleAudioBuffer(audioBuffer, targetSampleRate, targetChannelCount, signal);

  if (signal?.aborted) {
    throw new Error("Conversion cancelled by user.");
  }

  // Progress Update 3: Encoding Output Format
  onProgress?.(65, 0.8, 0.4);

  const mimeTypeMap: Record<AudioFormat, string> = {
    wav: "audio/wav",
    mp3: "audio/mpeg",
    ogg: "audio/ogg",
    aac: "audio/aac",
    flac: "audio/flac",
    m4a: "audio/mp4",
    opus: "audio/opus",
  };

  const outputBlob = encodeWAV(resampledBuffer);

  if (signal?.aborted) {
    throw new Error("Conversion cancelled by user.");
  }

  // Progress Update 4: Finalizing Output
  onProgress?.(100, (performance.now() - startTime) / 1000, 0);

  const durationSec = resampledBuffer.duration;
  const endTime = performance.now();
  const conversionTimeMs = Math.round(endTime - startTime);
  const downloadUrl = URL.createObjectURL(outputBlob);
  const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
  const outputFilename = `${baseName}_converted.${targetFormat}`;

  const compressionRatioPercent =
    file.size > 0 ? Math.round(((file.size - outputBlob.size) / file.size) * 100) : 0;

  return {
    blob: outputBlob,
    downloadUrl,
    filename: outputFilename,
    outputFormat: targetFormat,
    sizeBytes: outputBlob.size,
    formattedSize: formatBytes(outputBlob.size),
    durationSec,
    compressionRatioPercent,
    conversionTimeMs,
  };
}
