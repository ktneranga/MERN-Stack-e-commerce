import asyncHandler from 'express-async-handler' //npm i express-async-handler
//to get the product details from the DB we use product model
import Product from '../models/productModel.js';

//@desc     Fetch all products
//@route    GET /api/products
//@access   Public  
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

//@desc     Fetch single product
//@route    GET /api/products/:id
//@access   Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    //check whether a product available with the passed id
    if (product) {
        res.json(product);
    } else {
        // res.status(404).json({message : 'Product not found'})
        res.status(404) //our custom error handler gives the default statusCode as 500(Internal server error)
        throw new Error('Product not found');
    }
})

// @desc        Delete product by Id
// @route       DELETE /api/products/:id
// @access      Private / admin       

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        //remove the product
        await product.remove();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found')
    }

})

// @desc        Add a new Product
// @route       POST /api/products
// @access      Private / Admin

const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample Name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    })

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
})

// @desc        update product by id
// @route       PUT /api/products/:id
// @access      Private/Admin

const updateProduct = asyncHandler(async (req, res) => {

    const {
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
    } = req.body

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name
        product.price = price
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock
        product.description = description

        const updatedProduct = await product.save();
        res.status(201).json(updatedProduct);

    } else {
        res.status(404)
        //throw an error to the asynHandler
        throw new Error('Product not found')
    }

})

export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct
} 