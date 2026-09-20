const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./db/db');

const PORT = process.env.PORT || 8000;

const app = express();


require('dotenv').config();

app.use(helmet({
    contentSecurityPolicy: false
}));

app.use(cors({
    origin: '*',
    credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const limiter = rateLimit({
    windowMS : 15 * 60 * 1000, // 15 minutes
    max : 100, // limit each IP to 100 requests per windowMs
    message : 'Too many requests from this IP, please try again after 15 minutes'
})
app.use(limiter);

app.use(( err ,req, res, next) => {
    console.error(err.stack, req.method, req.url, );
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Routes

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/news', require('./routes/news.route'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/ads', require('./routes/ads'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/notifications', require('./routes/notification'))
app.use('/api/ai', require('./routes/ai.route'))
app.use('/api/reader-news', require('./routes/readerNews'))

app.get('/health',(req,res)=>{
    res.status(200).json({
        success: true,
        message: 'Server is healthy'
    })
})

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

module.exports = app;