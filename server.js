const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./src/config/dbConfig');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const tweetsRoute = require('./src/routes/tweetsRoute')
const usersRoute = require('./src/routes/usersRoute');
const morgan = require('morgan')

// connect to mongoDB
connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}))

// Routes

app.use('/users', usersRoute)
app.use('/tweets', tweetsRoute)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`)
    })
})

