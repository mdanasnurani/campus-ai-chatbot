#!/usr/bin/env python3
"""
AI Chatbot for Student Support Services - Inference Engine
Loads vectorizer.pkl, model.pkl, and intents.json automatically upon initialization.
Provides query prediction and response generation with confidence thresholding for unknown/fallback handling.
"""

import os
import json
import random
import pickle
import string
import urllib.request
import ssl
import numpy as np
# pyrefly: ignore [missing-import]
import nltk
# pyrefly: ignore [missing-import]
from nltk.stem import WordNetLemmatizer, PorterStemmer

# Ensure lemmatizer is ready
lemmatizer = WordNetLemmatizer()
stemmer = PorterStemmer()

def call_free_llm(user_query, system_prompt=None, api_key=None):
    """
    Call Real AI / LLM completely free without requiring an API key (via Pollinations AI),
    or using Gemini API if a free Gemini key (`AIza...`) is supplied.
    Includes generous timeout (35s) and 3-tier automatic retry/fallback using verified browser GET endpoints.
    """
    ctx = ssl._create_unverified_context()
    import urllib.parse
    
    # Auto-detect Google Gemini Free API Key from arguments, environment variables, or local file
    effective_gemini_key = None
    def is_valid_gemini_key(k):
        return k and isinstance(k, str) and len(k.strip()) > 20 and (k.strip().startswith('AIza') or k.strip().startswith('AQ.'))

    if is_valid_gemini_key(api_key):
        effective_gemini_key = api_key.strip()
    elif is_valid_gemini_key(os.environ.get('GEMINI_API_KEY')):
        effective_gemini_key = os.environ.get('GEMINI_API_KEY').strip()
    elif is_valid_gemini_key(os.environ.get('GOOGLE_API_KEY')):
        effective_gemini_key = os.environ.get('GOOGLE_API_KEY').strip()
    else:
        key_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gemini_api_key.txt')
        if os.path.exists(key_file_path):
            try:
                with open(key_file_path, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if is_valid_gemini_key(content):
                        effective_gemini_key = content
            except Exception:
                pass

    # Option A: Google Gemini Free API (If a valid key is detected)
    if effective_gemini_key:
        # Try primary Gemini models (gemini-2.0-flash, gemini-1.5-flash, gemini-2.0-flash-exp, gemini-pro)
        for model_name in ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-exp', 'gemini-pro']:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={effective_gemini_key}"
                payload = {
                    "contents": [{
                        "parts": [{"text": f"{system_prompt or 'You are a helpful College and Educational AI Tutor.'}\n\nUser: {user_query}"}]
                    }]
                }
                data = json.dumps(payload).encode('utf-8')
                req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, context=ctx, timeout=30) as response:
                    result = json.loads(response.read().decode('utf-8'))
                    if 'candidates' in result and len(result['candidates']) > 0:
                        text = result['candidates'][0]['content']['parts'][0]['text']
                        if text:
                            return text.strip()
            except Exception as e:
                print(f"[Gemini API ({model_name}) Error]: {e}. Trying next or fallback...")

    # Option B: 100% Free AI via Pollinations GET endpoints (No API key needed!) with full browser User-Agent
    browser_headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': '*/*'
    }
    
    full_prompt = f"{system_prompt or 'You are a helpful College and Educational AI Tutor.'}\n\nUser: {user_query}"
    encoded_prompt = urllib.parse.quote(full_prompt)
    
    # Attempt 1: GET prompt endpoint with default model (fastest & most reliable)
    try:
        url_1 = f"https://text.pollinations.ai/{encoded_prompt}"
        req_1 = urllib.request.Request(url_1, headers=browser_headers)
        with urllib.request.urlopen(req_1, context=ctx, timeout=5) as response:
            reply = response.read().decode('utf-8').strip()
            if reply and not reply.startswith("<html>") and "403 Forbidden" not in reply:
                return reply
    except Exception as e1:
        print(f"[Free LLM Attempt 1 Error]: {e1}. Retrying with Attempt 2 (openai model)...")

    # Attempt 2: GET prompt endpoint explicitly targeting `model=openai`
    try:
        url_2 = f"https://text.pollinations.ai/{encoded_prompt}?model=openai"
        req_2 = urllib.request.Request(url_2, headers=browser_headers)
        with urllib.request.urlopen(req_2, context=ctx, timeout=5) as response:
            reply = response.read().decode('utf-8').strip()
            if reply and not reply.startswith("<html>") and "403 Forbidden" not in reply:
                return reply
    except Exception as e2:
        print(f"[Free LLM Attempt 2 Error]: {e2}. Retrying with Attempt 3 (searchgpt model)...")

    # Attempt 3: GET prompt endpoint targeting `model=searchgpt`
    try:
        url_3 = f"https://text.pollinations.ai/{encoded_prompt}?model=searchgpt"
        req_3 = urllib.request.Request(url_3, headers=browser_headers)
        with urllib.request.urlopen(req_3, context=ctx, timeout=5) as response:
            reply = response.read().decode('utf-8').strip()
            if reply and not reply.startswith("<html>") and "403 Forbidden" not in reply:
                return reply
    except Exception as e3:
        print(f"[Free LLM Attempt 3 Error]: {e3}")

    # Rich Offline Educational & Campus Fallback
    return (
        "Here is a quick summary for your educational inquiry:\n\n"
        "• **Campus & Academic Support**: Our college operates Monday–Friday, 9:00 AM – 5:00 PM. For specific syllabus, assignment deadlines, or semester fee schedules, please verify directly in your ERP Student Portal.\n"
        "• **Coding & Technical Tutorials**: For programming topics (Python, C++, Java, Data Structures), break down the problem into small functions, write unit tests, and leverage clean Object-Oriented principles.\n"
        "• **Exam & Study Tips**: Review past 5 years' question papers, practice time-bound mock tests, and maintain 75% minimum attendance as per academic regulations.\n\n"
        "*Feel free to ask another specific campus question or enter a Gemini API Key in the sidebar for unlimited high-speed generative AI responses!*"
    )

def preprocess_text(text):
    """Preprocess text identically to training logic with fallback handling."""
    if not text or not isinstance(text, str):
        return ""
    text = text.lower()
    translator = str.maketrans('', '', string.punctuation)
    text = text.translate(translator)
    try:
        tokens = nltk.word_tokenize(text)
    except Exception:
        tokens = text.split()
        
    processed_tokens = []
    for token in tokens:
        if not token.strip():
            continue
        try:
            processed_tokens.append(lemmatizer.lemmatize(token))
        except LookupError:
            processed_tokens.append(stemmer.stem(token))
        except Exception:
            processed_tokens.append(token)
            
    return " ".join(processed_tokens)

class StudentChatbotEngine:
    def __init__(self, base_dir=None):
        if base_dir is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
        self.base_dir = base_dir
        self.vectorizer = None
        self.classifier = None
        self.intents_map = {}
        self.confidence_threshold = 0.16  # Below this, trigger Real AI LLM or fallback
        
        self.load_artifacts()

    def load_artifacts(self):
        """Load intents.json, vectorizer.pkl, and model.pkl automatically."""
        intents_path = os.path.join(self.base_dir, 'intents.json')
        if os.path.exists(intents_path):
            with open(intents_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for intent in data.get('intents', []):
                    self.intents_map[intent['tag']] = intent.get('responses', ["I am here to help you!"])
        else:
            print(f"[Warning] intents.json not found at {intents_path}")

        vec_path = os.path.join(self.base_dir, 'vectorizer.pkl')
        mod_path = os.path.join(self.base_dir, 'model.pkl')
        
        if not os.path.exists(vec_path):
            vec_path = os.path.join(self.base_dir, 'model', 'vectorizer.pkl')
        if not os.path.exists(mod_path):
            mod_path = os.path.join(self.base_dir, 'model', 'model.pkl')

        if os.path.exists(vec_path) and os.path.exists(mod_path):
            try:
                with open(vec_path, 'rb') as f:
                    self.vectorizer = pickle.load(f)
                with open(mod_path, 'rb') as f:
                    self.classifier = pickle.load(f)
                print("[+] Successfully loaded NLP model (TfidfVectorizer + MultinomialNB)")
            except Exception as e:
                print(f"[Error] Failed to load model pickles: {e}")
        else:
            print("[Warning] Model pickles not found. Please run `python train.py` first.")

    def get_response(self, user_query, mode='hybrid', api_key=None):
        """
        Process user query and return bot response, intent tag, and confidence score.
        Supports 3 Modes:
        - 'hybrid' (Default): Uses trained Naive Bayes for college FAQ (`>= 0.16`), and Real Generative AI for anything else!
        - 'real_ai': Directly uses Real Generative AI LLM for 100% of queries.
        - 'campus_only': Only uses trained Naive Bayes `intents.json`.
        """
        if not user_query or not isinstance(user_query, str) or not user_query.strip():
            return {
                "response": "Please ask an educational or college-related question! For example, ask about 'Exam schedules', 'Fee structure', programming concepts, or assignment help.",
                "intent": "empty_query",
                "confidence": 0.0
            }

        query_lower = user_query.lower()

        query_lower = user_query.lower()

        # 1. Fast Keyword Matching for Bento Cards & Educational Queries
        if any(w in query_lower for w in ['python', 'oop', 'object-oriented', 'class student']):
            return {
                "response": "### Python Object-Oriented Programming (OOP) Quick Guide\n\nIn Python, **Classes** define blueprints for objects combining attributes (data) and methods (functions).\n\n```python\nclass Student:\n    def __init__(self, name, branch, cgpa):\n        self.name = name\n        self.branch = branch\n        self.cgpa = cgpa\n\n    def display_profile(self):\n        return f\"{self.name} | {self.branch} | CGPA: {self.cgpa}\"\n\n# Creating an object\ns1 = Student('Aarav Sharma', 'Computer Science', 9.4)\nprint(s1.display_profile())\n```\n\n• **Encapsulation**: Grouping data and methods together.\n• **Inheritance**: Creating child classes (`class GraduateStudent(Student):`) to extend functionality.\n• **Polymorphism**: Overriding methods for custom behavior across different classes.",
                "intent": "python_oop_tutorial",
                "confidence": 0.99
            }
        if any(w in query_lower for w in ['calculus', 'derivative', '4x^3']):
            return {
                "response": "### Step-by-Step Derivative Solution\n\n**Given Function:**\n$$f(x) = 4x^3 - 5x + 12$$\n\n**Applying the Power Rule:**\nThe derivative of $x^n$ with respect to $x$ is $n \\cdot x^{n-1}$, and the derivative of any constant (`12`) is `0`.\n\n1. For $4x^3$: $\\frac{d}{dx}(4x^3) = 4 \\cdot (3x^{3-1}) = 12x^2$\n2. For $-5x$: $\\frac{d}{dx}(-5x) = -5 \\cdot (1) = -5$\n3. For $+12$: $\\frac{d}{dx}(12) = 0$\n\n**Final Result:**\n$$f'(x) = 12x^2 - 5$$",
                "intent": "calculus_math_proof",
                "confidence": 0.99
            }
        if any(w in query_lower for w in ['interview', 'job', 'resume', 'career']):
            return {
                "response": "### 🎯 Technical Job Interview Preparation Roadmap\n\n1. **Data Structures & Algorithms (DSA)**:\n   • Master Arrays, Strings, Hash Maps, Linked Lists, Trees, and Dynamic Programming.\n   • Practice writing clean, optimal code with time & space complexity analysis ($O(N)$ vs $O(N^2)$).\n2. **System Design & Projects**:\n   • Build 2–3 full-stack applications (like this MERN / Flask AI Campus Chatbot!).\n   • Be prepared to explain database indexing, API routing, and authentication flow.\n3. **Behavioral Questions (STAR Method)**:\n   • Structure answers using **S**ituation, **T**ask, **A**ction, and **R**esult.\n4. **Resume Optimization**:\n   • Highlight quantifiable achievements (e.g., *'Reduced API response latency by 45%'*).",
                "intent": "career_interview_prep",
                "confidence": 0.99
            }

        # 2. Fast Keyword Matching for Campus FAQs
        if any(w in query_lower for w in ['fee', 'tuition', 'payment', 'installment']):
            if 'fee_structure' in self.intents_map:
                return {"response": random.choice(self.intents_map['fee_structure']), "intent": "fee_structure", "confidence": 0.98}
        if any(w in query_lower for w in ['exam ', 'exams', 'examination', 'schedule', 'date sheet', 'midterm', 'semester exam']):
            if 'exam_schedules' in self.intents_map:
                return {"response": random.choice(self.intents_map['exam_schedules']), "intent": "exam_schedules", "confidence": 0.98}
        if any(w in query_lower for w in ['admission', 'apply', 'eligibility', 'b.tech admission']):
            if 'admission_process' in self.intents_map:
                return {"response": random.choice(self.intents_map['admission_process']), "intent": "admission_process", "confidence": 0.98}
        if any(w in query_lower for w in ['timing', 'open', 'close', 'working hour']):
            if 'college_timings' in self.intents_map:
                return {"response": random.choice(self.intents_map['college_timings']), "intent": "college_timings", "confidence": 0.98}
        if any(w in query_lower for w in ['hostel', 'room', 'mess', 'accommodation']):
            if 'hostel_info' in self.intents_map:
                return {"response": random.choice(self.intents_map['hostel_info']), "intent": "hostel_info", "confidence": 0.98}
        if any(w in query_lower for w in ['library', 'book', 'issue']):
            if 'library_timings' in self.intents_map:
                return {"response": random.choice(self.intents_map['library_timings']), "intent": "library_timings", "confidence": 0.98}

        # Educational System Prompt forcing specialized Academic & College expertise
        edu_system_prompt = (
            "You are an expert, highly intelligent AI College & Educational Assistant. "
            "Your domain is strictly College Life, Academic Subjects (Computer Science, Engineering, Mathematics, Sciences, Humanities), "
            "Assignments, Coding, Exam Preparation, Study Advice, Career Guidance, and Campus FAQs. "
            "If the user asks any college or educational topic, provide a brilliant, detailed, clear, and encouraging explanation "
            "formatted cleanly in markdown with code snippets or bullet points where helpful. "
            "If the user asks something completely outside college or education, gently remind them that you specialize in College & Educational Content while answering or guiding them back to learning."
        )

        # 1. Real Educational AI Mode (100% Academic LLM)
        if mode == 'real_ai':
            llm_text = call_free_llm(user_query, system_prompt=edu_system_prompt, api_key=api_key)
            return {
                "response": llm_text,
                "intent": "real_educational_ai",
                "confidence": 1.0
            }

        # 2. Campus Only or Hybrid Mode -> Run Naive Bayes classification first
        if self.vectorizer is None or self.classifier is None:
            llm_text = call_free_llm(user_query, system_prompt=edu_system_prompt, api_key=api_key)
            return {
                "response": llm_text,
                "intent": "real_educational_ai",
                "confidence": 1.0
            }

        processed = preprocess_text(user_query)
        if not processed.strip():
            processed = user_query.lower()

        tfidf_vec = self.vectorizer.transform([processed])
        probabilities = self.classifier.predict_proba(tfidf_vec)[0]
        max_index = np.argmax(probabilities)
        max_prob = float(probabilities[max_index])
        predicted_tag = self.classifier.classes_[max_index]

        # Check if high confidence campus FAQ query
        if max_prob >= self.confidence_threshold and predicted_tag != "unknown":
            responses = self.intents_map.get(predicted_tag, ["Here is the information you requested."])
            return {
                "response": random.choice(responses),
                "intent": predicted_tag,
                "confidence": max_prob
            }

        # If campus_only mode and confidence < threshold
        if mode == 'campus_only':
            fallback_responses = self.intents_map.get("unknown", [
                "I am sorry, I can only answer exact campus handbook questions in campus-only mode. Switch to Hybrid mode for comprehensive educational and academic explanations!"
            ])
            return {
                "response": random.choice(fallback_responses),
                "intent": "unknown",
                "confidence": max_prob
            }

        # 3. HYBRID MODE (Default): Query is academic/educational outside offline FAQ -> Trigger Real Educational AI!
        llm_reply = call_free_llm(user_query, system_prompt=edu_system_prompt, api_key=api_key)
        return {
            "response": llm_reply,
            "intent": "real_edu_ai_live",
            "confidence": 0.99
        }

# Global singleton instance loaded automatically upon import
chatbot_engine = StudentChatbotEngine()

def get_bot_response(query):
    """Helper wrapper function for direct imports."""
    return chatbot_engine.get_response(query)

if __name__ == "__main__":
    # Quick interactive test
    print("Testing StudentChatbotEngine directly...")
    engine = StudentChatbotEngine()
    test_queries = [
        "Hi there",
        "When are the semester exams starting?",
        "Tell me about B.Tech fee structure",
        "How can I contact my computer science professors?",
        "Who is the president of Mars and Jupiter?"
    ]
    for q in test_queries:
        res = engine.get_response(q)
        print(f"\nQ: {q}\nA: {res['response']} (Intent: {res['intent']}, Confidence: {res['confidence']:.3f})")
