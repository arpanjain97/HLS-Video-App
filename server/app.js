var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');
const cors = require('cors');
const multer = require("multer");

const runHLSTransmux = require("./modules/RunHLSTransmux");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
    res.send('OK');
});

const upload = multer({
    storage: multer.diskStorage({
        destination: "upload/",  // Storage location
        filename: (req, file, cb) => {
            cb(null, Date.now() + '_' + file.originalname) // return a unique file name for every file              
        }
    }),

    limits: {fileSize: 20000000},   // This limits file size to 20 million bytes(20mb)

    fileFilter: (req, file, cb) => {
        const validFileTypes = /mp4/ // Create regex to match jpg and png

        // Do the regex match to check if file extenxion match
        const extname = validFileTypes.test(path.extname(file.originalname).toLowerCase())

        if(extname === true){
            // Return true and file is saved
             return cb(null, true)
        }else{
            // Return error message if file extension does not match
            console.log("err");
            return cb("Error: MP4 videos Only!")
            }
        }
}).single("file");

app.post("/upload", upload, async (req, res) => {
    const name = Date.now();
    await runHLSTransmux(req.file.path, name);
    res.status(200).send();
});

app.get("/upload", (req, res) => {
    fs.readdir('./public', (err, files) => {
        if (err) {
            res.status(500).send();
            return;
        }
        res.status(200).send({ video_ids: files.filter((v) => v !== '.gitkeep' ) });
    })
});

module.exports = app;
