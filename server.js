const express = require('express')
//important 
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//dbname is replaced with 'todo', why? I don't know yet
//if it's successful, we connect to 'todo' database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    //converting the objects from out 
    })
    
app.set('view engine', 'ejs')
// telling the server what to respond with, ejs is a html style file within the server
app.use(express.static('public'))
    //what are statis files? servered direcltly to clients without server
// sends files without modifications, as is
// telling express to use files in public folder, static files
app.use(express.urlencoded({ extended: true }))
        //tells express.js to handle URL-encoded data
app.use(express.json())
    //When you ask for data, like getting names of drinks or Pokémon, the server sends it back in JSON because it's easy for both computers and people to understand.
    


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
        //it's the name of a collection within the database. In MongoDB, a database is a container for collections, and collections are like tables in a relational database. They contain the actual documents (records) you're working with. In your case, db.collection('todos') refers to the todos collection within your todo database, where each document represents a to-do item.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
// send back the items not com
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
// items that were not checked off and done
    .catch(error => console.error(error))
    //set up a tri-catch
    
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})
    //adding new 


app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
