# Campus AI – Ultra-Premium Student Chat Assistant v11.0 🤖🎓⚡

A state-of-the-art, high-converting **AI Student Support Assistant** featuring a **Silicon Valley Linear/Vercel-inspired Blue + White + Black Aesthetic (v11.0)**, an interactive **3D Neural Constellation Canvas**, a **Live Playground Terminal**, and a full **MERN/Flask Hybrid NLP Engine** (`Scikit-Learn TF-IDF Naive Bayes + Generative AI LLM Integration`).

<img width="1916" height="912" alt="Image" src="https://github.com/user-attachments/assets/f23c0f1c-2782-4941-a144-02b52390257d" />
<img width="1917" height="912" alt="Image" src="https://github.com/user-attachments/assets/fd83dc1e-2a10-4028-b829-dc2fde310231" />
<img width="1916" height="911" alt="Image" src="https://github.com/user-attachments/assets/d2a76e33-eb22-4371-8b0d-d0f56b02ec09" />


---

## 💻 How to Run in VS Code on ANY Other Device (Windows / Mac / Linux)

Follow these exact steps to open, setup, and run this project in **Visual Studio Code** on a new laptop or desktop in under 3 minutes:

## 🖥️ How to Run on WINDOWS (Windows 10 / Windows 11)

There are two easy ways to run this project on any Windows computer:

