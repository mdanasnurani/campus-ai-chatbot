import sys
import os

# Add parent directory to sys.path so app.py and chatbot.py can be imported cleanly
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from app import app

# Vercel serverless functions look for the WSGI application object called 'app'
__all__ = ['app']
