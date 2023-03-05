import Link from "next/link"
// import { useEffect } from "react"

const about = ({ data }) => {


  //testing useEffect --->>>>>>>>>>>>>>>>>>>
  // const test = async () => {
  //   const res = await fetch(`https://jsonplaceholder.typicode.com/todos/`)
  //   const post = await res.json()
  //   console.log(post)
  // }

  // useEffect(() => {
  //   console.log("About page")
  //   test()

  // }, [])

  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <ul>
        {data.slice(0, 10).map((data) => (
          <Link href={`/about/${data.id}`}><li key={data.id}>{data.title}</li></Link>
        ))}
      </ul>
    </>
  )
}

export async function getStaticProps(context) {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/')
  const data = await res.json()
  // console.log(data)
  return {
    // Passed to the page component as props
    props: { data },
  }
}

export default about