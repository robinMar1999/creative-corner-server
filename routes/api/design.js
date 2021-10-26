const express = require("express");
const router = express.Router();
const Design = require("../../models/Design");
const drive = require("../../controllers/drive");
const multer = require("multer");

const upload = multer();

router.get("/", async (req, res) => {
  try {
    const designs = await Design.find();
    res.json(designs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error!" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    res.json(design);
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
    // console.log("array generated");
    const design = new Design({
      info: [...arr],
    });
    await design.save();
    res.json({ design });
  } catch (err) {
    res.status(500).json({ msg: "Server Error!" });
  }
});

module.exports = router;
