import mongoose from 'mongoose'
//we need to import mongo uri from .env file, to do that we need to import dotenv
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import connectDB from './config/db.js'

//first we have to call the dotenv
dotenv.config();

//now we can call connectDB because we have access to the env variables(mongo_uri) 
connectDB();

//create two function for importing and destroying data
//we are dealing with DB / mongoose => everyting returns promises

const importData = async () => {
    try {
        //first clear all three models
        await Order.deleteMany()
        await User.deleteMany()
        await Product.deleteMany()

        //import data
        const createdUsers = await User.insertMany(users);
        //created user is an array, we need to get the admin user from that array
        const adminUser = createdUsers[0]._id

        const sampleProducts = products.map(product => {
            return { ...product, user: adminUser };
        })

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!'.green.inverse);
        process.exit();

    } catch (err) {
        console.error(`${err}`.red.inverse);
        process.exit(1);
    }
}

const destroyData = async () => {
    try {
        await Order.deleteMany()
        await User.deleteMany()
        await Product.deleteMany()

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (err) {
        console.error(`${err}`.red.inverse);
        process.exit(1);
    }
}

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}