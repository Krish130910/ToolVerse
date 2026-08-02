"""
ToolVerse Machine Learning Central Configuration (ai/configs/config.py)
Shared configuration for fine-tuning, inference, datasets, and evaluation.
"""

import os
import torch

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# Base Models Registry
BASE_MODELS = {
  "qwen-coder-7b": "Qwen/Qwen2.5-Coder-7B-Instruct",
  "llama-3-8b": "meta-llama/Meta-Llama-3-8B-Instruct",
  "deepseek-6.7b": "deepseek-ai/deepseek-coder-6.7b-instruct",
}

# Active Base Model Choice
ACTIVE_BASE_MODEL = BASE_MODELS["qwen-coder-7b"]

# Training Hyperparameters
TRAINING_CONFIG = {
  "batch_size": 4,
  "gradient_accumulation_steps": 4,
  "learning_rate": 2e-4,
  "num_train_epochs": 3,
  "max_seq_length": 2048,
  "warmup_ratio": 0.05,
  "optim": "adamw_8bit",
  "lora_r": 16,
  "lora_alpha": 16,
  "lora_dropout": 0.05,
  "target_modules": ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
}

# Directory Paths
PATHS = {
  "datasets": os.path.join(BASE_DIR, "datasets"),
  "models": os.path.join(BASE_DIR, "models"),
  "regex_lora": os.path.join(BASE_DIR, "models", "regex-lora"),
  "regex_gguf": os.path.join(BASE_DIR, "models", "regex-gguf"),
  "experiments": os.path.join(BASE_DIR, "experiments"),
}

# Hardware Acceleration Setup
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
BF16_SUPPORTED = torch.cuda.is_available() and torch.cuda.is_bf16_supported()
