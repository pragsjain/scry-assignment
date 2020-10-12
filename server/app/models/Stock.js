// importing mongoose module
const mongoose = require('mongoose')
// import schema 
const Schema = mongoose.Schema;


let stockSchema = new Schema(
    {
        id: {
            type: String,
            unique: true
        },
        open: {
            type: Number,
            default: ''
        },
        high: {
            type: Number,
            default: ''
        },
        low: {
            type: Number,
            default: ''
        },
        close: {
            type: Number,
            default: ''
        },
        date: {
            type: Date,
            default: Date.now
        }    
    }
)

mongoose.model('Stock', stockSchema);
