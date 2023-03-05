import Stripe from "stripe";
import { v4 as uuidV4 } from "uuid";
import jwt from "jsonwebtoken"
import Carts from "@/mongoDB/models/cartSchema"
import Orders from "@/mongoDB/models/orderSchema";
import connectDB from "@/mongoDB/mongoConnection";

connectDB()
const stripe = Stripe(process.env.STRIPE)

export default async (req, res) => {
    const { paymentInfo } = req.body
    try {
        const { authorization } = req.headers
        if (!authorization) {
            return res.status(401).json({ error: "You need authorization" })
        }
        const cartInfo = jwt.verify(authorization, process.env.JWT_SECRET)
        // req.userId = cartInfo.userId
        console.log(cartInfo)
        const cart = await Carts.find({ user: cartInfo.userId }).populate("products.product")

        console.log(cart)
        let price = 0
        cart[0].products.forEach(item => { price += (item.qty * item.product.price) })

        const prevCustomer = await stripe.customers.list({
            email: paymentInfo.email
        })
        // console.log("prevCustomer--->\n",prevCustomer)

        const existingCustomer = prevCustomer.data.length > 0

        console.log("existingCustomer--->\n",existingCustomer)

        let newCustomerId
        if (!existingCustomer) {
            const newCustomer = await stripe.customers.create({
                email: paymentInfo.email,
                source: paymentInfo.id
            })
            newCustomerId = newCustomer.id
        }



        const charge = await stripe.paymentIntents.create({
            currency: "INR",
            amount: price * 100,
            receipt_email: paymentInfo.email,
            customer: existingCustomer ? prevCustomer.data[0].id : newCustomerId,
            description: `Your purchased is successful!`
        }, {
            idempotencyKey: uuidV4()
        })

        const order = await Orders({
            user : cartInfo.userId,
            email: paymentInfo.email,
            total : price,
            products: cart[0].products
        }).save()

        const emptyCart = await Carts.findOneAndUpdate(
            {_id:cart[0]._id},
            {$set: {products: []}}
        )

        return res.status(200).json({ message: "Payment  successful!" })

    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: "Error processing in payment!" })
    }
}