"""
ToolVerse AI Model Evaluation & Telemetry Benchmark Suite
Evaluates accuracy, syntax validity, and latency for fine-tuned ToolVerse models.
"""

import json
import time
import re
import requests

MODEL_SERVER_URL = "http://localhost:11434/api/generate"
TEST_DATASET = "../datasets/regex.jsonl"

def is_valid_regex(pattern_str):
    try:
        re.compile(pattern_str)
        return True
    except re.error:
        return False

def evaluate():
    print("📊 Starting ToolVerse Model Evaluation Benchmark...")
    
    total = 0
    valid_syntax = 0
    total_latency = 0.0

    with open(TEST_DATASET, "r", encoding="utf-8") as f:
        for line in f:
            item = json.loads(line)
            prompt = item["input"]

            start_t = time.time()
            try:
                res = requests.post(
                    MODEL_SERVER_URL,
                    json={
                        "model": "qwen2.5-coder:7b",
                        "prompt": f"Generate regex for: {prompt}",
                        "stream": False
                    },
                    timeout=15
                )
                latency = (time.time() - start_t) * 1000
                total_latency += latency

                if res.status_code == 200:
                    text = res.json().get("response", "")
                    total += 1
                    
                    # Extract regex from codeblock
                    match = re.search(r"```regex\s*(.*?)\s*```", text, re.DOTALL)
                    if match:
                        extracted = match.group(1)
                        if is_valid_regex(extracted):
                            valid_syntax += 1

            except Exception as e:
                print(f"⚠️ Inference failed for '{prompt}': {e}")

    if total > 0:
        accuracy = (valid_syntax / total) * 100
        avg_latency = total_latency / total
        print("\n================ BENCHMARK RESULTS ================")
        print(f"Total Evaluated Test Samples: {total}")
        print(f"Valid Compiled Regex Syntax: {valid_syntax} / {total} ({accuracy:.1f}%)")
        print(f"Average Inference Latency: {avg_latency:.2f} ms")
        print("====================================================\n")

if __name__ == "__main__":
    evaluate()
