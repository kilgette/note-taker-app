const path = require('path');
const express = require('express');
const fs = require(`fs`);
const { v4: uuidv4 } = require('uuid');

// const routes = require('./routes');

//declare express 
const app = express();
const PORT = process.env.PORT || 3001;


//define middleware to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// app.use(routes);

//ROUTES

//GET notes that return the notes.html file
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"))
});

//GET notes that return the index.html file 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

//GET notes that read the db.json file and return the saved notes as JSON
app.get('/api/notes', (req, res) =>
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) return console.log(err);
    console.log(data)
    res.json(JSON.parse(data))
  })
)


//POST notes that should recieve a new note and save to the db.json file with unique ID

app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', function (err, data) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Note Save Fail.' });
    }

    const notes = JSON.parse(data);
    newNote.id = uuidv4();
    notes.push(newNote);

    fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), 'utf8', function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Note Save Fail' });
      }

      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const targetId = req.params.id;

  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', function (err, data) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Note Save Fail.' });
    }

    const notes = JSON.parse(data);
   const filteredNotes = notes.filter(note => note.id !== targetId)

    fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(filteredNotes), 'utf8', function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Note Save Fail' });
      }

      res.json("Success!");
    });
  });
});



app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
});
