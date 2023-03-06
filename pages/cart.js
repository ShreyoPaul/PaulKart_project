import { parseCookies } from "nookies"
import baseURL from "@/helper/baseURL"
import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import cookie from 'js-cookie';
import Link from "next/link";
import Image from "next/image";
import { RiDeleteBin5Fill } from 'react-icons/ri'
import StripeCheckout from 'react-stripe-checkout';
import cartLogo from "../public/cart.avif";


const cart = (props) => {
  const router = useRouter()

  let price = 0
  const [token, setToken] = useState(props.Token)
  // console.log(props)


  const [cProducts, setCProducts] = useState(props.products)

  if (cProducts) {
    Array.from(cProducts).forEach(item => {
      price = price + item.qty * item.product.price
    })
  }
  else{
    price=0
  }
  // console.log(price)


  if (!token) {
    toast(`Login is required!`, { hideProgressBar: true, autoClose: 3000, type: 'error' })
    return (
      <div className="flex flex-col justify-center items-center h-[435px]">
        <div className="text-2xl font-semibold">Login first to see your cart items!</div>
        <Link href={"/login"}>
          <button
            type="submit"
            className="w-full  text-center my-9 p-3 rounded bg-green hover:bg-green-dark focus:outline-none bg-black text-white "
          >Log in</button>
        </Link>
        <ToastContainer />
      </div>
    )
  }

  const deleteItem = async (pid) => {

    if (!token) {

      return toast(`Token expired!`, { hideProgressBar: true, autoClose: 3000, type: 'error' })
    }

    const { Token } = parseCookies()
    const res = await fetch(`${baseURL}/api/cart`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "authorization": `${Token}`
      },
      body: JSON.stringify({
        productId: pid
      })
    })

    const data = await res.json()
    console.log(data)

    if (data) {
      setCProducts(data)
      return toast(`Item is removed!`, { hideProgressBar: true, autoClose: 3000, type: 'success' })
    }
    else {
      return toast(`Error occure in api!`, { hideProgressBar: true, autoClose: 3000, type: 'error' })
    }
  }

  const handleCheckout = async (paymentInfo) => {
    console.log(paymentInfo)
    const { Token } = parseCookies()
    const res = await fetch(`${baseURL}/api/payment`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "authorization": `${Token}`
      },
      body: JSON.stringify({
        paymentInfo
      })
    })
    const data = await res.json()
    console.log(data)

    if (data) {
      // setCProducts(data)
      setCProducts([])
      return toast(`Checkout successful!`, { hideProgressBar: true, autoClose: 3000, type: 'success' })
    }
    else {
      return toast(`Error occure in API!`, { hideProgressBar: true, autoClose: 3000, type: 'error' })
    }

  }

  const Total = () => {
    return (
      <div className="w-[100%] text-xl flex justify-center flex-row items-center">
        <div className="flex flex-row m-5">
          Total = Rs. <span className="text-2xl font-semibold flex flex-row relative bottom-1"> {price}</span>
        </div>
        {
          price ?
            <StripeCheckout
              name="PaulKart"
              amount={price * 100}
              image={'../public/cart.avif'}
              currency="INR"
              shippingAddress={true}
              billingAddress={true}
              zipCode={true}
              stripeKey="pk_test_51MhRi4SBvqfxrsmoJWWMe6LIixFyJSH24JW4avedL6Z7XB8qVv72wtkP0fPLQWknoCRW2wu26q91ZxpCGS3hNJyP00T6R1weuj"
              token={(paymentInfo) => { handleCheckout(paymentInfo) }}
            >
              <button
                type="submit"
                className="flex justify-center  text-center my-9 p-3 rounded bg-green hover:bg-green-dark focus:outline-none bg-black text-white "
              >Check Out</button>
            </StripeCheckout>
            : <></>
        }
      </div>
    )
  }
console.log("1")
  if ( token) {
    // router.push('/login')
    // toast(`${error}`, { hideProgressBar: true, autoClose: 3000, type: 'error' })
    const CartItems = () => {
      useEffect(() => {
        const { Token } = parseCookies()
        console.log(Token)
        setToken(Token)
      }, [])

      if (cProducts.length > 0) {
        return (
          <div className="flex flex-row flex-wrap justify-center items-center ">
            {cProducts.map((item, id) => {

              return (
                <div key={id} className="w-[29%] flex flex-row border border-1 border-gray-400 rounded p-5 m-6 mt-[5%] justify-left items-center">
                  <Image className="w-[100px] h-[100px]" src={item.product.picUrl} alt="Item" width="200" height="200" />
                  <div className="w-[350px] flex flex-col px-6 justify-start text-left font-semibold">
                    <div className="text-2xl text-gray-500 py-2">
                      {item.product.name}
                    </div>
                    <div className="text-3xl text-black ">
                      {item.qty} x <span className="text-xl font-light">Rs.</span>{item.product.price}
                    </div>
                  </div>
                  <div
                    onClick={() => deleteItem(item.product._id)}
                    className="bg-red-500 text-white rounded hover:bg-red-600 flex items-end justify-end">
                    <RiDeleteBin5Fill className="p-2 text-4xl" />
                  </div>
                </div>
              )
            })}
          </div>
        )
      }
      else {
        return (
          <div className="w-full h-[435px] flex flex-col justify-center items-center">
            <div className="text-2xl font-semibold">Cart is empty! You should add some product to cart first.</div>
            <Link href={"/"}>
              <button
                type="submit"
                className="w-full  text-center my-9 p-3 rounded bg-green hover:bg-green-dark focus:outline-none bg-black text-white "
              >Add items to cart</button>
            </Link>
          </div>
        )
      }
    }
    return (
      <>
        <CartItems />
        <Total />
      </>
    )
  }
  else {
    router.push('/login')
    toast(`Something went wrong!`, { hideProgressBar: true, autoClose: 3000, type: 'error' })

    return (
      <>
        <ToastContainer />
      </>
    )

  }


}

export async function getServerSideProps(context) {
  const { Token } = parseCookies(context)

  if (!Token) {
    const { res } = context
    
    res.writeHead(302, { Location: "/signup" })
    res.end()
    return {
      props: { error: "You should login!" }
    }
  }

  // export async function getStaticProps(context) {
  //   const { Token } = parseCookies(context)

  //   if (!Token) {
  //     const { res } = context
  //     res.writeHead(300, { Location: "/login" })
  //     res.end()
  //     return {
  //       props: { error: "You should login!" }
  //     }
  //   }


  const res = await fetch(`${baseURL}/api/cart`, {
    headers: {
      "authorization": `${Token}`
    }
  })
  // console.log(await res.json())
  const {products} = await res.json()
  console.log(products)


  return {
    props: {
      products, Token
    }
  }
}


export default cart