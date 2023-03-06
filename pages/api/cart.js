import jwt from "jsonwebtoken"
import Carts from "@/mongoDB/models/cartSchema"
import mongoose from "mongoose";
import connectDB from "@/mongoDB/mongoConnection";

const { ObjectId } = mongoose.Schema.Types

connectDB()

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await getCart(req, res)
            break;
        case "PUT":
            await addToCart(req, res)
            break;
        case "DELETE":
            await removeProduct(req, res)
            break;
        default:
            break;
    }
}

//middleware
const authenticated = (comp) => {
    return (req, res) => {
        try {
            const { authorization } = req.headers
            if (!authorization) {
                return res.status(401).json({ error: "You need authorization" })
            }
            const cartInfo = jwt.verify(authorization, process.env.JWT_SECRET)
            req.userId = cartInfo.userId
            return comp(req, res)
        } catch (error) {
            console.log("ERROR :",error)
            return res.status(401).json({ error: "You should login!" })
        }
    }
}


const getCart = authenticated(async (req, res) => {
    try {
        // console.log("1")
        // const { authorization } = req.headers
        // if (!authorization) {
        //     return res.status(401).json({ error: "You need authorization" })
        // }
        // const  {userId} = jwt.verify(authorization,process.env.JWT_SECRET)

        // const cartInfo = jwt.verify(authorization, process.env.JWT_SECRET)
        // console.log(cartInfo)

        // console.log(req.userId)
        const cart = await Carts.find({ user: req.userId }).populate("products.product")
        if (cart) {
            // console.log("Cart[0].products : \n",cart[0].products)
            return res.status(201).json(cart[0])
        }
        else {
            return res.status(401).json({ error: "Failed to find cart items!" })
        }

    } catch (error) {
        console.log("ERROR:",error)
        return res.status(401).json({ error: "You should login!" })
    }
})

const addToCart = authenticated(async (req, res) => {
    try {
        const { qty, product_id } = req.body
        
        const cart = await Carts.find({ user: req.userId })
        

        if (cart) {
            // console.log("Cart product array : ",cart[0].products)
            let product_flag = 0
            product_flag = cart[0].products.some((pdoc) => {
                // console.log(pdoc)
                // console.log("pdoc : ",pdoc.product,"   product_id : ",product_id)
                return pdoc.product.toString() === product_id
            }) //if product is alraedy exist it retrun true else false
            // console.log("Product flag : ",product_flag)
            // console.log(product_id)
            // console.log("----->",cart[0].products[0])
            // console.log(mongoose.Types.ObjectId(product_id))

            if (product_flag) {
                const updatedCart = await Carts.updateOne(
                    { _id: cart[0]._id, "products.product": new mongoose.Types.ObjectId(product_id) },

                    // { _id: cart[0]._id },
                    {
                        $inc: { "products.$.qty": qty }
                    }
                )
                // console.log("Updated : ",updatedCart)

            } else {
                const newProduct = { qty, product: product_id }
                // console.log(newProduct)
                //pushing new product to products array
                const updatedCart = await Carts.findByIdAndUpdate(
                    { _id: cart[0]._id },
                    {
                        $push: { products: newProduct }
                    }
                )
                // console.log("Updated : ",updatedCart)
            }

            return res.status(201).json({ message: "Product is added to cart successfully!" })
        }
        else {
            return res.status(401).json({ error: "Failed to find cart items!" })
        }

    } catch (error) {
        console.log(error)
    }
})

const removeProduct = authenticated(async (req, res) => {
    const { productId } = req.body
    const updatedCart = await Carts.findOneAndUpdate(
        { user: req.userId },
        { $pull: { products: { product: new mongoose.Types.ObjectId(productId) } } },
        { new: true }
    ).populate("products.product")

    if(updatedCart){
        console.log("updataed cart :" ,updatedCart)
        res.status(200).json(updatedCart.products)
    }
    else{
        res.status(400).json({error : "Error occured in server while updating cart!"})
    }
})