import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import baseURL from '@/helper/baseURL'

const inter = Inter({ subsets: ['latin'] })

export default function Home({ products }) {

  return (
    <div className='container flex justify-center flex-col items-center p-6'>
      <h1 className="text-Gray-500 text-5xl font-semibold m-5 underline">Welcome to PaulKart</h1>
      <div className='flex flex-wrap flex-row justify-center items-center'>
        {
          products.map((data) => {
            
            return (
              <Link href={`${baseURL}/products/${data._id}`} className="max-w-[26%] rounded overflow-hidden shadow-lg m-6 justify-center items-center">
                <Image className="h-[300px] w-[300px]" src={data.picUrl} width="300" height="300" alt={data.name} />
                <div className="px-8 py-4">
                  <div className=" text-xl mb-1">{data.name}</div>
                  Rs <span className="font-bold text-3xl mb-2">{data.price}/-</span>
                </div>
                <div className="px-6 pt-4 pb-2">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
                </div>
              </Link>
            )
          })
        }
      </div>
    </div>
  )
}

// export async function getStaticProps(context) {
//   const res = await fetch(`${baseURL}/api/products`)
//   const data = await res.json()
//   // console.log(data)
//   return {
//     // Passed to the page component as props
//     props: { products: data },
//   }
// }

export async function getServerSideProps(context) {
  const res = await fetch(`${baseURL}/api/products`)
  const data = await res.json()
  // console.log(data)
  return {
    // Passed to the page component as props
    props: { products: data },
  }
}
