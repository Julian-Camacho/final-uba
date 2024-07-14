from flask import Flask, request, jsonify # type: ignore
from psycopg2 import connect, extras # type: ignore
from cryptography.fernet import Fernet # type: ignore

app = Flask(__name__)
key = Fernet.generate_key()

# Connect to the database
host = 'localhost'
database = 'ubadb'
user = 'postgres'
password = 'julian123'
port = 5432

def get_connect():
    conn = connect(
        host=host,
        database=database,
        user=user,
        password=password,
        port=port
    )
    return conn

# Get all users
@app.route('/users', methods=['GET'])
def get_users():
    return "Hello, World!"

# Get a user by id
@app.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    return "get 1 user"

# Create a user
@app.route('/users', methods=['POST']) 
def create_user():
    new_user = request.get_json()
    username = new_user['username']
    email = new_user['email'] 
    password = Fernet(key).encrypt(bytes(new_user['password'], 'utf-8'))

    conn = get_connect()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s) RETURNING *", 
                (username, email, password))
    created_user = cur.fetchone()
    
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify(created_user)

# Update a user
@app.route('/users/<int:id>', methods=['PUT'])  
def update_user(id):
    return "updated user"

# Delete a user
@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    return "deleted user"


# Base route
@app.route('/', methods=['GET'])
def home():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True) # run our Flask app