const foodModel = require('../models/food.model')
const mongoose = require('mongoose')
const storageServices = require('../services/storage.service')
const { v4 : uuid } = require("uuid")

async function createFood(req , res) {
    if (!req.file) {
        return res.status(400).json({
            message: "Please upload a video"
        })
    }

    try {
        const fileUploadResult = await storageServices.uploadFile(req.file.buffer, uuid())

        const foodItem  = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodPartner: req.foodPartner._id
        })

        return res.status(201).json({
            message: "food created successfully",
            food: foodItem
        })
    } catch (error) {
        console.error("Unable to create food item", error)
        return res.status(500).json({
            message: "Unable to upload your video. Please try again."
        })
    }
}

async function getFoodItems(req, res) {
    const filter = {}
    if (req.query.foodPartner) {
        if (!mongoose.Types.ObjectId.isValid(req.query.foodPartner)) {
            return res.status(400).json({
                message: "Invalid food partner ID"
            })
        }

        filter.foodPartner = req.query.foodPartner
    }

    const foodItems = await foodModel.find(filter).populate({
        path: "foodPartner",
        select: "_id name RestaurantName"
    })

    res.status(200).json({
        message: "Food items retrieved successfully",
        foodItems: foodItems
    })
}

module.exports = {
    createFood,
    getFoodItems
}