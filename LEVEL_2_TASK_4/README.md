# Oasis Infobyte Internship Project

## Task 4: Authentication System using Flask

This project is developed as part of the **Oasis Infobyte Internship Program**. The task focuses on building a simple **Authentication System** using **Flask**, which allows users to register, log in, view their profile, and access a dashboard securely.

---

## Features
- User Registration with validation
- Secure User Login & Logout
- Profile Page for each user
- Dashboard with session-based authentication
- SQLite Database integration
- Responsive UI with HTML & CSS

---

## Tech Stack
- **Backend:** Python (Flask)
- **Frontend:** HTML, CSS
- **Database:** SQLite
- **Environment:** Virtualenv / Flask Environment

---

## Project Structure
TASK4/
│── auth.app/
│ │── app.py # Main Flask application
│ │── instance/
│ │ └── users.db # SQLite database
│ │── static/
│ │ └── style.css # Custom CSS styling
│ │── templates/
│ │ ├── base.html
│ │ ├── dashboard.html
│ │ ├── login.html
│ │ ├── profile.html
│ │ └── register.html


---

## Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/oasis-infobyte-auth-app.git
cd oasis-infobyte-auth-app/TASK4/auth.app

2.Create a Virtual Environment
python -m venv venv
source venv/bin/activate   # On Linux/Mac
venv\Scripts\activate      # On Windows

3.Install Dependencies
pip install -r requirements.txt
(If requirements.txt is missing, install Flask manually:)
pip install flask

4.Run the Application
python app.py

5.Access in Browser
http://127.0.0.1:5000/
