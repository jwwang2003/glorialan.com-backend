import express from "express";

import multer from "multer"
import exifreader from "exifreader"
import { User } from "@prisma/client";

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/imageupload', upload.single('image'), async (req, res) => {
  if(req.session) {
    console.log(req.session)
  }
  if (!req.session || !req.session.user) {
    res.status(401).json({ msg: "Not authorized." });
    return;
  }
  const user: User = req.session.user;
  // res.status(200).json({ msg: `Welcome ${user.name} (${user.username})~ You are a ${ROLES[user.role[0]].toString()}.` });
      
  if (req.file) {
    const buffer = req.file.buffer;
    console.log(buffer);
    const tags = await exifreader.load(buffer, {async: true})

    res.status(200).json(tags);
    return;
  }
  res.status(200).json({msg: "there as nothing"});
  return;
});

export default app;