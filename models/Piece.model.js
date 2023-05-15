const { Schema, model, SchemaType } = require("mongoose");

const pieceSchema = new Schema(
  {
    name: {
        type: String,
    },
    imageUrl: {
        type: String, 
    },
    pieceType: {
        type: String,
        enum: ['top', 'bottom', 'shoes'],
    },
  },
);

const Piece = model("Piece", pieceSchema);

module.exports = Piece;