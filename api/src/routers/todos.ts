import express from "express";
import db from "../utilities/db.server";

const router = express.Router();

// GET /api/todos
// Get all todos
router.get('/', async (req, res) => {
  const todos = await db.todo.findMany();
  res.json(todos);
});

// GET /api/todos/:id
// Get a single todo by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const todo = await db.todo.findUnique({
    where: { id: parseInt(id) },
  });
  res.json(todo);
});

// POST /api/todos
// Create a new todo
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  const todo = await db.todo.create({
    data: { title, description },
  });
  res.status(201).json(todo);
});

// PUT /api/todos/:id
// Update a todo by id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, is_done } = req.body;
  const todo = await db.todo.update({
    where: { id: parseInt(id) },
    data: { title, description, is_done },
  });
  res.status(204).send();
});

// DELETE /api/todos/:id
// Delete a todo by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.todo.delete({
    where: { id: parseInt(id) },
  });
  res.status(204).send();
});

export default router;
