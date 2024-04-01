const express = require('express')
// important, import express module
const app = express()
// initializes express
const MongoClient = require('mongodb').MongoClient
// importing Mongoclient from mongodb module
const PORT = 2121
// server will listen at port 2121
require('dotenv').config()
// so you can use the files related to process.env. Importing the dotenv package
//import config function from dotenv package


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
// dbname is replaced with 'todo', why? I don't know yet
// if it's successful, we connect to 'todo' database

// delcare database var, the connection string, and the database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // set up mongodb connection (useUnifiedTopology: true is deprecated)
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
    // console.log if promise resolves and connection works
        db = client.db(dbName)
        // set up database name
    })
// converting the objects from out 


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
    //tell express to handle json requests
    


app.get('/',async (request, response)=>{
        //handle a get request on the root route
    const todoItems = await db.collection('todos').find().toArray()
        //it's the name of a collection within the database. In MongoDB, a database is a container for collections, and collections are like tables in a relational database. They contain the actual documents (records) you're working with. In your case, db.collection('todos') refers to the todos collection within your todo database, where each document represents a to-do item.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
// send back the items not com
    //count the documents, {completed: false}
    //count the documents in the todos collection with the property value completed: false
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
        // items that were not checked off and done
        // telling ejs how to render 
        //plugging in two items from the data base in the ejs file
        // render the ejs file with the data in todoItems and itemleft
        
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
// handle a post request on the addTodo route
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
// insert the posted information into the database
    .then(result => {
    // wait for the promise to resolve
        console.log('Todo Added')
    // console.log if it resolves and and redirects to the root route
        response.redirect('/')
    })

    .catch(error => console.error(error))
})
    //adding new 


app.put('/markComplete', (request, response) => {
    // handle a put request on the markComplete route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // update the targeted item into the database
        $set: {
            completed: true
          }
        //update the targeted item's completed property to true
    },{
        sort: {_id: -1},
        // sort the items by descending order
        upsert: false
        // don't create a new document if it doesn't exist
    })
    .then(result => {
        //wait for the promise to resolve
        console.log('Marked Complete')
        //console.log and respond with json if resolves
        response.json('Marked Complete')
        //Responds to client with 'Marked Complete' message.
        
    })
    .catch(error => console.error(error))
        //Catches and logs errors if update fails.  
})

app.put('/markUnComplete', (request, response) => {
    // handle a put request on the markUnComplete route    
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
                //update the targeted item's completed property to false
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked UnComplete')
// Logs 'Marked UnComplete' to console (incorrect message).
        response.json('Marked UnComplete')
//Responds 'Marked Complete' to client (message should be 'Marked UnComplete').        
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
// handle a detete request on the deleteItem route
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
//delete targeted item from 'todos' collection in database
    .then(result => {
        //wait or the promise to reslove
        console.log('Todo Deleted')
        response.json('Todo Deleted')
// Responds with 'Todo Deleted' message to client.
    })
    .catch(error => console.error(error))
// Catches and logs errors if deletion fails.

})

app.listen(process.env.PORT || PORT, ()=>{
    // set up the server to listen to a particular port
    console.log(`Server running on port ${PORT}`)
})
