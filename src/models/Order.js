import {Schema,model} from 'mongoose';

const OrderSchema = new Schema({
    order:{
        type: Array,
        required: true
    },
    total:{
        type:Number,
        required:true,
        trim:true
    },
    client:{
        type: Schema.Types.ObjectId,
        ref:'Client',
        required: true
    },
    seller:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    state:{
        type: String,
        default:"PENDING"
    }
},{
    timestamps:true,
    versionKey:false
});

export default model('Order',OrderSchema);