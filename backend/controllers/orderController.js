import asyncHandler from 'express-async-handler' //npm i express-async-handler
//to get the product details from the DB we use product model
import Order from '../models/orderModel.js';

// @desc        Create new order
// @route       POST /api/orders
// @access      private

const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsprice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body

    //check whether order items are available

    if (orderItems && orderItems.length === 0) {
        res.status(400); //because user has not passed data
        throw new Error('No order items');
        return
    } else {
        const order = new Order({
            user: req.user._id,
            orderItems: orderItems,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            itemsprice: itemsprice,
            taxPrice: taxPrice,
            shippingPrice: shippingPrice,
            totalPrice: totalPrice
        });

        //save to the schema => create the order
        const createOrder = await order.save();
        res.status(201).json(createOrder);
    }

})

// @route       GET /api/orders/:id
// @desc        Get order by Id
// @access      Private

const getOrderById = asyncHandler(async (req, res) => {

    /* .populate() => it is similar to the left outer join in My Sql 
        it returns all the left table records with relevant right table records
    */
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
})

// @desc        Update order to paid
// @route       PUT /api/orders/:id/pay
// @access      Private

const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        //this comes from paypal
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }

        //after this the order need to be updated
        const updatedOrder = await order.save();

        //then give the response
        res.json(updatedOrder)

    } else {
        res.status(404);
        throw new Error('Order not found');
    }

})

// @desc        get logged in user orders
// @route       GET /api/orders/myorders
// @access      Private

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }); //find => we are getting more than one
    res.json(orders);
})

export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders
}
