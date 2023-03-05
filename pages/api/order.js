import jwt from "jsonwebtoken"
import connectDB from "@/mongoDB/mongoConnection";
import Orders from "@/mongoDB/models/orderSchema";

connectDB()

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
            console.log(error)
            return res.status(401).json({ error: "Something went wrong in middlewar!" })
        }
    }
}

const getOrder = authenticated(async (req, res) => {
    try {
        // console.log("REQusreid : ",req.userId)

        const orders = await Orders.find({ user: req.userId }).populate("products.product")
        // console.log(orders)
        return res.status(201).json({ orders })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ err: `ERROR in get order function! ${error}` })
    }
})

export default async (req, res) => {
    await getOrder(req, res)
}