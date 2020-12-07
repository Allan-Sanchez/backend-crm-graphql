import {Schema,model} from 'mongoose';


const ProductSchema = new Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    stock:{
        type:Number,
        trim:true,
        required:true
    },
    price:{
        type:Number,
        trim:true,
        required:true,
        unique:true
    }
},{
    timestamps:true,
    versionKey:false
});

export default model('Product',ProductSchema);