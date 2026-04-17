from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User, ScanResult
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
import networkx as nx
import json

app = Flask(__name__)

# ---------------- CONFIG ----------------
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["JWT_SECRET_KEY"] = "this_is_a_very_long_secure_secret_key_12345"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()

# ---------------- HOME ----------------
@app.route("/")
def home():
    return jsonify({"message": "Backend Running"})

# ---------------- REGISTER ----------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "User already exists"}), 400

    hashed_password = generate_password_hash(data["password"])

    new_user = User(
        username=data["username"],
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"})

# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()

    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token})

# ---------------- GRAPH ENGINE ----------------

def build_graph(data):
    G = nx.DiGraph()

    # Add nodes
    for r in data.get("resources", []):
        G.add_node(r["id"], **r)

    # Add edges
    for c in data.get("connections", []):
        G.add_edge(c["from"], c["to"])

    return G


def calculate_risk(G, path):
    risk_score = 0
    max_possible = 0

    for node in path:
        privilege = G.nodes[node].get("privilege", 1)
        sensitivity = G.nodes[node].get("sensitivity", 1)

        node_risk = privilege * sensitivity * 10
        risk_score += node_risk
        max_possible += 5 * 5 * 10

    # Bonus for longer paths
    if len(path) > 3:
        risk_score += 20
        max_possible += 20

    if max_possible == 0:
        return 0

    return round((risk_score / max_possible) * 100, 2)


def find_attack_paths(G):
    attack_paths = []

    # ✅ Start nodes (public)
    public_nodes = [n for n in G.nodes if G.nodes[n].get("public")]

    # ✅ Target nodes (high sensitivity)
    target_nodes = [
        n for n in G.nodes if G.nodes[n].get("sensitivity", 0) >= 5
    ]

    print("Public Nodes:", public_nodes)
    print("Target Nodes:", target_nodes)

    for start in public_nodes:
        for target in target_nodes:
            if start != target:
                try:
                    paths = list(nx.all_simple_paths(G, start, target))
                    attack_paths.extend(paths)
                except:
                    continue

    return attack_paths

# ---------------- ANALYZE ----------------
@app.route("/analyze", methods=["POST"])
@jwt_required()
def analyze():
    current_user_id = int(get_jwt_identity())
    data = request.json

    G = build_graph(data)
    attack_paths = find_attack_paths(G)

    if not attack_paths:
        return jsonify({
            "id": None,
            "attack_paths": [],
            "critical_path": None,
            "message": "No attack paths found"
        })

    scored = []

    for path in attack_paths:
        scored.append({
            "path": path,
            "risk": calculate_risk(G, path)
        })

    # Get highest risk path
    critical = max(scored, key=lambda x: x["risk"])

    result_data = {
        "attack_paths": scored,
        "critical_path": critical
    }

    # Save to DB
    new_scan = ScanResult(
        user_id=current_user_id,
        result=json.dumps(result_data)
    )

    db.session.add(new_scan)
    db.session.commit()

    return jsonify({
        "id": new_scan.id,
        "attack_paths": scored,
        "critical_path": critical
    })

# ---------------- HISTORY ----------------
@app.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    current_user_id = int(get_jwt_identity())

    scans = ScanResult.query.filter_by(
        user_id=current_user_id
    ).order_by(ScanResult.created_at.desc()).all()

    history = []

    for scan in scans:
        try:
            result = json.loads(scan.result)
        except:
            result = scan.result

        history.append({
            "id": scan.id,
            "result": result,
            "created_at": scan.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })

    return jsonify(history)

# ---------------- DELETE SCAN ----------------
@app.route("/history/<int:scan_id>", methods=["DELETE"])
@jwt_required()
def delete_scan(scan_id):
    current_user_id = int(get_jwt_identity())

    scan = ScanResult.query.filter_by(
        id=scan_id,
        user_id=current_user_id
    ).first()

    if not scan:
        return jsonify({"error": "Scan not found"}), 404

    db.session.delete(scan)
    db.session.commit()

    return jsonify({"message": "Scan deleted successfully"})

# ---------------- CLEAR HISTORY ----------------
@app.route("/history/clear", methods=["DELETE"])
@jwt_required()
def clear_history():
    current_user_id = int(get_jwt_identity())

    ScanResult.query.filter_by(user_id=current_user_id).delete()
    db.session.commit()

    return jsonify({"message": "History cleared successfully"})

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True)