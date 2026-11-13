const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model")
const bcrypt = require('bcryptjs');
const jwt =  require('jsonwebtoken');

async function registerUser(req , res) {
   const {fullName , email , password} = req.body

   const isUserAlreadyExists = await userModel.findOne({
    email
   })

   if(isUserAlreadyExists){
    return res.status(400).json({
        message: "User already exists"
    })
   }

   const hashedPasaword = await bcrypt.hash(password , 10)


   const user = await userModel.create({
    fullName,
    email,
    password: hashedPasaword
   })

   const token = jwt.sign({
    id: user._id,
   },process.env.JWT_SECRET)

   res.cookie("token" , token)

   res.status(201).json({
    message: "User registered successfully",
    user : {
        _id : user._id,
        email: user.email,
        fullName: user.fullName
     }
   })
}

async function loginUser(req , res) {

   const { email , password} = req.body;

   const user = await userModel.findOne({
    email
   })

   if(!user){
    return res.status(400).json({
        message: "Invalid email or Password"
       })
   }

   const isPasswordValid = await bcrypt.compare(password , user.password);

   if(!isPasswordValid) {
    return res.status(400).json({
        message : "Invalid email and password"
    })
   }

    const token = jwt.sign({
    id: user._id,
   },process.env.JWT_SECRET)

   res.cookie("token" , token)

   res.status(200).json({
    message: "user loged in successfully",
    user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName
    }
   })


}

function logoutUser(req , res) {
    res.clearCookie("token");
    res.status(200).json({
        message : "user logged out sucessfully"
    })
}

async function registerFoodPartner(req , res) {
     
    const { RestaurantName, name , email , password} = req.body;

    const isAccountAlreadyExists = await foodPartnerModel.findOne({
        email
    })

    if(isAccountAlreadyExists) {
        return res.status(400).json({
            message : "Food Partner account already exists"
        })
    }
 
    const hashedPassword = await bcrypt.hash(password , 10);

    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        RestaurantName
    })

    const token = jwt.sign({
        id: foodPartner._id,
    } , process.env.JWT_SECRET)

    res.cookie("token" , token)

    res.status(201).json({
        message : "Food partner registered succesfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name : foodPartner.name,
            RestaurantName: foodPartner.RestaurantName
        }
    })

}

async function loginFoodPartner(req, res){

    const { email , password} = req.body;

    const foodPartner = await foodPartnerModel.findOne({
        email
    })

    if(!foodPartner) {
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if(!isPasswordValid) {
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: foodPartner._id,

    } , process.env.JWT_SECRET)

    res.cookie("token" , token)

    res.status(200).json({
        message : "Food Partner logged in succesfully",
        foodPartner : {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name
        }
    })

}

function logoutFoodPartner(req , res) {
    res.clearCookie("token");
    res.status(200).json({
     message : "Food Paetner logged out successfully"
    })
}

function getFoodPartnerProfile(req, res) {
    if (!req.foodPartner) {
        return res.status(404).json({
            message: "Food partner profile not found"
        })
    }

    const { _id, email, name, RestaurantName } = req.foodPartner;

    res.status(200).json({
        foodPartner: {
            _id,
            email,
            name,
            RestaurantName
        }
    })
}

function getUserProfile(req, res) {
    if (!req.user) {
        return res.status(404).json({
            message: "User profile not found"
        })
    }

    const { _id, email, fullName } = req.user;

    res.status(200).json({
        user: {
            _id,
            email,
            fullName
        }
    })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner,
    getFoodPartnerProfile,
    getUserProfile
}