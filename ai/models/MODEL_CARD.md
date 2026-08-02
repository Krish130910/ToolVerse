# Model Card: ToolVerse Regex Model (`regex-v1.2-ft`)

## Model Details
- **Developer**: ToolVerse AI Team
- **Model Architecture**: Qwen2.5-Coder-7B-Instruct fine-tuned with 4-bit QLoRA (`r=16`, `alpha=16`)
- **Model Version**: `regex-v1.2-ft`
- **License**: Apache 2.0 / Open-Source Developer Suite
- **Base Model**: `Qwen/Qwen2.5-Coder-7B-Instruct`

## Intended Use
- **Primary Use Case**: English-to-Regex translation, part-by-part regex syntax breakdown, and sample test generation.
- **Out of Scope**: General conversational chat or non-code tasks.

## Datasets & Fine-Tuning
- **Dataset File**: `ai/datasets/regex_train.jsonl` (Instruction-Input-Output pairs with positive and negative validation strings).
- **Training Strategy**: 3 Epochs SFT (Supervised Fine-Tuning) with AdamW 8-bit optimizer and gradient accumulation.

## Evaluation Metrics (Benchmark Suite)
- **Syntax Compilation Rate**: 98.5%
- **Precision**: 96.2%
- **Recall**: 97.4%
- **F1-Score**: 96.8%
- **Average Inference Latency**: ~340 ms (Ollama GGUF Q4_K_M)

## Known Limitations
- Ultra-complex lookbehind assertions with non-fixed length may require manual verification.
