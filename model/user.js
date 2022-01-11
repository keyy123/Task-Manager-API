const {Schema, model} = require('mongoose')
const {contains} = require('validator')
const bcrypt = require('bcryptjs')
const {sign, verify, decode, JsonWebTokenError} = require('jsonwebtoken')
const Tasks = require('./task')

const UserSchema = new Schema({
    name: {
        type:String, 
        default: "Guest"
    },
    email: {
        type: String, 
        unique:true,
        required:true,
        trim: true,
        lowercase:true,
        validate(value){
            if(contains(value,"email",{ignoreCase:true, minOccurences:1})){
                throw new Error('Your email has the word email in it. I don\'t think thats a thing... 😂. Try a different email')
            }
        }
    },
    password:{
        type: String,
        minlength: [7, "The password is too short"],
        trim: true,
        //This is the validate option using the function 
        validate(value){
            if(contains(value, "password",{ignoreCase: true, minOccurrences:1})){
                throw new Error('The password should not contain password in it, try again')
            }
        },
    // This is validate containing an object {} - with the validator property
    //     validate: {
    //         validator: (value) =>{
    //         if(contains(value, "password",{ignoreCase:true, minOccurrences: 1})){
    //             throw new Error('The password should not contain password in it, try again')
    //         }
    //     }
    // },
        required:true
    },
    profile :{
        type: Buffer
    },
    tokens:[{
        token:{
            type: String,
            required:true
        }
    }]
}, {timestamps:true})

UserSchema.virtual("tasks",{
    ref: "Tasks",
    localField: "_id",
    foreignField:"owner"
})

UserSchema.methods.generateAuthToken = async function(){
const user = this 
const token = await sign({_id:user._id.toString()}, process.env.JWT_SECRET)
//user.tokens = []
user.tokens.push({token})
await user.save()
return token
}

UserSchema.methods.toJSON =  function(){
    let user = this
    let userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.profile
    return userObject
}


UserSchema.statics.findByCredentials = async (email, password) => {
const user = await User.findOne({email})
console.log(user)
if (!user){
    throw new Error('unable to login')
}
const isMatch = await bcrypt.compare(password, user.password)
console.log(user.password, password)
if (!isMatch){
    throw new Error('unable to login')
}
return user
}

UserSchema.pre('save', async function (next) {
const user = this
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
next()
})

UserSchema.pre('remove', async function(next){
    const user = this 
    await Tasks.deleteMany({owner: user._id}) //deletes Tasks associated with the user via _id
    next() 
})

const User = new model('User', UserSchema)
// const Guest = new User({
//     password: "1234567"
// })
// Guest.save().then(()=>{
//     console.log(Guest)
// }).catch((error)=>{
//     console.error(error);
// })

//This should be in controllers or in express server

module.exports = User