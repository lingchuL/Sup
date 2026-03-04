"""测试 API 是否真的返回 Claude 4.6 模型，检查 response headers 和 request-id"""
import httpx
import json

API_KEY = "sk-PzuqkdLLqmyp0FfIeHadWJa4qF26YZRcrmcFYrQD4SYJ3nIw"
BASE_URL = "https://www.dmxapi.cn/v1"

def test_model(model_name="claude-opus-4-6"):
    print(f"=== 测试模型: {model_name} ===\n")

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model_name,
        "max_tokens": 100,
        "messages": [
            {"role": "user", "content": "回复你的真实模型ID，只回复模型名称，不要多余内容。"}
        ],
    }

    with httpx.Client(timeout=30) as client:
        resp = client.post(f"{BASE_URL}/chat/completions", headers=headers, json=payload)

    print(f"HTTP Status: {resp.status_code}")
    print(f"\n--- Response Headers ---")
    for k, v in resp.headers.items():
        # 重点关注这些头
        if any(x in k.lower() for x in ["request-id", "x-request-id", "anthropic", "model", "claude", "via", "server"]):
            print(f"  * {k}: {v}")
        else:
            print(f"    {k}: {v}")

    print(f"\n--- Response Body ---")
    data = resp.json()
    print(json.dumps(data, indent=2, ensure_ascii=False))

    # 提取关键信息
    if "model" in data:
        print(f"\n返回的 model 字段: {data['model']}")
    if "id" in data:
        print(f"返回的 id 字段: {data['id']}")
    if "choices" in data and data["choices"]:
        content = data["choices"][0].get("message", {}).get("content", "")
        print(f"模型自称: {content}")

if __name__ == "__main__":
    test_model("glm-5")
