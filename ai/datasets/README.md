# ToolVerse AI Datasets Registry

This directory contains specialized JSONL instruction datasets used for fine-tuning in-house models for ToolVerse.

## Datasets List

- `regex.jsonl`: Instruction-Input-Output pairs for English-to-Regex translation, line-by-line syntax explanation, and test cases.

## Format Schema

```json
{
  "instruction": "Convert English requirement into regex",
  "input": "Match valid IPv4 addresses",
  "output": "```regex\n^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$\n```"
}
```
