const mongoose = require('mongoose');
const dns = require('dns');


const connectDB = async()=>{
dns.setServers(["8.8.8.8"])
    try {
        const mongoInst = mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log('MongoDB connected');
        })
        
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;