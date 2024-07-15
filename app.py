from flask import Flask, request, jsonify, send_file # type: ignore
from psycopg2 import connect, extras # type: ignore
# from cryptography.fernet import Fernet # type: ignore
from os import environ # type: ignore

app = Flask(__name__)

# Connect to the database
host = environ.get("DB_HOST")
database = environ.get("DB_NAME")
user = environ.get("DB_USER")
password = environ.get("DB_PASSWORD")
port = environ.get("DB_PORT")

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
    conn = get_connect()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute("SELECT * FROM users")
    users = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(users)

# Get a user by id
@app.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    conn = get_connect()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute("SELECT * FROM users WHERE id = %s", (id,))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if user is None:
        return jsonify({'message': 'User not found'}), 404

    return jsonify(user)

# Create a user
@app.route('/users', methods=['POST']) 
def create_user():
    new_user = request.get_json()
    username = new_user['username']
    email = new_user['email'] 
    password = new_user['password']
    image = new_user['image']

    conn = get_connect()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute("INSERT INTO users (username, email, password, image) VALUES (%s, %s, %s, %s) RETURNING *", 
                (username, email, password, image))
    created_user = cur.fetchone()
    
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify(created_user)

# Update a user
@app.route('/users/<int:id>', methods=['PUT'])  
def update_user(id):
    conn = get_connect()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    new_user = request.get_json()
    username = new_user['username']
    email = new_user['email']
    password = new_user['password']
    image = new_user['image']
    cur.execute("UPDATE users SET username = %s, email = %s, password = %s, image = %s WHERE id = %s RETURNING *",
                (username, email, password, image, id))
    updated_user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if updated_user is None:
        return jsonify({'message': 'User not found'}), 404
    return jsonify(updated_user)

# Delete a user
@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    conn = get_connect()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute("DELETE FROM users WHERE id = %s RETURNING *", (id,))
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if user is None:
        return jsonify({'message': 'User not found'}), 404
    return jsonify(user)


# Get products
@app.route('/products', methods=['GET'])
def get_products():
    conn = get_connect()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute("SELECT * FROM products")
    products = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(products)

# Get a product by id
@app.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    conn = get_connect()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute("SELECT * FROM products WHERE id = %s", (id,))
    product = cur.fetchone()
    cur.close()
    conn.close()

    if product is None:
        return jsonify({'message': 'Product not found'}), 404

    return jsonify(product)

# Create a product
@app.route('/products', methods=['POST']) 
def create_product():
    new_product = request.get_json()
    productname = new_product['productname']
    category = new_product['category']
    gender = new_product['gender']
    description = new_product['description']
    price = new_product['price']
    image = new_product['image']
    
    conn = get_connect()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute("INSERT INTO products (productname, category, gender, description, price, image) VALUES (%s, %s, %s, %s, %s, %s) RETURNING *",
                (productname, category, gender, description, price, image))
    created_product = cur.fetchone()
    
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify(created_product)

# Update a product
@app.route('/products/<int:id>', methods=['PUT'])  
def update_product(id):
    conn = get_connect()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    new_product = request.get_json()
    productname = new_product['productname']
    category = new_product['category']
    gender = new_product['gender']
    description = new_product['description']
    price = new_product['price']
    image = new_product['image']
    cur.execute("UPDATE products SET productname = %s, category = %s, gender = %s, description = %s, price = %s, image = %s WHERE id = %s RETURNING *",
                (productname, category, gender, description, price, image, id))
    created_product = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if created_product is None:
        return jsonify({'message': 'Product not found'}), 404
    return jsonify(created_product)

# Delete a product
@app.route('/products/<int:id>', methods=['DELETE'])
def delete_prouct(id):
    conn = get_connect()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute("DELETE FROM products WHERE id = %s RETURNING *", (id,))
    product = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if product is None:
        return jsonify({'message': 'Product not found'}), 404
    return jsonify(product)

# Get Products by gender 
@app.route('/products/<gender>', methods=['GET'])
def get_gender_products(gender):
    conn = get_connect()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute("SELECT * FROM products WHERE gender = %s", (gender,))
    product = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(product)

# Get Orders
@app.route('/orders', methods=['GET'])
def get_orders():
    conn = get_connect()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute("SELECT * FROM orders")
    orders = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(orders)

# Post orders 
@app.route('/orders', methods=['POST'])
def create_order():
    new_order = request.get_json()
    product_id = new_order['product_id']
    product_image = new_order['product_image']
    product_name = new_order['product_name']
    product_price = new_order['product_price']
    quantity = new_order['quantity']
    total = new_order['total']
    conn = get_connect()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute("INSERT INTO orders (product_id, product_image, product_name, product_price, quantity, total) VALUES (%s, %s, %s, %s, %s, %s) RETURNING *",
                (product_id, product_image, product_name, product_price, quantity, total))
    created_order = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(created_order)

# Delete an order
@app.route('/orders/<int:id>', methods=['DELETE']) 
def delete_order(id):
    conn = get_connect()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute("DELETE FROM orders WHERE id = %s RETURNING *", (id,))
    order = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if order is None:
        return jsonify({'message': 'Order not found'}), 404
    return jsonify(order)

# Update an order 
@app.route('/orders/<int:id>', methods=['PUT'])
def update_order(id):
    conn = get_connect()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    new_order = request.get_json()
    quantity = new_order['quantity']
    cur.execute("UPDATE orders SET quantity = %s WHERE id = %s RETURNING *",
                (quantity, id))
    updated_order = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if updated_order is None:
        return jsonify({'message': 'Order not found'}), 404
    return jsonify(updated_order)


# Base route
@app.route('/', methods=['GET'])
def home():
    return send_file('static/index.html')

if __name__ == '__main__':
    app.run(debug=True) # run our Flask app