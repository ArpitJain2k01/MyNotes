const express = require("express");
const router = express.Router();
const fetchUser = require("../Middleware/FetchUser");
const Notes = require("../Models/Note.model");
const { body, validationResult } = require("express-validator");

//Route 1: Get all notes using Get '/api/notes/fetchallnotes' Login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

//Route 2: Add a new note using post '/api/notes/addnote' Login required
router.post(
  "/addnote",
  [
    body("title", "Add a title").notEmpty(),
    body("description", "Add a description").notEmpty(),
  ],
  fetchUser,
  async (req, res) => {
    //if we find any error then display them
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: result.array() });
    }

    try {
      const { title, description, tag } = req.body;
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//Route 3: Edit a note using PUT '/api/notes/editnote/:id' Login required
router.put(
  "/editnote/:id",
  [
    body("title", "Add a title").notEmpty(),
    body("description", "Add a description").notEmpty(),
  ],
  fetchUser,
  async (req, res) => {
    //if we find any error then display them
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: result.array() });
    }

    try {
      const { title, description, tag } = req.body;

      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      //Find the note to be updated
      let note = await Notes.findById(req.params.id);

      if (!note) {
        return res.status(404).send({ error: "Note not found" });
      }

      
      //if note is there

      //check for only the user can update it
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
      }

      note = await Notes.findByIdAndUpdate(req.params.id, {$set:newNote},{new:true})
      res.json({note})

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//Route 4: Delete a note using DELETE '/api/notes/deletenote/:id' Login required
router.delete(
    "/deletenote/:id",
    fetchUser,
    async (req, res) => {
      //if we find any error then display them
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ errors: result.array() });
      }
  
      try {
  
        //Find the note to be deleted
        let note = await Notes.findById(req.params.id);
  
        if (!note) {
          return res.status(404).send({ error: "Note not found" });
        }
  
      
        //if note is there
  
        //check for only the user can update it
        if (note.user.toString() !== req.user.id) {
          return res.status(401).send("Not allowed");
        }
  
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({"Success":"Note has been deleted"})
  
      } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
      }
    }
  );

module.exports = router;
