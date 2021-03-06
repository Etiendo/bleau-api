import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose, { ConnectOptions } from 'mongoose';

const app: Application = express();
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true } as ConnectOptions);
const connection = mongoose.connection;

connection.once('open', function () {
  console.log("MongoDB database connection established successfully");
})

todoRoutes.route('/').get((req, res) => {
  Todo.find((err: Error, todos: any) => {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});

todoRoutes.route('/:id').get((req, res) => {
  let id = req.params.id;
  Todo.findById(id, (err: Error, todo: any) => {
    res.json(todo);
  });
});

todoRoutes.route('/add').post((req, res) => {
  let todo = new Todo(req.body);
  todo.save()
    .then((todo: any) => {
      res.status(200).json({ 'todo': 'todo added successfully' });
    })
    .catch((err: Error) => {
      res.status(400).send('adding new todo failed');
    });
});

todoRoutes.route('/update/:id').post((req, res) => {
  Todo.findById(req.params.id, (err: Error, todo: any) => {
    if (!todo) {
      res.status(404).send("data is not found");
    }
    else {
      todo.todo_description = req.body.todo_description;
      todo.todo_responsible = req.body.todo_responsible;
      todo.todo_priority = req.body.todo_priority;
      todo.todo_completed = req.body.todo_completed;

      todo.save().then((todo: any) => {
        res.json('Todo updated!');
      })
      .catch((err: Error) => {
        res.status(400).send("Update not possible");
      });
    }
  });
});

app.use('/todos', todoRoutes);

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});