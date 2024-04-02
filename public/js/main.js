const deleteBtn = document.querySelectorAll('.fa-trash')
// Finds all elements with the class fa-trash (likely delete buttons) and stores them in deleteBtn.
const item = document.querySelectorAll('.item span')
// Finds all <span> elements inside elements with the class item (likely individual to-do items) and stores them in item.
const itemCompleted = document.querySelectorAll('.item span.completed')
// Finds all <span> elements with the class completed inside elements with the class item (likely completed to-do items) and stores them in itemCompleted.

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//Converts deleteBtn NodeList to an array and adds a click listener to each button to execute deleteItem when clicked.
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//Converts item NodeList to an array and adds a click listener to each item to execute markComplete when clicked.
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//Converts itemCompleted NodeList to an array and adds a click listener to each completed item to execute markUnComplete when clicked.
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
// this: Refers to the element that triggered the event. For example, if this line is in a function called by clicking a delete button, this would be that delete button.
// parentNode: Gets the parent element of the current element. If this is a delete button inside a list item, parentNode would be the list item itself.
// childNodes[1]: Accesses the second child element of the parent. Child nodes can include text nodes (like spaces, new lines, etc.), so the second child might not always be the second visible element. This is a bit fragile because it assumes a specific structure and could break if the HTML changes.
// innerText: Gets the visible text inside the child element. This would be the text content you want to work with, like the name of a to-do item.
    try{
//try: Starts a block of code that will be attempted to execute. It's used here because the following code involves operations that might fail, such as network requests. If anything goes wrong in the try block (like a failed network request), the code execution moves to the catch block.
        const response = await fetch('deleteItem', {
// await fetch('deleteItem', {...}): Sends an asynchronous request to the server's deleteItem endpoint. The await keyword waits for the request to complete before moving on to the next line. This avoids blocking the browser while the request is in progress.
            method: 'delete',
// method: 'delete': Specifies that this is a DELETE request, which is typically used to indicate that a resource (like an item on a list) should be removed.        
            headers: {'Content-Type': 'application/json'},
// headers: {'Content-Type': 'application/json'}: Tells the server that the data being sent is in JSON format.
            body: JSON.stringify({
              'itemFromJS': itemText
// body: JSON.stringify({'itemFromJS': itemText}): Sends the item text to the server in JSON format. JSON.stringify converts the JavaScript object into a JSON string.                
            })
          })
        const data = await response.json()
// const data = await response.json(): Waits for the server's response and then converts it from JSON to a JavaScript object. This line assumes the server's response is in JSON format and that there's useful data to be unpacked.
        console.log(data)
// console.log(data): Prints the response data to the browser's console. This is useful for debugging to see what the server sent back.
        location.reload()
// location.reload(): Refreshes the current web page. This is used here to show the updated state of the data (e.g., with the deleted item removed) without requiring the user to manually refresh the page.

        
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
