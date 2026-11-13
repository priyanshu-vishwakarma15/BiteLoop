const mongoose = require('mongoose');

const foodpartnerSchema = new mongoose.Schema({
   
    RestaurantName : {
        type : String,
        required : true
    },
   
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    }
})

const foodPartnerModel = mongoose.model("foodpartner" ,foodpartnerSchema )

module.exports = foodPartnerModel;