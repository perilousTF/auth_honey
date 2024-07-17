const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");

// const { error } = require('console');

const collection = require('./config');

const app = express();

// Convert data into json format
app.use(express.json());

app.use(express.urlencoded({extended : false}));

// Use EJS as the view engine
app.set('view engine' , 'ejs');

//Use static file
app.use(express.static("public"));

app.get("/" , (req , res) => {
    // res.json({error}); 
    res.render("login");
});

app.get("/signup" , (req , res) => {
    res.render("signup");
});

//Register user
app.post('/signup' , async (req , res) => {
    const data = {
        name : req.body.username,
        password : req.body.password
    }

    //Check if the user already exists
    const extinguisher = await collection.findOne({name :data.name});
    if(extinguisher){
        res.send("User already exists. Please a choose a differenr username.")
    }else{
        //Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password , salt);

        data.password = hashedPassword; //Replace original password with Hashed password

        const userdata = await collection.insertMany(data);
        console.log(userdata);

        res.render("home")
    }
});

// Login user
app.post("/login" , async (req , res) => {
    try {
        const check = await collection.findOne({name : req.body.username});
        if(!check){
            res.send("User does not exist");
        }

        // Compare the hashed password from the database with plain text
        const validPassword = await bcrypt.compare(req.body.password , check.password);
        if(validPassword){
            res.render("home");
        }else{
            req.send("Wrong Password");
        }
    } catch (error) {
        res.send("Wrong  Details");
    }
});


app.listen(5000 , () => {
    console.log("Server running on port 5000 ")
})