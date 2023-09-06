import mongoose from "mongoose"

const userCollection = "users"

const schemaStringTypeRequiered = {
    type: String,
    required: true
}

const usersSchema = new mongoose.Schema({
    name: schemaStringTypeRequiered,
    surname:schemaStringTypeRequiered,
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: schemaStringTypeRequiered,
    isAdmin: {
        type: Boolean,
        default: false
    } 
})

const usersModel = new mongoose.model(userCollection, usersSchema)

export default usersModel