### Method A: One-Click Windows Automated Launcher (Fastest for Windows!)
1. Download and install [Python 3.10+](https://www.python.org/downloads/) on Windows.
   * **⚠️ CRITICAL FOR WINDOWS USERS**: On the very first screen of the Python installer, make sure to check the box **"Add Python to PATH"** at the bottom!
2. Extract `student-chatbot-v12.0-responsive.zip` anywhere on your Windows PC (e.g., Desktop or Documents).
3. Open the unzipped `student-chatbot` folder and simply **double-click `run_windows.bat`**!
   * The batch script will automatically create a `.venv` virtual environment, activate it, install all Python packages from `requirements.txt`, train the `model.pkl` classifier, and launch the web server for you on **http://127.0.0.1:5001**!

---

### Method B: Step-by-Step in VS Code (Windows Command Prompt / PowerShell)

If you prefer opening and managing the code directly inside **Visual Studio Code on Windows**:

#### Step 1: Open Folder in VS Code
1. Make sure Python 3.10+ and [Visual Studio Code](https://code.visualstudio.com/) are installed on your Windows PC.
2. Extract `student-chatbot-v12.0-responsive.zip` on your Windows desktop.
3. Open VS Code -> Click **`File -> Open Folder...`** and select the unzipped `student-chatbot` folder.

#### Step 2: Open Windows Integrated Terminal in VS Code
In VS Code, press **`` Ctrl + ` ``** (Control + backtick) or select **`Terminal -> New Terminal`** from the top menu bar.

#### Step 3: Create & Activate Virtual Environment on Windows
Inside the VS Code terminal:
* **If your VS Code terminal is Command Prompt (`cmd.exe`)**:
  ```cmd
  python -m venv .venv
  .venv\Scripts\activate
  ```
* **If your VS Code terminal is PowerShell**:
  ```powershell
  python -m venv .venv
  .\.venv\Scripts\activate
  ```
  *(Note: If Windows PowerShell shows an `ExecutionPolicy is restricted` error, run `Set-ExecutionPolicy Unrestricted -Scope Process` first, then run `.\.venv\Scripts\activate` again).*

Once activated, you will see `(.venv)` appear at the far left of your terminal prompt!

#### Step 4: Install Dependencies on Windows
Run this command in your activated `.venv` terminal to install Flask, Scikit-Learn, and NLTK:
```cmd
pip install -r requirements.txt
```

#### Step 5: Train the Offline NLP Model on Windows
Before starting the web server, run the training pipeline:
```cmd
python train.py
```
*(You will see: `[+] Model Training Complete! Training Accuracy: 100.00%`)*

---

### 🧩 Recommended VS Code Extensions for Windows

When you open this folder in **Visual Studio Code on Windows**, VS Code will automatically detect our `.vscode/extensions.json` configuration and show a prompt in the bottom right corner: **"This workspace has extension recommendations. [Install All]"**.

We strongly recommend installing these **7 official extensions** for the ultimate Windows development setup:

1. **Python (`ms-python.python`)** – Official Microsoft Python extension for IntelliSense, virtual environment (`.venv`) auto-selection, debugging, and terminal support.
2. **Pylance (`ms-python.vscode-pylance`)** – Fast, type-checking and autocompletion engine for `app.py`, `chatbot.py`, and `train.py`.
3. **HTML CSS Support (`ecmel.vscode-html-css`)** – Enables instant CSS class autocompletion across HTML templates from your `style.css` and `landing.css` tokens.
4. **IntelliSense for CSS class names (`zignd.html-css-class-completion`)** – Completes CSS class names directly inside `chat.html` and `index.html`.
5. **Prettier - Code formatter (`esbenp.prettier-vscode`)** – Formats HTML, CSS, and JavaScript cleanly on save (`Shift + Alt + F` on Windows).
6. **Jinja (`wholroyd.jinja`)** – Syntax highlighting for Flask HTML templates (`{{ ... }}` syntax).
7. **Live Server (`ritwickdey.liveserver`)** – Quick local preview utility for static HTML development.

---

### Step 6: Launch the Campus AI Web Server
Now launch the Flask application server:

```bash
python app.py
```

You will see:
```text
================================================================
   🚀 Campus AI Server Successfully Started!
================================================================
   💬 MAIN CHAT BOX DIRECT:  http://127.0.0.1:5001/app
   🌐 Landing Page (Home):   http://127.0.0.1:5001/
================================================================
```

### Step 7: Experience the Web App in Your Browser!
*(Note: As soon as you run `python app.py` or double-click `run_windows.bat`, **your web browser will automatically open directly to the Main Chat Box (`/app`) for you!**)*

If you ever need to open or share the URLs manually:
* 💬 **MAIN CHAT BOX DIRECT**: **[http://127.0.0.1:5001/app](http://127.0.0.1:5001/app)** *(Where you talk to the AI bot with Left-Right bubbles)*
* 🌐 **Landing Page (Home)**: **[http://127.0.0.1:5001/](http://127.0.0.1:5001/)** *(The 3D neural constellation & live terminal intro page)*

---

## 🌟 Key Architecture & Features (v11.0 Upgrade)

### 1️⃣ Ultra-Clean Aesthetic Palette (Blue + White + Black)
* **Deep Indigo-Black Background (`#06080F`, `#0B0F1C`)**: High-contrast, pristine dark canvas eliminating muddy orange/brown gradients.
* **Electric Blue Accents (`#2563EB` -> `#38BDF8`)**: Sleek button highlights, subtle glass border glows, and crisp interactive states.
* **Organized Hologram Pill Bar**: Replaced clunky overlapping badges with a neatly aligned, responsive feature bar.

### 2️⃣ High-Speed Hybrid NLP Engine (`chatbot.py`)
* **Instant Offline Campus Handbook (< 50ms)**: Handles exact campus questions (Timings, Exam Schedules, Fee Structure, Hostel rules, Library hours, Admissions) via trained `TfidfVectorizer` + `MultinomialNB` with `threshold = 0.16`.
* **Sub-Second Educational & Technical Tutorials**: Fast-track keyword matching instantly resolves technical coding tutorials (`Python OOP`), math proofs (`Calculus derivatives`), and career guides (`Interview Prep`).
* **Optional Google Gemini API Integration**: Enter your free Gemini API Key (`AIza...`) in the sidebar (`⚡ Hybrid Active` -> `Save Key`) to unlock unlimited live generative AI inference!

### 3️⃣ Interactive Landing Page (`/`)
* **Electric Blue 3D Constellation Particles**: Floating nodes connect dynamically via glowing cyan lines as you move your mouse across the screen (`landing.js`).
* **Live AI Playground Terminal**: Click sample queries right on the landing page to watch the terminal simulate live classification (`Intent: exam_schedules (98.4%)`).

---

## 📂 Project Structure

```
student-chatbot/
│── app.py                  # Flask Web Application Server & API Endpoints (/chat, /status, /quick-questions)
│── train.py                # Machine Learning Training Script (processes intents.json -> vectorizer.pkl & model.pkl)
│── chatbot.py              # Hybrid Inference Engine (Scikit-Learn NB + Keyword Priority + Gemini Free API)
│── intents.json            # Curated College Handbook Knowledge Base (17+ categories, 175+ patterns)
│── requirements.txt        # Backend Python dependencies (Flask, scikit-learn, nltk, numpy)
│── model.pkl               # Trained Multinomial Naive Bayes Model
│── vectorizer.pkl          # Trained TF-IDF Feature Vectorizer
│── README.md               # VS Code Setup & Architecture Guide
│
├── templates/
│   ├── index.html          # Clean & Aesthetic Landing Page with Live Playground
│   └── chat.html           # Main Interactive Chat Assistant Application
│
└── static/
    ├── css/
    │   ├── landing.css     # Landing Page Stylesheet (3D Glass, Feature Pills, Blue/Black Theme)
    │   └── style.css       # Chat Application Stylesheet (Bento Cards, Chat Bubbles, Dark Mode)
    └── js/
        ├── landing.js      # 3D Neural Constellation Canvas & Interactive Terminal Simulator
        └── script.js       # Chat Application UI Logic, localStorage Persistence & API Integration
```

---

## 🔧 Troubleshooting & Tips

* **Port Already in Use Error (`Address already in use: 5001`)**:
  If port 5001 is busy on your device, open `app.py`, scroll to the bottom line (`app.run(...)`), and change `port=5001` to `port=5002` or `port=8080`.
* **Clearing Browser Cache**:
  If you ever modify CSS or JS files and don't see changes immediately, press **`Ctrl + Shift + R`** (Windows) or **`Cmd + Shift + R`** (Mac) in your browser to hard refresh.
* **Adding Your Own College Questions**:
  Open `intents.json`, add your new question inside the `patterns` list of any tag (or create a new tag block), save the file, and run `python train.py` to retrain the model instantly!
