const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema({
  info: [
    {
      url: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = Design = mongoose.model("design", DesignSchema);
