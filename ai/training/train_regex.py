"""
ToolVerse ML Pipeline — Fine-Tuning Regex Model (regex-v1.2-ft)
Base Model: Qwen/Qwen2.5-Coder-7B-Instruct
Datasets: ai/datasets/regex_train.jsonl and ai/datasets/regex_val.jsonl
Config: ai/configs/config.py
"""

import os
import sys
import torch
from datasets import load_dataset
from transformers import TrainingArguments
from trl import SFTTrainer

# Import Central Config
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from configs.config import ACTIVE_BASE_MODEL, TRAINING_CONFIG, PATHS, BF16_SUPPORTED

try:
    from unsloth import FastLanguageModel
    HAS_UNSLOTH = True
except ImportError:
    HAS_UNSLOTH = False
    from transformers import AutoModelForCausalLM, AutoTokenizer
    from peft import LoraConfig, get_peft_model

TRAIN_DATASET_PATH = os.path.join(PATHS["datasets"], "regex_train.jsonl")
VAL_DATASET_PATH = os.path.join(PATHS["datasets"], "regex_val.jsonl")
OUTPUT_DIR = PATHS["regex_lora"]

def format_chatml_prompts(batch):
    formatted_texts = []
    for instruction, user_input, output in zip(batch["instruction"], batch["input"], batch["output"]):
        prompt = (
            f"<|im_start|>system\n"
            f"You are the ToolVerse Specialized Regex Model (regex-v1.2-ft).\n"
            f"Your job is to convert English descriptions into accurate regular expressions with line-by-line explanations.<|im_end|>\n"
            f"<|im_start|>user\n"
            f"{instruction}: {user_input}<|im_end|>\n"
            f"<|im_start|>assistant\n"
            f"{output}<|im_end|>"
        )
        formatted_texts.append(prompt)
    return {"text": formatted_texts}

def main():
    print(f"🚀 Initializing ToolVerse Regex Model Fine-Tuning Pipeline...")
    print(f"📌 Base Model: {ACTIVE_BASE_MODEL}")
    print(f"📂 Train Dataset Path: {os.path.abspath(TRAIN_DATASET_PATH)}")
    print(f"📂 Validation Dataset Path: {os.path.abspath(VAL_DATASET_PATH)}")
    print(f"💾 Target LoRA Output: {os.path.abspath(OUTPUT_DIR)}")

    if not os.path.exists(TRAIN_DATASET_PATH):
        print(f"⚠️ Train dataset missing at {TRAIN_DATASET_PATH}.")
        sys.exit(1)

    # 1. Load Model & Tokenizer
    if HAS_UNSLOTH:
        print("⚡ Loading Qwen2.5-Coder-7B via Unsloth 4-bit QLoRA Engine...")
        model, tokenizer = FastLanguageModel.from_pretrained(
            model_name=ACTIVE_BASE_MODEL,
            max_seq_length=TRAINING_CONFIG["max_seq_length"],
            dtype=None,
            load_in_4bit=True,
        )
        model = FastLanguageModel.get_peft_model(
            model,
            r=TRAINING_CONFIG["lora_r"],
            target_modules=TRAINING_CONFIG["target_modules"],
            lora_alpha=TRAINING_CONFIG["lora_alpha"],
            lora_dropout=TRAINING_CONFIG["lora_dropout"],
            bias="none",
            use_gradient_checkpointing="unsloth",
        )
    else:
        print("ℹ️ Unsloth not detected. Loading via Hugging Face PEFT...")
        tokenizer = AutoTokenizer.from_pretrained(ACTIVE_BASE_MODEL, trust_remote_code=True)
        model = AutoModelForCausalLM.from_pretrained(
            ACTIVE_BASE_MODEL,
            torch_dtype=torch.float16,
            device_map="auto",
            trust_remote_code=True,
        )
        peft_config = LoraConfig(
            r=TRAINING_CONFIG["lora_r"],
            lora_alpha=TRAINING_CONFIG["lora_alpha"],
            target_modules=["q_proj", "v_proj"],
            lora_dropout=TRAINING_CONFIG["lora_dropout"],
            bias="none",
            task_type="CAUSAL_LM",
        )
        model = get_peft_model(model, peft_config)

    # 2. Load Train and Validation Splits
    print("📊 Loading Train & Validation Dataset Splits...")
    train_ds = load_dataset("json", data_files=TRAIN_DATASET_PATH, split="train")
    train_ds = train_ds.map(format_chatml_prompts, batched=True)

    val_ds = None
    if os.path.exists(VAL_DATASET_PATH):
        val_ds = load_dataset("json", data_files=VAL_DATASET_PATH, split="train")
        val_ds = val_ds.map(format_chatml_prompts, batched=True)

    # 3. Configure SFTTrainer over Epochs
    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        per_device_train_batch_size=TRAINING_CONFIG["batch_size"],
        gradient_accumulation_steps=TRAINING_CONFIG["gradient_accumulation_steps"],
        num_train_epochs=TRAINING_CONFIG["num_train_epochs"],
        learning_rate=TRAINING_CONFIG["learning_rate"],
        warmup_ratio=TRAINING_CONFIG["warmup_ratio"],
        fp16=not BF16_SUPPORTED,
        bf16=BF16_SUPPORTED,
        logging_steps=5,
        evaluation_strategy="steps" if val_ds else "no",
        eval_steps=20 if val_ds else None,
        save_strategy="epoch",
        optim=TRAINING_CONFIG["optim"],
    )

    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=train_ds,
        eval_dataset=val_ds,
        dataset_text_field="text",
        max_seq_length=TRAINING_CONFIG["max_seq_length"],
        args=training_args,
    )

    print(f"✅ Training Pipeline Configured ({TRAINING_CONFIG['num_train_epochs']} Epochs)!")

if __name__ == "__main__":
    main()
