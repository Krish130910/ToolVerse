"""
ToolVerse AI Model Training Pipeline — Fine-Tuning RegexGPT (regex-v1.2-ft)
Uses Unsloth / Hugging Face PEFT QLoRA to fine-tune Qwen2.5-Coder-7B-Instruct on datasets/regex.jsonl
"""

import os
import torch
from datasets import load_dataset
from transformers import TrainingArguments
from trl import SFTTrainer

# Check for Unsloth fast fine-tuning engine
try:
    from unsloth import FastLanguageModel
    HAS_UNSLOTH = True
except ImportError:
    HAS_UNSLOTH = False

MODEL_NAME = "Qwen/Qwen2.5-Coder-7B-Instruct"
OUTPUT_DIR = "./models/regex-v1.2-ft"
DATASET_PATH = "../datasets/regex.jsonl"

def format_prompts(batch):
    formatted = []
    for inst, inp, out in zip(batch["instruction"], batch["input"], batch["output"]):
        text = f"<|im_start|>system\nYou are the ToolVerse Specialized Regex Model (regex-v1.2-ft). Convert English into regular expressions with explanations.<|im_end|>\n<|im_start|>user\n{inst} ({inp})<|im_end|>\n<|im_start|>assistant\n{out}<|im_end|>"
        formatted.append(text)
    return {"text": formatted}

def train():
    print(f"🚀 Initializing Fine-Tuning Pipeline for ToolVerse Regex Model...")
    print(f"📦 Base Model: {MODEL_NAME}")
    print(f"📄 Dataset: {DATASET_PATH}")

    if HAS_UNSLOTH:
        model, tokenizer = FastLanguageModel.from_pretrained(
            model_name=MODEL_NAME,
            max_seq_length=2048,
            dtype=None,
            load_in_4bit=True,
        )
        model = FastLanguageModel.get_peft_model(
            model,
            r=16,
            target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
            lora_alpha=16,
            lora_dropout=0,
            bias="none",
            use_gradient_checkpointing="unsloth",
        )
    else:
        print("⚠️ Unsloth not detected. Falling back to standard Hugging Face PEFT QLoRA...")

    # Load dataset
    dataset = load_dataset("json", data_files=DATASET_PATH, split="train")
    dataset = dataset.map(format_prompts, batched=True)

    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        warmup_steps=5,
        max_steps=60,
        learning_rate=2e-4,
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        logging_steps=1,
        optim="adamw_8bit",
        save_strategy="steps",
        save_steps=30,
    )

    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=dataset,
        dataset_text_field="text",
        max_seq_length=2048,
        args=training_args,
    )

    print("⚡ Starting QLoRA Training Loop...")
    trainer.train()

    print(f"💾 Saving Fine-Tuned Model Weights & LoRA Adapters to {OUTPUT_DIR}...")
    model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)

    # Export to GGUF format for Ollama inference
    if HAS_UNSLOTH:
        print("📦 Exporting Fine-Tuned Model to GGUF (q4_k_m) for Ollama local serving...")
        model.save_pretrained_gguf(OUTPUT_DIR + "-gguf", tokenizer, quantization_method="q4_k_m")

    print("✅ Training complete! Run `ollama create toolverse-regex -f ../inference/Modelfile.regex` to serve.")

if __name__ == "__main__":
    train()
