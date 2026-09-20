const express =require("express")
const User = require("../models/User.model")
const router = express.Router()

router.post('/subscribe',async (req,res)=>{
    try {
        const {token} = req.body;
        res.json({
            success:true,
            message:"Notification Activated"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
})

module.exports = router
