import Image from "next/image"
import { useRouter } from "next/router"
import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { parseCookies } from "nookies"
import { useEffect } from "react";
import baseURL from "@/helper/baseURL"
import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const PoductPage = ({ product }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false);
    const cancelButtonRef = useRef(null);
    const [qty, setQty] = useState();

    const onDeleteProduct = () => {
        setOpen(!open)
    }

    const deleteProduct = async () => {
        try {
            const res = await fetch(`${baseURL}/api/products/${product._id}`, {
                method: "DELETE"
            })
            router.push("/")
        } catch (error) {
            console.log(error)
        }
    }

    if (router.isFallback) {
        return (
            <>
                <div className="text-5xl">Loading</div>
            </>
        )
    }

    let [dltBTN, setDltBTN] = useState(false)

    useEffect(() => {
        const { user_role } = parseCookies()

        if (user_role === "Seller") {
            setDltBTN(true)
        }
        else {
            setDltBTN(false)
        }

    }, [parseCookies()])

    const addToCart = async () => {
        try {
            const { Token } = parseCookies()
            if (!Token) {
                return toast(`Login first!`, { hideProgressBar: true, autoClose: 3000, type: 'error' })
                // router.push('/login')
            }
            


            const res = await fetch(`${baseURL}/api/cart`, {
                method: "PUT",
                headers: {
                    "Content-type": "Application/json",
                    "authorization": `${Token}`
                },
                body: JSON.stringify({
                    qty,
                    product_id: product._id
                })
            })

            console.log("Res", res)
            const data = await res.json()
            if (data) {
                return toast(`${data.message}`, { hideProgressBar: true, autoClose: 1000, type: 'success' })
            }
            return toast(`${data.error}`, { hideProgressBar: true, autoClose: 3000, type: 'error' })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex flex-col w-[1235px]">
            <div className=' flex flex-row container mx-[5%] my-[4%]'>
                <div className=' justify-center items-center' >
                    <Image className="h-[400px] w-[400px]" src={product.picUrl} width="400" height="400" alt="pic" />
                </div>
                <div className='flex-1 justify-center items-center ml-8 px-3'>
                    <div className="py-5">
                        <span className="text-3xl text-gray-500 ">{product.name}</span>
                    </div>
                    <div className="p-3">Rs.
                        <span className="text-5xl font-bold text-black  ">{product.price}/-</span>
                    </div>
                    <div className="py-5">
                        <span className="text-xl text-black ">{product.desc}</span>
                    </div>
                    <div>
                        <input onChange={(e) => { setQty(e.target.value) }} className="border-gray-400 border rounded px-3 p-2" placeholder="Quantity" type="number" value={qty} />
                        <button onClick={addToCart} className="font-semibold bg-yellow-400 px-3 p-2 m-3 rounded hover:bg-yellow-500">Add to Cart</button>
                    </div>
                </div>

            </div>

            {
                dltBTN &&
                <div className="flex justify-center items-center mb-5">
                    <button onClick={onDeleteProduct} className=" w-[20%] font-semibold hover:bg-red-700  bg-red-600 px-3 p-2 m-3 rounded text-white">Delete</button>
                </div>
            }

            {/* //--------------------------------------------------------------------------- */}
            <Transition.Root show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    onClose={setOpen}
                >
                    <div
                        className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block
         sm:p-0"
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div
                                className="inline-block align-bottom bg-white rounded-lg
               text-left 
            overflow-hidden shadow-xl 
            transform transition-all 
            sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                            >
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div
                                            className="mx-auto flex-shrink-0 flex items-center
                   justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0
                    sm:h-10 sm:w-10"
                                        >
                                            {/* <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" /> */}
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                Are you sure to delete the product ?
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Are you sure you want to delete your product? All the product data will be
                                                    permanently removed. This action cannot be undone later.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md
                   border border-transparent shadow-sm px-4 py-2 bg-red-600
                    text-base font-medium text-white hover:bg-red-700 
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                     focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => {
                                            setOpen(false)
                                            deleteProduct()
                                        }}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center
                  rounded-md border border-gray-300 shadow-sm px-4 py-2
                   bg-white text-base font-medium text-gray-700
                    hover:bg-gray-50 focus:outline-none focus:ring-2
                     focus:ring-offset-2 focus:ring-red-500 sm:mt-0
                      sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setOpen(!open)}
                                        ref={cancelButtonRef}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <ToastContainer />
        </div>
    )
}

export async function getServerSideProps({params:{pid}}){
    const res = fetch(`http://localhost:3000/api/products/${pid}`)
    const data = await (await res).json()
    return {
        props:{product : data}
    }
}

export async function getStaticProps({ params: { pid } }) {
    const res = await fetch(`${baseURL}/api/products/${pid}`)
    const data = await res.json()
    return {
        props: { product: data }
    }
}

export async function getStaticPaths() {
    const res = await fetch(`${baseURL}/api/products`)
    const data = await res.json()
    const paths = data.map((product) => ({
        params: { pid: product._id }
    }))
    return {
        paths, fallback: true
    }
}

export default PoductPage