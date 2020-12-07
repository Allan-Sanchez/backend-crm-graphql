import {Schema,model} from 'mongoose';


const UserSchema = new Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    lastName:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        trim:true,
        required:true
    }
},{
    timestamps:true,
    versionKey:false
});

export default model('User',UserSchema);