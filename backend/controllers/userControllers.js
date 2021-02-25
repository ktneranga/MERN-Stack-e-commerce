import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js'

//@route        POST api/users
//@desc         auth user and log in
//@access       public => submit user details -> authenticate-> get the token

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    //check whether the plain text pw and the encrypted pw is match
    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } else {
        res.status(401) //Unauthorized
        throw new Error('Invalid Email or Password');
    }

    //authorization is having the access of certain API of the system

})

// @route       POST /api/users
// @desc        Register a user
// @access      Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email: email });

    if (userExists) {
        res.status(400); //bad request
        throw new Error('User already exists');
    }

    const user = await User.create({
        //create method is another way to .save()
        name: name,
        email: email,
        password: password
        //we can do the hashing pw in the userController it self
    })


    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        }) //something created
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

})

// @route       GET /api/users/profile
// @desc        get user profile
// @access      Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id) // this returns logged in users details
    /* 
    That is why we pass word 'profile' from ProfileScreen, because we need logged in users details
    */

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(404);
        throw new Error('User not found')
    }
})

// @route       PUT /api/users/profile
// @desc        update user profile
// @access      private

const updateUserProfile = asyncHandler(async (req, res) => {
    //we get req.user from protect middleware
    // using that req.user._id we can access all informatiom of the user using the User modle
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }
    }

    const updatedUser = await user.save(); //this returns a promise of saved user details

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id)
    })

})

//@desc         delete a user
//@route        DELETE /api/users/:id
//@access       Private/admin

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    //check if the user is exist
    if (user) {
        await user.remove();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }

})

//@desc        get all users
//@route        GET /api/users
//@access       Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
})

//@desc     get user by ID
//@route    GET /api/users/:id
//@access   Private/Admin

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password'); //return user without the password

    if (user) {
        res.json(user)
    } else {
        res.status(404);
        throw new Error('User not found');
    }
})

// @desc        Update user by id  
// @route       PUT /api/users/:id  
// @access      Private/ admin

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })

    }else{
        res.status(404);
        throw new Error('User not found');
    }

})

export {
    authUser,
    getUserProfile,
    registerUser,
    updateUserProfile,
    getAllUsers,
    deleteUser,
    getUserById,
    updateUser
}

