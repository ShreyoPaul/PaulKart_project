import products from '../../../mongoDB/models/schema'

export default async (req, res) => {

    switch (req.method) {
        case "GET":
            await getProduct(req, res)
            break;
        case "DELETE":
            await deleteProduct(req, res)
            break;
        default:
            break;
    }


}

const getProduct = async (req, res) => {
    try {
        const { pid } = req.query
        const product = await products.findById({ _id: pid })
        if (product) {
            return res.status(200).send(product)
        }
        else return res.status(400).send("Error occured!")
    } catch (error) {

        return res.status(400).send("Error occured!")
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.query
        const product = await products.deleteOne({ _id: pid })
        return res.status(200).send("Product deleted!")
        
    } catch (error) {

        return res.status(400).send("Error occured!")
    }
}