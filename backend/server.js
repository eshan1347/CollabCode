// server.js (backend)

const AWS = require('aws-sdk');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-south-1'
});

// AWS.config.update({
//     accessKeyId: '',
//     secretAccessKey: '',
//     region: 'ap-south-1'
// });

// const uploadFileToS3 = (fileName, fileContent) => {
//     const s3 = new AWS.S3();
//     const params = {
//         Bucket: 'collabcode',
//         Key: fileName,
//         Body: fileContent
//     };

//     s3.upload(params, (err, data) => {
//         if (err) {
//             console.error('Error uploading file to S3:', err);
//         } else {
//             console.log('File uploaded successfully:', data.Location);
//         }
//     });
// };

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});     



io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('edit', (content) => {
        io.emit('updateContent', content);
    });

    socket.on('bold', (bold) => {
        io.emit('updateStyleBold', bold);
    })

    socket.on('italic', (italic) => {
        io.emit('updateStyleItalic', italic);
    })

    socket.on('underline', (underline) => {
        io.emit('updateStyleUnderline', underline);
    })

    const upload = multer({ dest: 'uploads/' });

    app.post('/upload', upload.single('file'), (req,res) => {
        const file = req.file;
        const ext = req.ext;
        const params = {
            Bucket: 'collabcode',
            Key: `codes/file.${req.body.ext}`,
            Body: fs.readFileSync(file.path)
        };

        if(!file){
            return res.status(400).send('No file uploaded');
        }

        s3.upload(params, (err,data) => {
            if (err){
                console.log('Oops: ',err);
                res.status(500).send('Oops');
            }
            else{
                console.log('Success: ', data);
                res.status(200).send('W');
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));