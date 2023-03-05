import Image from "next/image"
import { useState } from "react"
import baseURL from "@/helper/baseURL"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { parseCookies } from "nookies"

const create = () => {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [price, setPrice] = useState("")
    const [media, setMedia] = useState("")

    const uploadImg = async () => {
        try {
            const formData = new FormData()
            formData.append("file", media)
            formData.append("upload_preset", "my_store")
            formData.append("cloud_name", "dvsmetmxh")
            const d = await fetch('https://api.cloudinary.com/v1_1/dvsmetmxh/image/upload', {
                method: "POST",
                body: formData
            })
            const data = await d.json()
            console.log(data)
            return data.url
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            const mediaUrl = await uploadImg()
            const res = await fetch(`${baseURL}/api/products`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    price,
                    desc,
                    media: mediaUrl
                })
            })
            const data = await res.json()
            if (data.error) {
                toast(`${data.error}`, { hideProgressBar: true, autoClose: 3000, type: 'error' })
            }else{
                toast(`Product is successfully added!`, { hideProgressBar: true, autoClose: 3000, type: 'success' })
            }
            // console.log(data)
            router.push("/")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="w-[100%] flex justify-center">
            <form onSubmit={(e) => { handleSubmit(e) }} className="flex flex-col justify-center items-left max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-700 m-8 ">

                <div className="relative mb-12" data-te-input-wrapper-init>
                    Title
                    <input
                        value={title}
                        onChange={(e) => { setTitle(e.target.value) }}
                        autoComplete="off"
                        type="text"
                        className="peer mt-3 block min-h-[auto] w-full rounded border bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="Enter email" />

                    <small
                        id="emailHelp"
                        className="absolute w-full text-neutral-500 dark:text-neutral-200"
                        data-te-input-helper-ref
                    >Title only will be shown among all products</small>
                </div>
                <div className="relative mb-6" data-te-input-wrapper-init>
                    Price
                    <input
                        value={price}
                        onChange={(e) => { setPrice(e.target.value) }}
                        autoComplete="off"
                        type="number"
                        className="peer  mt-3 border block min-h-[auto] w-full rounded bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                        id="exampleInputPassword1"
                        placeholder="" />

                </div>
                <div className="relative mb-6" data-te-input-wrapper-init>
                    Description
                    <textarea
                        value={desc}
                        onChange={(e) => { setDesc(e.target.value) }}
                        autoComplete="off"
                        style={{ resize: "none" }}
                        rows="2"
                        cols="3"
                        type="text"
                        className="peer  mt-3 border block min-h-[auto] w-full rounded bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                        id="exampleInputPassword1"
                        placeholder="" />

                </div>
                <div className="relative mb-6 flex  flex-col">
                    {
                        media ? <Image className="" width="200" height="200" alt="" src={media ? URL.createObjectURL(media) : ""} /> : <></>
                    }
                    <label
                        htmlFor="formFile"
                        className="mb-2  inline-block text-neutral-700 dark:text-neutral-200"
                    >Insert picture of product</label>
                    <input
                        // value={media}
                        onChange={(e) => { setMedia(e.target.files[0]) }}
                        accept="image/*"
                        className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-neutral-700 outline-none transition duration-300 ease-in-out file:-mx-3 file:-my-1.5 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-1.5 file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[margin-inline-end:0.75rem] file:[border-inline-end-width:1px] hover:file:bg-neutral-200 focus:border-primary focus:bg-white focus:text-neutral-700 focus:shadow-[0_0_0_1px] focus:shadow-primary focus:outline-none dark:bg-transparent dark:text-neutral-200 dark:focus:bg-transparent"
                        type="file"
                        id="formFile" />
                </div>
                <button
                    type="submit"
                    className="bg-black  rounded bg-primary px-6 py-3.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
                    data-te-ripple-init
                    data-te-ripple-color="light">
                    Submit
                </button>
            </form>
            <ToastContainer />
        </div>
    )
}

export async function getServerSideProps(context){
    // console.log(context)
    const cookie = parseCookies(context)
    const {user_role} = parseCookies(context)
    console.log(user_role)

    if(user_role!="Seller"){
        const {res} = context
        console.log("-------------")
        res.writeHead(302,{Location:"/"})
        res.end()
    }
    return {
        props : {}
    }
}


export default create