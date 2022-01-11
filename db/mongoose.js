const { connect, model, Schema} = require('mongoose')
const {contains, equals} = require('validator')


connect(process.env.DATABASE_URL,{})
// console.log(typeof process.env.JWT_SECRET)


// const myTasks = new Tasks({
//     details: "Cooking dinner"
// })

// myTasks.save().then(()=>{
//     console.log(myTasks)
// }).catch((error)=>{
//     console.error(error);
// })