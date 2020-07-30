var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Desining Notes schema. Setting timestamp to true will automatically add created-at and updated-at values
var noteSchema = new Schema(
  {
    text: String,
  },
  { timestamps: true, collection: "note" }
);

// Attaching schema to model and exporting
const noteModel = mongoose.model("note", noteSchema);

module.exports = noteModel;
