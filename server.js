const path = require('path');
const express = require('express');
const routes = require('./routes');

const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(routes);

//ROUTES

//GET notes that return the notes.html file
app.get("/notes", (req, res) => {
res.sendFile(path.join(_dirname, "/public/notes.html"))
});

//GET notes that return the index.html file 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

//GET notes that read the db.json file and return the saved notes as JSON
app.get('/api/notes', (req,res) => 
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if( err ) return console.log(err);
    console.log(data)
    res.json(JSON.parse(data))
  })
)


//POST notes that should recieve a new note and save to the db.json file with unique ID
app.post(`/api/notes`)

app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', function (err, data) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes data.' });
    }

    const notes = JSON.parse(data);
    newNote.id = generateUniqueId(); 
    notes.push(newNote);

    fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), 'utf8', function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save note.' });
      }

      res.json(newNote);
    });
  });
});

// // The line below prevents sequelize from syncing the database in a production environment.
// // If you don't want it to sync locally either, change the true value to false at the end.
// const forceValue = (process.env.NODE_ENV === "production") ? false : true
// sequelize.sync({ force: forceValue }).then(() => {
//   app.listen(PORT, () => console.log('Now listening'));
// });
