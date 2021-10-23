const express = require("express");
const router = express.Router();
const Design = require("../../models/Design");
const drive = require("../../controllers/drive");
const multer = require("multer");

const upload = multer();

router.get("/", async (req, res) => {
  try {
    res.send("Design route");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error!" });
  }
});

router.post("/", upload.array("photos"), async (req, res) => {
  try {
    const arr = [];
    for (let file of req.files) {
      const result = await drive.uploadFile(file);
      // const result = await drive.uploadFile(file.buffer);
      arr.push(result);
    }
    res.json(arr);
  } catch (err) {
    res.json({ msg: "Server error" });
  }
});

module.exports = router;
