#!/usr/bin/env python3
"""
AI Chatbot for Student Support Services - Flask Backend
Handles web routes, user chat processing, and quick question suggestions.
Loads the trained scikit-learn Naive Bayes NLP model upon startup.
"""

import os
from datetime import datetime
from flask import Flask, render_template, request, jsonify, make_response
from chatbot import get_bot_response, chatbot_engine

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, 
            template_folder=os.path.join(BASE_DIR, 'templates'), 
            static_folder=os.path.join(BASE_DIR, 'static'),
            static_url_path='/static')
app.config['JSON_SORT_KEYS'] = False

@app.route('/')
def index():
    """Render the high-converting Velocity-inspired Landing Page."""
    return render_template('index.html')

@app.route('/app')
@app.route('/chat-ui')
@app.route('/chatbot')
def chat_app():
    """Render the main ChatGPT-inspired chat interface."""
    return render_template('chat.html')


@app.route('/chat', methods=['POST'])
def chat():
    """
    Handle chat interaction from the frontend.
    Expects JSON request: { "message": "user query string" }
    Returns JSON: { "response": "bot reply", "intent": "detected_tag", "confidence": float, "timestamp": "time str" }
    """
    try:
        if not request.is_json:
            return jsonify({
                "status": "error",
                "message": "Request must be in JSON format with a 'message' field."
            }), 400
            
        data = request.get_json()
        user_message = data.get('message', '').strip()
        mode = data.get('mode', 'hybrid')
        api_key = data.get('api_key', '').strip() or None
        
        if not user_message:
            return jsonify({
                "status": "error",
                "message": "Message field cannot be empty."
            }), 400
            
        # Get prediction from chatbot inference engine with Real AI support
        bot_result = chatbot_engine.get_response(user_message, mode=mode, api_key=api_key)
        
        # Current formatted timestamp
        current_time = datetime.now().strftime("%I:%M %p")
        
        return jsonify({
            "status": "success",
            "response": bot_result.get("response", "I am here to help you!"),
            "intent": bot_result.get("intent", "unknown"),
            "confidence": round(bot_result.get("confidence", 0.0), 3),
            "timestamp": current_time
        }), 200

    except Exception as e:
        # Proper error handling
        print(f"[Server Error in /chat]: {e}")
        return jsonify({
            "status": "error",
            "message": "An internal server error occurred while processing your request."
        }), 500

@app.route('/quick-questions', methods=['GET'])
def quick_questions():
    """Return a curated list of popular student queries for the sidebar and welcome screen."""
    questions = [
        {"icon": "🕒", "label": "College Timings", "query": "What are the college timings?"},
        {"icon": "📅", "label": "Exam Schedule", "query": "When are the semester exams starting?"},
        {"icon": "🎓", "label": "Admission Process", "query": "What is the admission process for B.Tech?"},
        {"icon": "💳", "label": "Fee Structure", "query": "What is the fee structure for B.Tech?"},
        {"icon": "🏆", "label": "Scholarship Info", "query": "Are there any scholarships available?"},
        {"icon": "📚", "label": "Library Timings", "query": "What are the library timings?"},
        {"icon": "🏢", "label": "Hostel Facilities", "query": "What are the hostel facilities available?"},
        {"icon": "🚀", "label": "Placement Cell", "query": "Tell me about campus placements"},
        {"icon": "📊", "label": "Attendance Rules", "query": "What is the minimum attendance requirement?"},
        {"icon": "💻", "label": "Courses Offered", "query": "Which engineering branches are available?"}
    ]
    return jsonify({"status": "success", "questions": questions}), 200

@app.route('/status', methods=['GET'])
def status():
    """Health check and model status endpoint."""
    model_loaded = chatbot_engine.vectorizer is not None and chatbot_engine.classifier is not None
    return jsonify({
        "status": "healthy",
        "model_loaded": model_loaded,
        "total_intents": len(chatbot_engine.intents_map),
        "confidence_threshold": chatbot_engine.confidence_threshold
    }), 200

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors cleanly."""
    return jsonify({"status": "error", "message": "Endpoint not found."}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors cleanly."""
    return jsonify({"status": "error", "message": "Internal server error."}), 500

if __name__ == '__main__':
    import os
    import webbrowser
    import threading

    def open_browser():
        try:
            webbrowser.open_new("http://127.0.0.1:5001/app")
        except Exception:
            pass

    # Auto-open browser on clean start or inside Werkzeug reloader child process
    if os.environ.get('WERKZEUG_RUN_MAIN') == 'true' or not os.environ.get('WERKZEUG_RUN_MAIN'):
        threading.Timer(1.25, open_browser).start()

    print("=" * 64)
    print("   🚀 Campus AI Server Successfully Started!")
    print("=" * 64)
    print("   💬 MAIN CHAT BOX DIRECT:  http://127.0.0.1:5001/app")
    print("   🌐 Landing Page (Home):   http://127.0.0.1:5001/")
    print("=" * 64)
    app.run(host='127.0.0.1', port=5001, debug=True)
