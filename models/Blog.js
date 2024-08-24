const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please enter title"],
      trim: true,
    },
    genure: {
      type: String,
      required: [true, "Please enter genure"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter description"],
      trim: true,
    },
    images: [
      {
        public_id: { type: String },
        url: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", schema);
