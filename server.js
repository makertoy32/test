const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for now — Lecture 4 replaces this with a real database container.
let todos = [
  { id: 1, text: 'Containerize this app with Docker', done: false },
  { id: 2, text: 'Deploy it to AWS', done: false },
];
let nextId = 3;

// Used by the load balancer / container orchestrator health checks from Lecture 6 onward.
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text) return res.status(400).json({ error: 'text is required' });
  const todo = { id: nextId++, text, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: 'not found' });
  if (typeof req.body.done === 'boolean') todo.done = req.body.done;
  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id !== Number(req.params.id));
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Capstone to-do app listening on port ${PORT}`);
});
