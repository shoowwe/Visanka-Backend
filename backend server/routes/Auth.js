const express = require("express");
const router = express.Router();
const fs = require('fs');
const mysql = require('mysql2');
const dotenv= require('dotenv').config();
const bcrypt = require('bcrypt');
const util = require('util');  // Import the util module
const jwt= require('jsonwebtoken');
//const conn =  require('../sftpserver');

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
router.route("/creator/content").post(async (req, res) => {
    var { videoPath , filename} = req.body;
    console.
    console.log(req.body)
    try {
        const dir = '/data/user'; // Updated directory path

        // Check if the directory exists, if not, create it
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
            await sftp.connect({
              host: '0.0.0.0',
              port: 22,
              username: 'mohd shoeib',
              password: '24samshoeib',
            });
        const remoteFilePath = `${dir}/${filename}`;

        //const [results] = await db.query(`select title from videos where title=?`, [title]);
        
        await sftp.put(fs.createReadStream(videoPath), remoteFilePath);
        console.log('file got put');
        const exists = await sftp.exists(remoteFilePath);
        if (exists) {
            const video = await insertVideosintodb(filename,videoPath); // Assuming insertVideosintodb is a function for database operation
            return res.status(200).json({ msg: `File got added ${video}` });
        } else {
            throw new Error('File did not get uploaded');
        }
   
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    } finally {
        await sftp.end(); // Make sure to close the connection
    }
});
router.route("/getcontent").get(async (req,res) => {
    try{
    const [result] = await db.query(`select * from videos`);
    if(result.length ==0){
        return res.status(400).json({msg:"Database is empty"});
    }
    return res.status(200).json(result);
    }
    catch(e){
        return res.status(500).json({msg:`${e.message}`});
    }
})
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
