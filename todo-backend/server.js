//express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

//express instance
const app = express();
app.use(express.json())
app.use(cors())

//sample in-memory storage
// let todos = [];


//Connecting mongoose
mongoose.connect('mongodb://localhost:27017/todo-app').then(() => {
    console.log('DB Connected');
})
    .catch((err) => {
        console.log(err);
    })

//todoSchema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String,

})

//model
const todoModel = mongoose.model('Todo', todoSchema);


//Todo route
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);
    // res.status(201).json(newTodo)
    try {
        const newTodo = new todoModel({ title, description });
        await newTodo.save();
        res.status(201).json(
            newTodo
        )
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        })
    }


})

// get all item
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
        console.log(todos);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
        console.log(todos);
    }

})

//update a todo item

app.put("/todos/:id", async (req, res) => {

    try {
        const { title, description } = req.body
        const id = req.params.id
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: false }
        )
        if (!updatedTodo) {
            return res.status(404).json(
                { message: "Todo not found" }
            )
        }
        res.json(updatedTodo)

    } catch (error) {
        console.log(error);

    }


})

//delete item 
app.delete("/todos/:id", async (req, res) => {
    
    try {
        const {title, description} = req.body
        const id = req.params.id;
        const deleteTodo = await todoModel.findByIdAndDelete(id) 
        res.status(204).end()

        console.log("deleted successfully")
    }catch(err){
        console.log(err);
        
    }
})


// Server
const port = 3000;

app.listen(port, () => {
    console.log("server listening to " + port);

})

