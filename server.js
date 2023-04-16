// Import express.js
const express = require("express");

// Invoke FS module
const fs = require("fs");

// Import path node package to enable the finding of path files
const path = require("path");

// Invoke express and store within app
const app = express();
const noteid = require("./noteid");
const PORT = process.env.PORT || 3001;

// Middleware to request from public folder
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//// Routes \\\\
// Get request for index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Get request for notes.html file
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  var getNotes = fs.readFileSync("./db/db.json");
  var showNotes = JSON.parse(getNotes);
  return res.json(showNotes);
});

app.post("/api/notes", (req, res) => {
  // ID added to each note being added to the JSON file
  const { title, text } = req.body;
  const id = noteid;
  const addNote = {
    title,
    text,
    id,
  };

  var storeNotes = fs.readFileSync("./db/db.json");
  var savedArr = JSON.parse(storeNotes);

  savedArr.push(addNote);

  var addData = JSON.stringify(savedArr);
  fs.writeFile("./db/db.json", addData, (err) => {
    err ? console.error("Error") : console.log("Success");
  });
  res.json("New Note Added.");
});

// DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete.
app.delete("/api/notes/:id", (req, res) => {
  // reading notes form db.json
  let db = JSON.parse(fs.readFileSync("db/db.json"));
  // removing note with id
  let deleteNotes = db.filter((item) => item.id !== req.params.id);
  // Rewriting note to db.json
  fs.writeFileSync("db/db.json", JSON.stringify(deleteNotes));
  res.json(deleteNotes);
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
