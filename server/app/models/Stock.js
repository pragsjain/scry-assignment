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
            type: String,
            default: ''
        },
        high: {
            type: String,
            default: ''
        },
        low: {
            type: String,
            default: ''
        },
        close: {
            type: String,
            default: ''
        },
        date: {
            type: Date,
            default: Date.now
        }    
    }
)

mongoose.model('Stock', stockSchema);
