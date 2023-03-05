import { useEffect } from "react"

const AboutId = ({ post }) => {
    
    
    // console.log(post)
    return (
        <>
            <h1>{post.id}</h1>
            <h2>{post.title}</h2>
            <h2>{post.completed.toString()}</h2>
        </>
    )
}

export async function getStaticProps({ params }) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${params.aboutId}`)
    const post = await res.json()

    return {
        props: {
            post,
        },

        revalidate: 10,
    }
}

export async function getStaticPaths() {
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos/`)
    const posts = await res.json()

    const paths = posts.map((post) => {
        return {
            params: { aboutId: post.id.toString() }
        }
    })

    return { paths, fallback: false }
}

export default AboutId