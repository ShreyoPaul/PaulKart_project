import Link from 'next/link'
import { useState } from 'react'
import baseURL from '@/helper/baseURL'
import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";


const Signup = () => {
  const router = useRouter()
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [pass, setPass] = useState()
  const [c_pass, setC_pass] = useState()
  const [role, setRole] = useState()

  const submitForm = async (e) => {
    try {
      e.preventDefault()
      const res = await fetch(`${baseURL}/api/signup`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          name, email, pass, c_pass, role
        })
      })
      const data = await res.json()
      if (data.error) {
        return toast(`${data.error}`, { hideProgressBar: true, autoClose: 3000, type: 'error' })
    }else{
        toast(`${data.message}`, { hideProgressBar: true, autoClose: 3000, type: 'success' })
    }
    console.log(data)
    router.push("/")
    } catch (error) {
      console.log(error)
    }

  }

  return (

    <form onSubmit={submitForm} className="bg-grey-lighter min-h-screen flex flex-col" method='POST'>
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Sign up</h1>
          <input
            autoComplete='off'
            value={name}
            onChange={(e) => { setName(e.target.value) }}
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="fullname"
            placeholder="Full Name" />

          <input
            autoComplete='off'
            value={role}
            onChange={(e) => { setRole(e.target.value) }}
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="fullname"
            placeholder="User/ Seller" />

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
          <input
            autoComplete='off'
            value={c_pass}
            onChange={(e) => { setC_pass(e.target.value) }}
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="confirm_password"
            placeholder="Confirm Password" />

          <button
            type="submit"
            className="w-full text-center py-3 rounded bg-green hover:bg-green-dark focus:outline-none my-1 bg-black text-white "
          >Create Account</button>

          <div className="text-center text-sm text-grey-dark mt-4">
            By signing up, you agree to the
            <a className=" no-underline border-b border-grey-dark text-grey-dark" href="#">
              Terms of Service
            </a> and
            <a className="no-underline border-b border-grey-dark text-grey-dark  px-1" href="#">
              Privacy Policy
            </a>
          </div>
        </div>

        <div className="text-grey-dark mt-6">
          Already have an account?
          <Link className="no-underline border-b border-blue text-blue" href="/login">
            Log in
          </Link>.
        </div>
      </div>
      <ToastContainer />
    </form>
  )
}

export default Signup