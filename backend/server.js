const AWS = require('aws-sdk');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { spawn } = require('child_process');
const { resolve } = require('path');
require('dotenv').config();

ext = 'py';
code = '';

const app = express();
app.use(cors());

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-south-1'
});
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});     

// const uploadToS3 = (files) => {
// const uploadPromises = uploadFiles.map((file) => {
//     return new Promise((resolve, reject) => {
//         s3.upload({ ...params, ...file }, (err, data) => {
//             if (err) {
//                 console.error('Error uploading to S3:', err);
//                 reject(err);
//             } else {
//                 console.log('Uploaded to S3:', data.Location);
//                 resolve();
//             }
//         });
//     });
// });
// Promise.all(uploadPromises)
//     .then(() => {
//         res.status(200).send('Files uploaded successfully');
//     })
//     .catch((error) => {
//         console.error('Error uploading files:', error);
//         res.status(500).send('Error uploading files to S3');
//     });
// };

function uploadToS3(ext, file, output, params) {
    const uploadFiles = [
        { Key: `codes/${ext}/file.${ext}`, Body: fs.readFileSync(file.path) },
        { Key: `outputs/${ext}/output.txt`, Body: output }
    ];

    const uploadPromises = uploadFiles.map((file) => {
        return new Promise((resolve, reject) => {
            s3.upload({ ...params, ...file }, (err, data) => {
                if (err) {
                    console.error('Error uploading to S3:', err);
                    reject(err);
                } else {
                    console.log('Uploaded to S3:', data.Location);
                    resolve();
                }
            });
        });
    });

    return Promise.all(uploadPromises)

}



