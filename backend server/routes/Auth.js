const express = require("express");
const router = express.Router();
const fs = require('fs');
const mysql = require('mysql2');
const dotenv= require('dotenv').config();
const bcrypt = require('bcrypt');
const util = require('util');  // Import the util module
const jwt= require('jsonwebtoken');
//const conn =  require('../sftpserver');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specifies that uploaded files will be stored in the 'uploads/' directory
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Uses the original file name for storing the file
    }
  });
  

const upload = multer({ storage: storage });
const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();
const Client = require('ssh2-sftp-client');
const sftp = new Client();

async function makeDirectories() {
  try {
    await sftp.connect({
      host: '0.0.0.0',
      port: 22,
      username: 'mohd shoeib',
      password: '24samshoeib',
    });
  } catch (error) {
    console.error('Error creating directory:', error);
  } finally{
    await sftp.end();
  }
}

makeDirectories();


router.use(express.json());

router.route("/user/signup").post(async (req,res) => {
    
    const { name , email , password , confirmpassword} = req.body;
    try {

        const [results]  = await db.query(`select email from  users where email = ?`, [email]);
        if(results.length > 0){
                return res.status(400).json({msg : " email already exists"});
            }
        if(!validateEmail(email)){
            return res.status(400).json({msg : "email is not valid"});
        }
       if(password!=confirmpassword){
        return res.status(400).json({ msg:"Passwords does not match"});
        }let hashedPassword = await bcrypt.hash(password, 8 );
        const user= createEntry(name,email,hashedPassword);
        return res.status(200).json({"user": user});
        } catch (error) {
    
        return res.status(500).json({ msg: "Internal Server Error" });
    }
    
});
router.route("/user/signin").post(async (req,res) => {
    const {email,password} = req.body;
    console.log(req.body);
    try{
        const [results] = await db.query(`select id,name,email,hashedPassword from users where email=? `,[email]);
        if(results.length<=0){
            return res.status(400).json({msg:"User does not exist"});
        }
        const checkp =  await bcrypt.compare(password,results[0].hashedPassword);
        if(!checkp){
            return res.status(400).json({msg: "Passwords does not match"});

        }
        const token = jwt.sign({id: results[0]._id},
            "hashedPassword");
            return res.json({token,...results[0]._doc});
        
    }
    catch(e){
        console.log(e.message);
    }

});

async function createEntry(name, email, hashedPassword) {
    try {
        const [result, fields] = await db.query(
            `INSERT INTO users (name, email, hashedPassword) VALUES (?, ?, ?)`,
            [name, email, hashedPassword]
        );

        return { id: result.insertId, name, email };
    } catch (error) {
        throw error;
    }
}
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
router.route("/creator/content").post(upload.single('file'),async (req, res) => {
    const {path} = req.file;
    const {originalname} =req.file;
    try {
        const dir = '/data/user'; 
           await sftp.connect({
              host: '0.0.0.0',
              port: 22,
              username: 'mohd shoeib',
              password: '24samshoeib',
            });
            sftp.mkdir(dir,true);
        const remoteFilePath = `${dir}/${originalname}`;

        const [results] = await db.query(`select title from videos where title=?`, [originalname]);
        if(results.length==0){
        try{
        await sftp.put(fs.createReadStream(path), remoteFilePath);}
        catch{
            throw new Error('error uploading the file');
        }
        console.log('file got put');
       
        const exists = sftp.exists(remoteFilePath);
        if (exists) {
            const video = await insertVideosintodb(originalname,remoteFilePath); // Assuming insertVideosintodb is a function for database operation
            return res.status(200).json({ msg: `File got added ${video}` });
        } else {
            throw new Error('File did not get uploaded');
        }}else{
            return res.status(200).json({msg:"file already exists"
            });
        }
   
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    } finally {
       sftp.end(); // Make sure to close the connection
    }
});
router.route("/getcontent").get(async (req, res) => {

    try {
        var [results] = await db.query(`select * from videos`);
        console.log(results.length);
        if (results.length == 0) {
            return res.status(404).json({ msg: 'NO files exists' });
        }

        await sftp.connect({
            host: '0.0.0.0',
            port: 22,
            username: 'mohd shoeib',
            password: '24samshoeib',
        });

        var videos = [];
        for (const video of results) {
            const exists = await sftp.exists(video.file_path);
            if (exists) {
                const path = await sftp.get(video.file_path);
                if (path) {
                    videos.push(path);
                }
            }
        }
        const videosPaths = videos.map(path => {
            const stat = fs.statSync(path);
            const fileSize = stat.size;
            const videoStream = fs.createReadStream(path);
        
            return {
              fileSize,
              videoStream,
            };
          });
        
        return  res.status(200).json({ videosPaths });

    } catch (error) {
        return res.status(500).json({ msg: error.message });
    } finally {
        sftp.end();
    }

});


async function insertVideosintodb(title,file_path){
    try{
        const [result] =  await db.query(` Insert into videos(title,file_path) VALUES (?,?)`,
        [title,file_path]);
    }
    catch(e){
        throw e;
    }
    
}
module.exports = router;
