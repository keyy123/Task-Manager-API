


const chalk = require('chalk')
const {MongoClient, ObjectId} = require('mongodb')
//const MongoClient = mongodb.MongoClient this is the same as above
const url = "mongodb://127.0.0.1:27017"
const dbName = "task-manager"



MongoClient.connect(url,{useNewUrlParser:true}, (error,client)=>{
    if(error){
        return console.log(chalk.bgRed(`Unable to link to database: ${error.message}`))
    }
    const db = client.db(dbName)
    

})