import requests

url = "http://127.0.0.1:8080/v1/chat/completions"

payload = {
    "messages": [
        {
            "role": "user",
            "content": "What are prions?"
        }
    ],
    "temperature": 0.2,
    "max_tokens": 800
}

response = requests.post(url, json=payload)

print("Status:", response.status_code)

data = response.json()

message = data["choices"][0]["message"]

print("\nREASONING:")
print(message.get("reasoning_content", ""))

print("\nFINAL ANSWER:")
print(message.get("content", ""))