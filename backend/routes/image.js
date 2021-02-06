const path = require('path');
const multer = require('multer');
const express = require('express');
const fs = require('fs-extra');

const storage = multer.diskStorage({
  destination: './backend/files/',
  filename: function (req, file, cb) {
    cb(null, 'IMAGE-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single('myImage');

const router = express.Router();
router.post('/', function (req, res) {
  upload(req, res, (err) => {
    console.log('Request ---', req.body);
    console.log('Request file ---', req.file);
    if (!err) {
      return res.sendStatus(200);
    } else {
      return res.sendStatus(400);
    }
  });
});

module.exports = router;
