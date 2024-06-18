import os
import sys
import webview
from flask import Flask, send_from_directory

# Determine the absolute path to the 'dist' directory
BASE_DIR = getattr(sys, "_MEIPASS", os.path.abspath(os.path.dirname(__file__)))
DIST_DIR = os.path.join(BASE_DIR, "frontend", "dist")

# Initialize Flask application
app = Flask(__name__, static_folder=DIST_DIR, static_url_path="")


# Serve the React frontend
@app.route("/")
def index():
    try:
        return send_from_directory(DIST_DIR, "index.html")
    except Exception as e:
        return f"Error: {e}", 500


# Example API endpoint
@app.route("/api/data")
def get_data():
    # Example: Return some data as JSON
    return {"message": "Hello from Python API"}


def start_flask_app():
    # Run Flask app on localhost:5001
    try:
        app.run(host="localhost", port=5001)
    except Exception as e:
        print(f"Error starting Flask: {e}")


def start_pywebview():
    # Create Pywebview window
    try:
        webview.create_window("Rymn", "http://localhost:5001", width=1000, height=800)
        webview.start()
    except Exception as e:
        print(f"Error starting Pywebview: {e}")


if __name__ == "__main__":
    import threading

    # Start Flask app in a separate thread
    flask_thread = threading.Thread(target=start_flask_app)
    flask_thread.start()

    # Start Pywebview in the main thread
    start_pywebview()
