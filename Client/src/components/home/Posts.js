import { useEffect, useState } from 'react'
import PostApi from '../../getApi/PostApi'
import Post from './Post'
const Posts=()=>{
    const [posts, setPosts]=useState([])
    useEffect(()=>{
        PostApi.getAllPosts().then(res=>{
            setPosts(res.data)
        })
    }, [])
    return <div>
        {posts && posts.map(post=><Post post={post}/>)}
    </div>
}
export default Posts