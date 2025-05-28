const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// In-memory data store (for demo purposes)
let products = [
    { id: 1, name: "Laptop", price: 800 },
    { id: 2, name: "Phone", price: 400 },
    { id: 3, name: "Headphones", price: 100 }
];
let cart = [];

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/cart', (req, res) => {
    res.json(cart);
});

app.post('/api/cart', (req, res) => {
    const { productId } = req.body;
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        res.json({ message: "Added to cart", cart });
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

app.delete('/api/cart/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    cart = cart.filter(p => p.id !== productId);
    res.json({ message: "Removed from cart", cart });
});

// Serve a simple frontend
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Simple E-Commerce</title>
            </head>
            <body>
                <h1>Products</h1>
                <ul id="products"></ul>
                <h2>Cart</h2>
                <ul id="cart"></ul>
                <script>
                    async function fetchProducts() {
                        const res = await fetch('/api/products');
                        const products = await res.json();
                        const ul = document.getElementById('products');
                        ul.innerHTML = '';
                        products.forEach(p => {
                            const li = document.createElement('li');
                            li.textContent = p.name + ' - $' + p.price;
                            const btn = document.createElement('button');
                            btn.textContent = 'Add to Cart';
                            btn.onclick = () => addToCart(p.id);
                            li.appendChild(btn);
                            ul.appendChild(li);
                        });
                    }
                    async function fetchCart() {
                        const res = await fetch('/api/cart');
                        const cart = await res.json();
                        const ul = document.getElementById('cart');
                        ul.innerHTML = '';
                        cart.forEach(p => {
                            const li = document.createElement('li');
                            li.textContent = p.name + ' - $' + p.price;
                            const btn = document.createElement('button');
                            btn.textContent = 'Remove';
                            btn.onclick = () => removeFromCart(p.id);
                            li.appendChild(btn);
                            ul.appendChild(li);
                        });
                    }
                    async function addToCart(productId) {
                        await fetch('/api/cart', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ productId })
                        });
                        fetchCart();
                    }
                    async function removeFromCart(productId) {
                        await fetch('/api/cart/' + productId, { method: 'DELETE' });
                        fetchCart();
                    }
                    fetchProducts();
                    fetchCart();
                </script>
            </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`E-commerce app running at http://localhost:${PORT}`);
});