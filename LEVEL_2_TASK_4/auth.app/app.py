from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "your_secret_key_here"

# Simple in-memory database (replace later with SQL/Firebase if needed)
users_db = {}

# -------------------- Home / Dashboard --------------------
@app.route('/')
def home():
    if "user" in session:
        return redirect(url_for("dashboard"))
    return redirect(url_for("login"))

@app.route('/dashboard')
def dashboard():
    if "user" not in session:
        flash("Please log in to access the dashboard.", "warning")
        return redirect(url_for("login"))
    user = users_db[session["user"]]
    return render_template("dashboard.html", name=user["name"])

# -------------------- Register --------------------
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == "POST":
        name = request.form["name"]
        email = request.form["email"]
        password = request.form["password"]

        if email in users_db:
            flash("Email already registered. Please log in.", "danger")
            return redirect(url_for("login"))

        hashed_password = generate_password_hash(password, method="pbkdf2:sha256")

        users_db[email] = {
            "name": name,
            "email": email,
            "password": hashed_password
        }
        flash("Registration successful! Please log in.", "success")
        return redirect(url_for("login"))

    return render_template("register.html")

# -------------------- Login --------------------
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        user = users_db.get(email)
        if user and check_password_hash(user["password"], password):
            session["user"] = email
            flash(f"Welcome back, {user['name']}!", "success")
            return redirect(url_for("dashboard"))
        else:
            flash("Invalid email or password.", "danger")

    return render_template("login.html")

# -------------------- Logout --------------------
@app.route('/logout')
def logout():
    session.pop("user", None)
    flash("You have been logged out.", "info")
    return redirect(url_for("login"))

# -------------------- Run --------------------
if __name__ == "__main__":
    app.run(debug=True)
