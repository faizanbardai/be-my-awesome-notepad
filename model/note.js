var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var noteSchema = new Schema(
  {
    text: String,
  },
  { timestamps: true, collection: "note" }
);

const noteModel = mongoose.model("note", noteSchema);

module.exports = noteModel;
