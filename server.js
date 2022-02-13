const express = require("express");
const fs = require("fs");
const path = require("path");
const data = require("./db/db")

const app = express();

var PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//routes to notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//reads the db.json file and returns saved notes as json
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

//route to index.html
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));

});


// 
app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    let noteData = JSON.parse(fs.readFileSync("./db/db.json", "utf8")); 
    let noteIdentifier = (noteData.length).toString();
    

    //create new property called id based on length and assign it to each json object
    newNote.id = noteIdentifier;
    console.log(`The new note id is ${noteIdentifier}`);


    //push updated note to the data containing notes history in db.json
    noteData.push(newNote);



    //write the updated data to db.json and return the updated data 
    fs.writeFileSync("./db/db.json", JSON.stringify(noteData)); 
    console.log("Note saved!")
    res.json(noteData);
});



app.delete("/api/notes/:id", (req, res) => {
    let noteData = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    
    let noteId = req.params.id;
    console.log(`deleting note with ID ${noteId}`);
    


    noteData = noteData.filter(currentNote =>{
        return currentNote.id != noteId;
    })

    //write the updated data to db.json and display the updated note
    fs.writeFileSync("./db/db.json", JSON.stringify(noteData));
    res.json(noteData);
});

    







    app.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
    });
   
