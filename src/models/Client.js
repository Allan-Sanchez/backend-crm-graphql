import {Schema, model} from 'mongoose';

const ClientModel = new Schema({
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
    company:{
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
    phone:{
        type:String,
        trim:true,
    },
    seller:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
},{
    timestamps:true,
    versionKey:false
});

export default model('Client',ClientModel);