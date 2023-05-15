const { Schema, model, SchemaType } = require("mongoose");

const outfitSchema = new Schema(
  {
    top: {
        type: Schema.Types.ObjectId,
        ref: 'Piece'
    },
    bottom: {
        type: Schema.Types.ObjectId,
        ref: 'Piece'
    },
    shoes: {
        type: Schema.Types.ObjectId,
        ref: 'Piece'
    },
  },
);

const Outfit = model("Outfit", outfitSchema);

module.exports = Outfit;