#!/usr/bin/env python3
"""
AI Chatbot for Student Support Services - Training Script
Trains a TfidfVectorizer and Multinomial Naive Bayes classifier on intents.json.
Saves the trained model and vectorizer as pickle files.
"""

import os
import json
import pickle
import string
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, accuracy_score

# Ensure NLTK resources are available
import ssl
import nltk
from nltk.stem import WordNetLemmatizer, PorterStemmer

def ensure_nltk_resources():
    """Download required NLTK datasets safely, handling macOS SSL certificates."""
    try:
        _create_unverified_https_context = ssl._create_unverified_context
    except AttributeError:
        pass
    else:
        ssl._create_default_https_context = _create_unverified_https_context

    resources = ['punkt', 'punkt_tab', 'wordnet', 'omw-1.4']
    for res in resources:
        try:
            if 'punkt' in res:
                nltk.data.find(f'tokenizers/{res}')
            else:
                nltk.data.find(f'corpora/{res}')
        except LookupError:
            try:
                nltk.download(res, quiet=True)
            except Exception as e:
                print(f"[Warning] Could not download NLTK resource '{res}': {e}")

ensure_nltk_resources()
lemmatizer = WordNetLemmatizer()
stemmer = PorterStemmer()

def preprocess_text(text):
    """
    Preprocess text for NLP:
    1. Lowercase
    2. Remove punctuation
    3. Tokenize and lemmatize (with stemmer/simple token fallback)
    """
    if not text or not isinstance(text, str):
        return ""
    
    # Lowercase
    text = text.lower()
    
    # Remove punctuation
    translator = str.maketrans('', '', string.punctuation)
    text = text.translate(translator)
    
    # Tokenize
    try:
        tokens = nltk.word_tokenize(text)
    except Exception:
        tokens = text.split()
        
    # Lemmatize or stem fallback
    processed_tokens = []
    for token in tokens:
        if not token.strip():
            continue
        try:
            processed_tokens.append(lemmatizer.lemmatize(token))
        except LookupError:
            # Fallback if wordnet dictionary failed to download
            processed_tokens.append(stemmer.stem(token))
        except Exception:
            processed_tokens.append(token)
            
    return " ".join(processed_tokens)

def train_chatbot():
    print("=" * 60)
    print("   AI Student Support Chatbot - Model Training Pipeline   ")
    print("=" * 60)
    
    # 1. Load intents.json
    intents_path = os.path.join(os.path.dirname(__file__), 'intents.json')
    if not os.path.exists(intents_path):
        raise FileNotFoundError(f"Error: Could not find '{intents_path}'")
        
    print(f"[*] Loading training patterns from: {intents_path}")
    with open(intents_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    X_raw = []
    y = []
    
    for intent in data.get('intents', []):
        tag = intent.get('tag')
        for pattern in intent.get('patterns', []):
            X_raw.append(pattern)
            y.append(tag)
            
    print(f"[*] Total training patterns: {len(X_raw)}")
    print(f"[*] Total unique intents: {len(set(y))}")
    
    # 2. Preprocess texts
    print("[*] Preprocessing training data (Tokenization & Lemmatization)...")
    X_processed = [preprocess_text(text) for text in X_raw]
    
    # 3. Initialize TfidfVectorizer and fit_transform
    print("[*] Extracting features using TfidfVectorizer (N-grams: 1-2)...")
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=1500, sublinear_tf=True)
    X_tfidf = vectorizer.fit_transform(X_processed)
    
    print(f"[*] TF-IDF Matrix Shape: {X_tfidf.shape}")
    
    # 4. Train Multinomial Naive Bayes Classifier
    print("[*] Training Multinomial Naive Bayes Classifier (MultinomialNB)...")
    # alpha=0.1 helps give better probability separation on small conversational datasets
    classifier = MultinomialNB(alpha=0.1)
    classifier.fit(X_tfidf, y)
    
    # 5. Evaluate training performance
    y_pred = classifier.predict(X_tfidf)
    acc = accuracy_score(y, y_pred)
    print(f"\n[+] Model Training Complete! Training Accuracy: {acc * 100:.2f}%")
    print("-" * 60)
    
    # 6. Save models using pickle (both in root directory and inside 'model/' directory)
    root_dir = os.path.dirname(os.path.abspath(__file__))
    model_dir = os.path.join(root_dir, 'model')
    os.makedirs(model_dir, exist_ok=True)
    
    paths_to_save = [
        (os.path.join(root_dir, 'vectorizer.pkl'), os.path.join(root_dir, 'model.pkl')),
        (os.path.join(model_dir, 'vectorizer.pkl'), os.path.join(model_dir, 'model.pkl'))
    ]
    
    for vec_path, mod_path in paths_to_save:
        with open(vec_path, 'wb') as f:
            pickle.dump(vectorizer, f)
        with open(mod_path, 'wb') as f:
            pickle.dump(classifier, f)
            
    print("[+] Saved artifacts successfully:")
    print(f"    - Vectorizer: {paths_to_save[0][0]}")
    print(f"    - Classifier: {paths_to_save[0][1]}")
    print(f"    - Backup inside /model/ directory as well.")
    print("=" * 60)

if __name__ == "__main__":
    train_chatbot()
