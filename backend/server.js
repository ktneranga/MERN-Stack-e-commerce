//import path module
import path from 'path'
//after setting up a environment variable we need to re start the server
// const express = require('express');
import express from 'express';
// const dotenv = require('dotenv');
import dotenv from 'dotenv'
import colors from 'colors'
// const products = require('./data/products')
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/usersRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
// import uploadRoutes from './routes/uploadRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

// dotenv.config() should be called before the connectDB()
dotenv.config();

//call the db function
connectDB();
const app = express();

//middleware bodyparser
app.use(express.json());

app.get('/api', (req, res) => res.json({ msg: 'Welcome to the ProShop API' }));
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/upload', uploadRoutes);

//when ready to make the payment we hit this endpoint and fetch this paypal id
//in order to implement paypal we have to go to the OrderScreen => we need to include specific script
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

//make the upload folder as static
// const __dirname = path.resolve()
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

//handle 404 errors middleware
app.use(notFound)

//error middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));