const Task = require("../../model/task")
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

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name:"test-user2",
    email:"test-user2@example.com",
    password: "123456789",
    tokens:[{
        token: jwt.sign({_id:userTwoId}, process.env.JWT_SECRET) 
    }] 
}


const taskOne = {
    _id:new mongoose.Types.ObjectId(),
    details: "First Tasks",
    done: false,
    owner: userOne._id
}

const taskTwo = {
    _id:new mongoose.Types.ObjectId(),
    details: "Second Tasks",
    done: true,
    owner: userTwo._id
}

const taskThree = {
    _id:new mongoose.Types.ObjectId(),
    details: "Third Tasks",
    done: "false",
    owner: userOne._id
}


const makeDatabase = async () =>{
 await User.deleteMany({})
 await Task.deleteMany()
 await User.create(userOne)
 await User.create(userTwo)
 await Task.create(taskOne)
 await Task.create(taskTwo)
 await Task.create(taskThree)
}

module.exports = {
userOneId,
userOne,
userTwoId,
userTwo,
taskOne,
makeDatabase
}