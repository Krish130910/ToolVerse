"""
ToolVerse AI Evaluation Suite — Advanced Regex Execution Benchmark
Evaluates regex compilation, positive test string matching, negative test string rejection,
Precision, Recall, F1-Score, and Average Latency across test sets.
"""

import json
import re
import time
import requests

MODEL_ENDPOINT = "http://localhost:11434/api/generate"
DATASET_PATH = "ai/datasets/regex.jsonl"

def compile_regex(pattern_str: str):
    try:
        return re.compile(pattern_str)
    except re.error:
        return None

def evaluate_model_performance():
    print("🧪 Running Advanced ToolVerse Regex Benchmark Suite...")
    print(f"📡 Serving Endpoint: {MODEL_ENDPOINT}")
    print(f"📄 Evaluation Dataset: {DATASET_PATH}\n")

    total_samples = 0
    compiled_count = 0
    total_tp = 0  # True Positives
    total_fp = 0  # False Positives
    total_fn = 0  # False Negatives
    total_tn = 0  # True Negatives
    total_latency_ms = 0.0

    try:
        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue
                item = json.loads(line)
                prompt = item["input"]
                positives = item.get("positives", [])
                negatives = item.get("negatives", [])
                total_samples += 1

                start_time = time.time()
                try:
                    res = requests.post(
                        MODEL_ENDPOINT,
                        json={
                            "model": "qwen2.5-coder:7b",
                            "prompt": f"Generate regex for: {prompt}",
                            "stream": False,
                        },
                        timeout=15,
                    )
                    latency = (time.time() - start_time) * 1000
                    total_latency_ms += latency

                    if res.status_code == 200:
                        text = res.json().get("response", "")
                        regex_match = re.search(r"```regex\s*(.*?)\s*```", text, re.DOTALL)
                        if regex_match:
                            pattern_str = regex_match.group(1).strip()
                            compiled_re = compile_regex(pattern_str)

                            if compiled_re:
                                compiled_count += 1
                                # Evaluate Positive Strings (Recall)
                                for pos_str in positives:
                                    if compiled_re.search(pos_str):
                                        total_tp += 1
                                    else:
                                        total_fn += 1

                                # Evaluate Negative Strings (Precision)
                                for neg_str in negatives:
                                    if compiled_re.search(neg_str):
                                        total_fp += 1
                                    else:
                                        total_tn += 1
                except Exception as err:
                    print(f"⚠️ Test sample evaluation error for '{prompt}': {err}")

        # Compute Metrics
        precision = (total_tp / (total_tp + total_fp)) * 100 if (total_tp + total_fp) > 0 else 0.0
        recall = (total_tp / (total_tp + total_fn)) * 100 if (total_tp + total_fn) > 0 else 0.0
        f1_score = (2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0
        syntax_rate = (compiled_count / total_samples) * 100 if total_samples > 0 else 0.0
        avg_latency = total_latency_ms / total_samples if total_samples > 0 else 0.0

        print("===================== EVALUATION BENCHMARK METRICS =====================")
        print(f"Total Evaluated Tasks       : {total_samples}")
        print(f"Syntax Compilation Rate     : {compiled_count} / {total_samples} ({syntax_rate:.1f}%)")
        print(f"True Positives (TP)         : {total_tp}")
        print(f"True Negatives (TN)         : {total_tn}")
        print(f"False Positives (FP)        : {total_fp}")
        print(f"False Negatives (FN)        : {total_fn}")
        print("------------------------------------------------------------------------")
        print(f"🎯 Precision                 : {precision:.2f}%")
        print(f"🎯 Recall                    : {recall:.2f}%")
        print(f"🎯 F1-Score                  : {f1_score:.2f}%")
        print(f"⚡ Average Inference Latency : {avg_latency:.2f} ms")
        print("========================================================================\n")

    except FileNotFoundError:
        print(f"⚠️ Dataset file not found at {DATASET_PATH}.")

if __name__ == "__main__":
    evaluate_model_performance()
