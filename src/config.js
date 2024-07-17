const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/auth_honeydb"); //auth_honeydb : name of database

//check if connection successful 
connect.then(() => {
    console.log("Databse connected successfully");
}) 
.catch(() => {
    console.log("database cannot be connected");
})

//Create Schema
const LoginSchema = new mongoose.Schema({
    name:{
        type:String,
        required :true,
        unique : true,
    },
    password:{
        type:String,
        required:true
    }
});

//collection Part
const collection = new mongoose.model("users" , LoginSchema);    // users : name of collection

module.exports = collection;