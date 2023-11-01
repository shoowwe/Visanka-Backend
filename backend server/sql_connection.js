const express = require('express');

const route = require('./routes/Auth')
const app= express();

app.use(route);
app.use(express.json());

// initializing the server
port = 3000;
app.listen(port,()=>{
    console.log(`server running on ${port}`);
})