io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('edit', (content) => {
        io.emit('updateContent', content);
    });

    socket.on('bold', (bold) => {
        io.emit('updateStyleBold', bold);
    });

    socket.on('italic', (italic) => {
        io.emit('updateStyleItalic', italic);
    });

    socket.on('underline', (underline) => {
        io.emit('updateStyleUnderline', underline);
    });

    socket.on('code', (code) => {
        console.log('Code : ' + code);
        io.emit('code', code);
        code = code;
    });

    const mul = (e) =>{
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads/'); // Specify the destination directory
            },
            filename: function (req, file, cb) {
                console.log('Ext2: ' , e);
                cb(null, `code.${e}`); // Specify the file name and extension (e.g., code.c)
            }
        });
        return multer({ storage: storage });
    };

    let upload = mul(ext);

    socket.on('ext', (ex) => {
        console.log('Extension : ' + ex);
        ext = ex;
        upload = mul(ex);
    });
    // const upload = multer({ dest: 'uploads/' });

    app.post('/upload', upload.single('file'), (req, res) => {
        const file = req.file;
        const ext = req.body.ext;
        console.log('Ext3: ', ext);
        upload = mul(ext);
        const params = {
            Bucket: 'collabcode',
            Key: `codes/file.${ext}`,
            Body: fs.readFileSync(file.path)
        };

        if (!file) {
            return res.status(400).send('No file uploaded');
        }
        if (ext == 'py'){
            // Execute Python file
            console.log('File Path:', file.path);
            const pythonProcess = spawn('python3', [file.path]);

            let output = '';

            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`Error from Python script: ${data}`);
            });

            pythonProcess.on('close', (code) => {
                console.log(`Python script exited with code ${code}`);
                console.log('Emitting output:', output);
                io.emit('output', output);
                console.log('Output Emitted');
                // Upload Python file and output to S3
                // const uploadFiles = [
                //     { Key: `codes/${ext}/file.${ext}`, Body: fs.readFileSync(file.path) },
                //     { Key: `outputs/${ext}/output.txt`, Body: output }
                // ];
                uploadToS3(ext, file, output, params)
                .then(() => {
                    res.status(200).send('Files uploaded successfully');
                })
                .catch((error) => {
                    console.error('Error uploading files:', error);
                    res.status(500).send('Error uploading files to S3');
                });
            });

        };
        if (ext == 'java'){
            const oldFilePath = file.path; // Store the old file path
            const newFilePath = `uploads/code.${ext}`; // Construct the new file path with the updated extension
            // Rename the file on disk to match the new extension
            fs.renameSync(oldFilePath, newFilePath);
            upload = mul(ext)
            console.log('File Path:', file.path);
            const compileProcess = spawn('javac', ['-d','.',newFilePath]);

            // Capture compilation output
            compileProcess.stdout.on('data', (data) => {
                console.log('Compilation output:', data.toString());
            });

            // Capture compilation errors
            compileProcess.stderr.on('data', (data) => {
                console.error('Compilation error:', data.toString());
            });

            compileProcess.on('close', (data) => {
                if (code == 0){
                    const javaProcess = spawn('java', ['-cp', '.', newFilePath]); // Specify classpath here
                    let output = '';
                    console.log('Op OP');

                    javaProcess.stdout.on('data', (data) => {
                        output += data.toString();
                    });
                
                    javaProcess.stderr.on('data', (data) => {
                        console.error(`Error from Java program: ${data}`);
                    });
                    javaProcess.on('close', (data) => {
                        console.log(`Java program exited with code ${data}`);
                            console.log('Emitting output:', output);
                            io.emit('output', output);
                            console.log('Output Emitted');
                            console.log('File Path:', newFilePath);
                            const params = {
                                Bucket: 'collabcode',
                                Key: `codes/file.${ext}`, // Update the file extension here
                                Body: fs.readFileSync(newFilePath) // Replace .py extension with .c
                            };
                            console.log('Params Body: ',params.Body);                        
                            // Additional logic for uploading to S3 if needed
                            console.log('Ext4 : ',ext)
                            console.log('File : ',file)
    
                            // fs.renameSync(oldFilePath, newFilePath);
                            file.filename = `code.${ext}`;
                            file.path = `${file.destination}/${file.filename}`;
                            // console.log('File Path:', file.path);
                            console.log('File Path:', file.path);
            
                            // Additional logic for uploading to S3 if needed
                            uploadToS3(ext, file, output, params)
                            .then(() => {
                                res.status(200).send('Files uploaded successfully');
                            })
                            .catch((error) => {
                                console.error('Error uploading files:', error);
                                res.status(500).send('Error uploading files to S3');
                            });
                    });
            }
            });
        };

        if (ext == 'c'){
            const oldFilePath = file.path; // Store the old file path
            const newFilePath = `uploads/code.${ext}`; // Construct the new file path with the updated extension
        
            // Rename the file on disk to match the new extension
            fs.renameSync(oldFilePath, newFilePath);
            upload = mul(ext)
            console.log('File Path:', file.path);
            const cProcess = spawn('gcc', [ newFilePath ,'-o', 'exec']);
            cProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });
            cProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });
            
            cProcess.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
                if (code === 0) {
                    const executableProcess = spawn('./exec');
                    let output = '';
                    executableProcess.stdout.on('data', (data) => {
                        output += data.toString();
                    });
            
                    executableProcess.stderr.on('data', (data) => {
                        console.error(`Error from C program: ${data}`);
                    });
                    
                    executableProcess.on('close', (code) => {
                        // resolve(output);
                        console.log(`C program exited with code ${code}`);
                        console.log('Emitting output:', output);
                        io.emit('output', output);
                        console.log('Output Emitted');
                        // Rename the file on disk to match the new extension
                        

                        // Update the file object with the new file path
                        // file.path = newFilePath;
                        // fs.renameSync(oldFilePath, newFilePath);
                        console.log('File Path:', newFilePath);
                        const params = {
                            Bucket: 'collabcode',
                            Key: `codes/file.${ext}`, // Update the file extension here
                            Body: fs.readFileSync(newFilePath) // Replace .py extension with .c
                        };
                        console.log('Params Body: ',params.Body);                        
                        // Additional logic for uploading to S3 if needed
                        console.log('Ext4 : ',ext)
                        console.log('File : ',file)

                        // fs.renameSync(oldFilePath, newFilePath);
                        file.filename = `code.${ext}`;
                        file.path = `${file.destination}/${file.filename}`;
                        // console.log('File Path:', file.path);
                        console.log('File Path:', file.path);
                        uploadToS3(ext, file, output, params)
                        .then(() => {
                            res.status(200).send('Files uploaded successfully');
                        })
                        .catch((error) => {
                            console.error('Error uploading files:', error);
                            res.status(500).send('Error uploading files to S3');
                        });
                    });
                }
            });
            
        };
        if (ext == 'cpp'){
            const oldFilePath = file.path; // Store the old file path
            const newFilePath = `uploads/code.${ext}`; // Construct the new file path with the updated extension
            // Rename the file on disk to match the new extension
            fs.renameSync(oldFilePath, newFilePath);
            upload = mul(ext)
            console.log('File Path:', file.path);
            const cppProcess = spawn('g++', [newFilePath, '-o', 'exec']);
            cppProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            cppProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            cppProcess.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
                if (code === 0) {
                    const executableProcess = spawn('./exec');
                    let output = '';
                    executableProcess.stdout.on('data', (data) => {
                        output += data.toString();
                    });

                    executableProcess.stderr.on('data', (data) => {
                        console.error(`Error from C++ program: ${data}`);
                    });

                    executableProcess.on('close', (code) => {
                        console.log(`C++ program exited with code ${code}`);
                        console.log('Emitting output:', output);
                        io.emit('output', output);
                        console.log('Output Emitted');
                        console.log('File Path:', newFilePath);
                        const params = {
                            Bucket: 'collabcode',
                            Key: `codes/file.${ext}`, // Update the file extension here
                            Body: fs.readFileSync(newFilePath) // Replace .py extension with .c
                        };
                        console.log('Params Body: ',params.Body);                        
                        // Additional logic for uploading to S3 if needed
                        console.log('Ext4 : ',ext)
                        console.log('File : ',file)

                        // fs.renameSync(oldFilePath, newFilePath);
                        file.filename = `code.${ext}`;
                        file.path = `${file.destination}/${file.filename}`;
                        // console.log('File Path:', file.path);
                        console.log('File Path:', file.path);

                        // Additional logic for uploading to S3 if needed
                        uploadToS3(ext, file, output, params)
                        .then(() => {
                            res.status(200).send('Files uploaded successfully');
                        })
                        .catch((error) => {
                            console.error('Error uploading files:', error);
                            res.status(500).send('Error uploading files to S3');
                        });
        });
    }
});

        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

