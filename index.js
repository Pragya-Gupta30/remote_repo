const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// In-memory hobby list
let hobbies = [];

// Middleware
app.use(bodyParser.json());

// Get all hobbies
app.get('/hobbies', (req, res) => {
    res.json(hobbies);
});

// Add a new hobby
app.post('/hobbies', (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Hobby name is required' });
    }
    const hobby = { id: hobbies.length + 1, name, description: description || '' };
    hobbies.push(hobby);
    res.status(201).json(hobby);
});

// Delete a hobby by id
app.delete('/hobbies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = hobbies.findIndex(h => h.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Hobby not found' });
    }
    hobbies.splice(index, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Hobby app listening at http://localhost:${PORT}`);
});