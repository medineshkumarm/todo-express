const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const react_url = process.env.FRONTEND_URL;
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin',react_url );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});



const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * step 1: Connect to db
 * step 2: Create a models
 * step 3: CRUD operation
 */

//define the model

const Schema = mongoose.Schema;
const todoSchema = new Schema({
  title: String,
  completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.send(todos);
});

app.post('/todos', async (req, res) => {
  try {
    const newTodo = new Todo({
      title: req.body.title,
      completed: false
    });
    await newTodo.save();
    res.status(201).send(newTodo);
  } catch (error) {
    console.log(error);
  }
});

app.put('/todos/:id', async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );
  res.send(updatedTodo);
});

app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.send({ message: 'Todo deleted' });
});



mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Server listening at PORT: ${PORT}...`);
    })
  })
  .catch((error) => {
    console.log("Error Occured :" + error);
  });


