const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema({
  imageUrls: [
    {
      type: String,
    },
  ],
});

module.exports = Design = mongoose.model("design", DesignSchema);
