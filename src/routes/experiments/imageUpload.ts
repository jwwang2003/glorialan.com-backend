import express from "express";

import multer from "multer"
import exifreader from "exifreader"
import { User } from "@prisma/client";
import { PassThrough } from "stream";

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/imageupload', async (req, res) => {
  if(req.session) {
    console.log(req.session)
  }
  if (!req.session || !req.session.user) {
    res.status(401).json({ msg: "Not authorized." });
    return;
  }
  const user: User = req.session.user;
  // res.status(200).json({ msg: `Welcome ${user.name} (${user.username})~ You are a ${ROLES[user.role[0]].toString()}.` });

   // An array to hold our chunked data
   const chunks = [];
   // PassThrough stream to receive piped data
   const pass = new PassThrough();

   // Collect incoming data chunks
   pass.on('data', (chunk) => {
    chunks.push(chunk);
  });

  // When all data has been read, combine into a single Buffer
  pass.on('end', () => {
    const fileBuffer = Buffer.concat(chunks);

    // At this point, you have your entire upload in fileBuffer.
    // Do something with it (process, send to a service, etc.).
    console.log('Received file size (bytes):', fileBuffer.length);

    // Send a response back to the client
    return res.json({
      message: 'File uploaded successfully (in-memory)',
      size: fileBuffer.length,
    });
  });

  // Pipe the request into our PassThrough
  req.pipe(pass);
  
  // try {
  //   // Collect the incoming raw data as it arrives
  //   let chunks = [];
  //   req.on('data', (chunk) => {
  //     chunks.push(chunk);
  //     console.log(chunk);
  //   });

  //   req.on('end', async () => {
  //     // Combine all chunks into a single Buffer
  //     const fileBuffer = Buffer.concat(chunks);
  //     console.log(fileBuffer);
  //     const tags = await exifreader.load(fileBuffer, {async: true})

  //     res.status(200).json(tags);
  //     return;
  //   });
  // } catch (error) {
  //   console.error('Upload error:', error);
  //   res.status(500).json({ error: 'Server error' });
  // }
  // if (req.file) {
  //   const buffer = req.file.buffer;
  //   console.log(buffer);
  //   const tags = await exifreader.load(buffer, {async: true})

  //   res.status(200).json(tags);
  //   return;
  // }
  // res.status(200).json({msg: "there as nothing"});
  // return;
});

export default app;