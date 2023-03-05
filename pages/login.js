import Link from 'next/link'
import { useState } from 'react'
import baseURL from '@/helper/baseURL'
import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import cookie from 'js-cookie';

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState()
  const [pass, setPass] = useState()

  const submitForm = async (e) => {
    try {
      e.preventDefault()
      const res = await fetch(`${baseURL}/api/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          email, pass
        })
      })
      const data = await res.json()
      if (data.error) {
        return toast(`${data.error}`, { hideProgressBar: true, autoClose: 3000, type: 'error' })
      } else {
        cookie.set("Token",data.token)
        cookie.set("user_role",data.user.role)
        cookie.set('user_details',JSON.stringify(data.user))
        // console.log(data.user)
        toast(`${data.message}`, { hideProgressBar: true, autoClose: 3000, type: 'success' })
      }
      // console.log(data)
      router.push("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (

    <form onSubmit={(e) =>submitForm(e)} className="bg-grey-lighter min-h-screen flex flex-col" method='POST'>
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Log in </h1>

          <input
            autoComplete='off'
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="email"
            placeholder="Email" />

          <input
            autoComplete='off'
            value={pass}
            onChange={(e) => { setPass(e.target.value) }}
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="password"
            placeholder="Password" />

          <button
            type="submit"
            className="w-full text-center py-3 rounded bg-green hover:bg-green-dark focus:outline-none my-1 bg-black text-white "
          >Log in</button>

          <div className="text-center text-sm text-grey-dark mt-4">
            By logging in, you agree to the
            <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
              Terms of Service
            </a> and
            <a className="no-underline border-b border-grey-dark text-grey-dark px-1" href="#">
              Privacy Policy
            </a>
          </div>
        </div>

        <div className="text-grey-dark mt-6">
          Don't have account?
          <Link className="no-underline border-b border-blue text-blue" href="/signup">
            Sign up
          </Link>.
        </div>
      </div>
      <ToastContainer />
    </form>
  )
}

export default Login