import requests
import time

while True:
    try:
        start = time.time()
        response = requests.get('https://api.telegram.org', timeout=5)
        latency = (time.time() - start) * 1000  # ms
        print(f"Status: {response.status_code}, Latency: {latency:.2f} ms")
    except Exception as e:
        print(f"Error: {e}")
    time.sleep(5)  # lặp lại mỗi 5s
