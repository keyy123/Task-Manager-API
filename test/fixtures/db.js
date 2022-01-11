const User = require("../../model/user")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name:"test-user",
    email:"test-user@example.com",
    password: "123456789",
    tokens:[{
        token: jwt.sign({_id:userOneId}, process.env.JWT_SECRET) 
    }] 
}

const makeDatabase = async () =>{
 await User.deleteMany({})
 await User.create(userOne)
}

module.exports = {
userOneId,
userOne,
makeDatabase
}