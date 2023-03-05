import connectDB from "../../mongoDB/mongoConnection"
import Users from "@/mongoDB/models/userSchema"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

connectDB()

export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            await getUser(req, res)
            break;
        default:
            break;
    }
}

const getUser = async (req, res) => {
    try {
        const { pass, email } = req.body

        if (!email || !pass) {
            return res.status(422).json({ error: "Please add all field" })
        }
        const user = await Users.findOne({ email })

        if(!user){
            return res.status(404).json({ error: "Email or password Unautherized!" })
        }

        if (await bcrypt.compare(pass, user.pass) && user) {
            //jwt token generating
            const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{
                expiresIn:"7d"
            })
            const {name,role,email} = user
            return res.status(201).json({ message: "User added successfully!",token, user: {name,role,email} })
        }
        else{
            return res.status(401).json({ error: "Email or password Unautherized!" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server error!" })
    }
}