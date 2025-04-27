import time, os

print(f"Watcher Service App started (PID: {os.getpid()}). Checking config/code marker every 5s.")
config_path = '/app/config/config.ini'
code_marker_path = '/app/src/marker.txt' # Plik do testowania 'sync'

# Utwórz plik znacznika, jeśli nie istnieje
if not os.path.exists(code_marker_path):
    with open(code_marker_path, 'w') as f:
        f.write("Initial code marker\n")

while True:
    config_content = "Config file not found"
    code_marker_content = "Code marker file not found"

    try:
        with open(config_path, 'r') as f:
            config_content = f.read().strip()
    except Exception:
        pass # Zachowaj domyślną wiadomość

    try:
        with open(code_marker_path, 'r') as f:
            code_marker_content = f.read().strip()
    except Exception:
        pass # Zachowaj domyślną wiadomość

    print(f"Config: [{config_content}] --- Code marker: [{code_marker_content}]")
    time.sleep(5)