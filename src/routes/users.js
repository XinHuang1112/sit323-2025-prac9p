const express = require('express');
const router = express.Router();
const User   = require('../models/user');

// GET /users
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// POST /users
router.post('/', async (req, res) => {
  const user = new User({ name: req.body.name });
  await user.save();
  res.status(201).json(user);
});

// PUT /users/:id
router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id,
    { name: req.body.name }, { new: true });
  res.json(user);
});

// DELETE /users/:id
router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;