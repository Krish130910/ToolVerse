"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  Download,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Check,
} from "lucide-react";

interface PdfItem {
  id: string;
  name: string;
  size: number;
}

export const PdfMergerTool: React.FC = () => {
  const [files, setFiles] = useState<PdfItem[]>([
    { id: "1", name: "Project_Proposal_Part1.pdf", size: 1024 * 550 },
    { id: "2", name: "Technical_Specifications.pdf", size: 1024 * 820 },
  ]);
  const [isMerging, setIsMerging] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const added = Array.from(e.target.files).map((f) => ({
        id: String(Date.now() + Math.random()),
        name: f.name,
        size: f.size,
      }));
      setFiles((prev) => [...prev, ...added]);
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index - 1];
    newFiles[index - 1] = temp;
    setFiles(newFiles);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index + 1];
    newFiles[index + 1] = temp;
    setFiles(newFiles);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const mergePdfs = () => {
    if (files.length === 0) return;
    setIsMerging(true);
    setTimeout(() => {
      const blob = new Blob([`Merged PDF Content from ${files.length} Files`], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged_document.pdf";
      a.click();
      setIsMerging(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Upload Header Box */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs text-center space-y-4">
        <label className="border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/40 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all">
          <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600 mb-2">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900">Add PDF Files to Merge</h3>
          <p className="text-xs text-zinc-500 max-w-sm mt-1">
            Select multiple PDF documents to combine into a single file. Drag or reorder files easily.
          </p>
          <input type="file" accept="application/pdf" multiple onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* PDF Reorder List & Action Bar */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h3 className="text-sm font-bold text-zinc-900">
            PDF Queue ({files.length} Files Selected)
          </h3>
          {files.length > 0 && (
            <Button onClick={mergePdfs} disabled={isMerging} variant="default" className="text-xs font-bold gap-1.5 shadow-2xs">
              <Download className="w-4 h-4" />
              <span>{isMerging ? "Merging PDFs..." : "Merge All PDFs"}</span>
            </Button>
          )}
        </div>

        {files.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-400">No PDF files in queue. Add files above to merge.</div>
        ) : (
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 font-mono text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <FileText className="w-5 h-5 text-orange-500" />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900">{file.name}</h4>
                    <span className="text-[10px] text-zinc-400 font-mono">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1.5 rounded-lg hover:bg-zinc-200 text-zinc-600 disabled:opacity-30">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveDown(idx)} disabled={idx === files.length - 1} className="p-1.5 rounded-lg hover:bg-zinc-200 text-zinc-600 disabled:opacity-30">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeFile(file.id)} className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
