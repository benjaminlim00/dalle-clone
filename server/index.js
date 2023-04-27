const PORT = 8000;

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// setup openAI
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log(process.env.OPENAI_API_KEY);
const openai = new OpenAIApi(configuration);

app.post('/generate-image', async (req, res) => {
  try {
    const response = await openai.createImage({
      prompt: req.body.prompt,
      n: 4,
      size: '256x256',
    });
    res.send(response.data.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `./server/images`;
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage }).single('file');
let filePath;

app.post('/upload-image', async (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(500).json(err);
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json(err);
    }
    filePath = req.file?.path;
  });
});

app.post('/variations', async (req, res) => {
  try {
    //TODO: fix this
    const response = await openai.createImageVariation(
      // @ts-ignore
      fs.createReadStream(filePath),
      4,
      '256x256'
    );
    res.send(response.data.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
