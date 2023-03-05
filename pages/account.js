import { parseCookies } from "nookies"
import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import baseURL from "@/helper/baseURL";
import { useState } from "react";
import User_Role from "@/components/User_Role";
const account = ({ data, user }) => {

  const [orders, setOrders] = useState(data.orders)
  // console.log(user.role)
  const orderHistory = async (data) => {
    const { Token } = parseCookies()
    if (!Token) {
      return toast(`Token expired!`, { hideProgressBar: true, autoClose: 3000, type: 'error' })
    }
    // console.log(data.orders[0])
  }

  orderHistory(data)


  return (
    <div className="p-6  flex flex-row justify-center items-start">
      <div className="flex justify-center items-start flex-col bg-gray-100 text-xl border rounded p-4 m-8">
        <div>
          Name : {user.name}
        </div>
        <div>
          Email : {user.email}
        </div>
      </div>
      {
        <div id="flex-2 ml-[6%] w-[600px]">
          <div className="text-3xl py-3 font-bold">Order History :</div>
          {
            orders.length ?
              orders.map((item, index) => {

                return (
                  <div key={index} className="border rounded p-4 my-2 w-[450px]">

                    <div className="text-xl  ">Total : Rs. <span className="font-semibold text-2xl px-1">{item.total}</span><hr className="w-[33%]" /></div>

                    {
                      item.products.map((pitem, key) => {
                        // if(pitem.product) console.log(pitem.product)
                        console.log(pitem.product)
                        return (
                          <div key={key} className="text-md ">
                            <span className=" text-xl px-1">{pitem.product.name}</span>(Rs. <span className="font-semibold text-xl px-1">{pitem.product.price}</span>) x {pitem.qty}
                          </div>
                        )
                      })
                    }
                  </div>
                )
              })
              :
              <div className="text-xl text-gray-500">
                You have no order history
              </div>
          }
          {user.role === "Author" && <User_Role />}

        </div>

      }


      <ToastContainer />

    </div>
  )
}

export async function getServerSideProps(context) {
  const { Token } = parseCookies(context)
  const cookie = parseCookies(context)
  const user = cookie.user_details ? JSON.parse(cookie.user_details) : ""
  if (!Token) {
    const { res } = context
    res.writeHead(302, { Location: "/login" })
    res.end()
  }

  const res = await fetch(`${baseURL}/api/order`, {
    headers: {
      "Content-type": "application/json",
      "authorization": `${Token}`
    }
  })

  const data = await res.json()
  // console.log(data,)

  return {
    props: { data, user }
  }
}

export default account