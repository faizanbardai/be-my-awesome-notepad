const express = require("express");
const router = express.Router();
const noteModel = require("../model/note");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

// Get all notes sorted by last updaded shown first
router.get("/", async (req, res) => {
  res.json(await noteModel.find({}).sort([["updatedAt", -1]]));
});

// Get a single note by ID
router.get("/:_id", async (req, res) => {
  // Checking if a valid ID is provided
  if (mongoose.Types.ObjectId.isValid(req.params._id)) {
    try {
      await noteModel.findById(req.params._id, (err, note) => {
        // if error found responding with error else send the note.
        // if the provided ID doesn't exist response will be "null".
        err ? res.send(err) : res.json(note);
      });
    } catch (error) {
      // Logging the error.
      console.log(error);
    }
  } else {
    // Responding with invalid ID if the ID check fails
    res.status(400).send("Invalid ID");
  }
});

// Creating a note. Only note text is required.
router.post("/", [body("text").exists()], async (req, res) => {
  // If text is not provided in body an error will be thrown
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extracting text from request body
  const { text } = req.body;
  try {
    // Creating a new note
    const newNote = await noteModel.create({ text });
    // Responding with new note saved in database
    res.json(newNote);
  } catch (error) {
    // Catching any error and logging
    console.log(error);
  }
});

// Updated a note by ID and responding with the updated object received from mongoose after update
// Note text is required
router.put("/:_id", [body("text").exists()], async (req, res) => {
  // If text is not provided in body an error will be thrown
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Checking if a valid ID is provided
  if (mongoose.Types.ObjectId.isValid(req.params._id)) {
    try {
      // Extracting text from request body
      const { text } = req.body;

      // Updating the note
      // If the ID is valid but the document doesn't exist 200 OK empty response will be sent
      const updatedNote = await noteModel.findByIdAndUpdate(
        req.params._id,
        {
          text,
        },
        { new: true }
      );
      res.send(updatedNote);
    } catch (error) {
      // Catching any error and logging
      console.log(error);
    }
  } else {
    // Responding with invalid ID if the ID check fails
    res.status(400).send("Invalid ID");
  }
});

// Deleting note by ID
router.delete("/:_id", async (req, res) => {
  // Checking if a valid ID is provided
  if (mongoose.Types.ObjectId.isValid(req.params._id)) {
    try {
      const deletedNote = await noteModel.findByIdAndDelete(req.params._id);
      deletedNote
        ? res.send("Note successfully Deleted!")
        : res.status(404).send("Note not found!");
    } catch (error) {
      // Catching any error and logging
      console.log(error);
    }
  }
});

module.exports = router;
