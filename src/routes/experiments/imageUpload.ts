import express from "express";

import multer from "multer"
import exifreader from "exifreader"

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/imageupload', upload.single('image'), async (req, res) => {
  if (req.file) {
    const buffer = req.file.buffer;
    console.log(buffer);
    const tags = await exifreader.load(buffer, {async: true})

    res.status(200).json(tags);
  }
});

export default app;