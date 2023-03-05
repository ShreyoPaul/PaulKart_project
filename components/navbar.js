import Link from "next/link"
import { parseCookies } from "nookies"
import cookie from "js-cookie"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const Navbar = () => {
    const router = useRouter()

    let [user, setUser] = useState(false)
    let [create, setCreate] = useState(false)
    useEffect(() => {
        const cookie = parseCookies()
        const { user_role } = parseCookies()

        if (cookie.Token) {
            setUser(true)
        }
        else {
            setUser(false)
        }

        if(user_role==="Seller" || user_role==="Author"){
            setCreate(true)
        }
        else{
            setCreate(false)
        }
    }, [parseCookies()])

    return (
        <>
            <div className=" w-[100%] flex p-8 py-4 justify-start items-center bg-black text-white ">
                <div className="flex-1 text-4xl font-bold justify-center items-center">PaulKart</div>
                <div className="flex-1 text-4xl font-bold">
                    <ui className='flex flex-row list-none justify-end'>
                        <li className="font-semibold text-xl px-5 justify-center items-center"><Link href="/">Home</Link></li>
                        {user && create &&
                            <li className="font-semibold text-xl px-5 justify-center items-center"><Link href="/create">Create</Link></li>
                        }
                        {
                            user ?
                                <>
                                    <li className="font-semibold text-xl px-5 justify-center items-center"><Link href="/account">Account</Link></li>
                                    <li className="font-semibold text-xl px-5 justify-center items-center"><Link href="/cart">cart</Link></li>
                                    <li onClick={() => {
                                        cookie.remove("Token")
                                        cookie.remove("user_role")
                                        router.push("/login")
                                    }}
                                        className="cursor-pointer font-semibold text-xl px-5 justify-center items-center">
                                        logout
                                    </li>
                                </>
                                :
                                <>
                                    <li className="font-semibold text-xl px-5 justify-center items-center"><Link href="/signup">Sign up</Link></li>
                                    <li className="font-semibold text-xl px-5 justify-center items-center"><Link href="/login">Login</Link></li>
                                    <li className="font-semibold text-xl px-5 justify-center items-center"><Link href="/about">About</Link></li>
                                </>
                        }
                    </ui>
                </div>
            </div>
        </>
    )
}

export default Navbar