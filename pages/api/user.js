import Users from "@/mongoDB/models/userSchema";
import jwt from "jsonwebtoken";


export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await getUsers(req, res)
            break;
        case "PUT":
            await changeRole(req, res)
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
            console.log(error)
            return res.status(401).json({ error: "You should login!" })
        }
    }
}

const changeRole = authenticated(async (req, res) => {
    try {
        const {_id,role} = req.body
        const newRole = role=== "User" ? "Seller" : "User"
        const users = await Users.findOneAndUpdate({ _id},{role:newRole},{new:true}).select("-password")
        // console.log("Fetched data : \n", users)
        if (users) {
            return res.status(201).json(users)
        }
        return res.status(400).json({ error: "Can't fetch data" })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: "Can't fetch data" })
    }
})

const getUsers = authenticated(async (req, res) => {
    try {
        const users = await Users.find({ _id: { $ne: req.userId } }).select("-password")
        console.log("Fetched data : \n", users)
        if (users) {
            return res.status(201).json(users)
        }
        return res.status(400).json({ error: "Can't fetch data" })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: "Can't fetch data" })
    }
})