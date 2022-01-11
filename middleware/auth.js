const {verify} = require('jsonwebtoken')
const User = require('../model/user')

const auth = async (req, res, next) =>{
try{
// console.log(req.headers.authorization.split(' ')[1])
let token = req.headers.authorization.split(' ')[1]
let verifiedToken = await verify(token, process.env.JWT_SECRET)
const user = await User.findOne({_id: verifiedToken._id, 'tokens.token':token})

if(!user){
    throw new Error()
}
req.user = user
req.token = token
// console.log(req)
next()
}catch(e){
    res.status(401).send({error: 'Please authenticate.'})
}
}

module.exports = auth