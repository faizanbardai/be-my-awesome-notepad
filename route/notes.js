const express = require("express");
const router = express.Router();
const noteModel = require("../model/note");

router.get("/", async (req, res) => {
  res.json(await noteModel.find());
});

router.get("/:_id", async (req, res) => {
  res.json(await noteModel.findById(req.params._id));
});

router.post("/", async (req, res) => {
  const { note } = req.body;
  const newNote = await noteModel.create({ note });
  res.json(newNote);
});

router.put("/:_id", async (req, res) => {
  const { note } = req.body;
  const updatedNote = await noteModel.findByIdAndUpdate(
    req.params._id,
    {
      note,
    },
    { new: true }
  );
  res.send(updatedNote);
});

router.delete("/:_id", async (req, res) => {
  await noteModel.findByIdAndDelete(req.params._id);
  res.send("Note successfully Deleted!");
});

module.exports = router;
