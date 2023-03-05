import connectDB from "../../mongoDB/mongoConnection"
import Product from "@/mongoDB/models/schema"

connectDB()

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      await getAllProducts(req, res)
      break;
    case "POST":
      await postProduct(req, res)
      break;
    default:
      break;
  }

}

const getAllProducts = async (req, res) => {
  try {
    await Product.find().then(products => {
      return res.status(200).json(products)
    })
  } catch (error) {
    console.log(error)
    return res.status(200).json({error:`${error}`})
  }
}

const postProduct = async (req, res) => {
  // console.log(req.body)
  const { title, price, desc, media } = req.body
  if (!title || !price || !desc || !media) {
    return res.status(422).json({ error: "Please add all field" })
  }
  const result = await new Product({
    name: title,
    price,
    desc,
    picUrl: media
  }).save()
  return res.status(201).json(result)
}
