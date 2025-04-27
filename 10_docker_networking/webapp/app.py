from flask import Flask
import redis
import os
import socket

app = Flask(__name__)
# Używamy nazwy usługi 'cache' jako hosta dla Redis
redis_host = 'cache'
r = redis.Redis(host=redis_host, port=6379, db=0, decode_responses=True)

@app.route('/')
def hello():
    try:
        # Spróbujmy zwiększyć licznik w Redis
        count = r.incr('hits')
        hostname = socket.gethostname()
        return f"Hello from webapp container: {hostname}! Page hit count: {count}.\n"
    except redis.exceptions.ConnectionError as e:
        hostname = socket.gethostname()
        return f"Hello from webapp container: {hostname}! Could not connect to Redis cache ({redis_host}): {e}\n", 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
