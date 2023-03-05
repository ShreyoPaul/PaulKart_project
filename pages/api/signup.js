import connectDB from "../../mongoDB/mongoConnection"
import Users from "@/mongoDB/models/userSchema"
import Carts from "@/mongoDB/models/cartSchema"
import bcrypt from 'bcryptjs'

connectDB()

export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            await postUser(req, res)
            break;
        default:
            break;
    }
}

const postUser = async (req,res) => {
    try {
        const { name, role, pass, c_pass, email } = req.body
        console.log(role)
        if (pass !== c_pass) {
            return res.status(400).json({ error: "Confirm your password properly" })
        }
        else if (!name || !email || !pass || !c_pass ) {
            return res.status(422).json({ error: "Please add all field" })
        }
        const user = await Users.findOne({ email })
        if (user) {
            console.log(user)
            return res.status(422).json({ error: "User already exist eith this email id" })
        }

        //password hashing
        const hashed_pass = await bcrypt.hash(pass, 12)
        const addedUser = await new Users({
            name,
            role,
            pass: hashed_pass,
            email
        }).save()

        //creating cart database while user signed up
        const cartCreate = await new Carts({user: addedUser._id}).save()


        return res.status(201).json({ message: "User added successfully!" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server error!" })
    }
}