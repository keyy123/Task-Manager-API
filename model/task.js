const {Schema, model, SchemaTypes} = require('mongoose')
const {equals} = require('validator')

const TaskSchema = new Schema({
    details: {
        type: String,
        trim:true,
        lowercase:true,
        minlength: [3, 'Must be at least 3 letters, got {VALUE} '],
        required: [true, 'You have to write down a task to put it on the task list']
    },
    done: {
        type: String, 
        validate(value){
            if(!(equals(value, "true") || equals(value, "false"))){
                throw new Error(`This ain\'t it, we need a boolean not a ${value}!`)
            }
        },
        default: false
    },
    owner: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    }
}, {timestamps:true})

const Tasks = new model('Tasks', TaskSchema)

module.exports = Tasks