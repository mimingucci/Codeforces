import { useEffect, useState } from "react"
import Search from "./Search"
import UserApi from "../../getApi/UserApi"
const SearchList=()=>{
   const [users, setUsers]=useState([])
   const location=window.location.href
   useEffect(()=>{
      const keyword=location.split('=')[1]
      UserApi.getResultBySearch(keyword).then(res=>{
        setUsers(res.data.content)
      })
   }, [])
   return (
    <div className="w-full h-auto">
        <div className="border-[2px] rounded-md border-solid mt-[15px] mr-5 border-gray-300 text-left p-3">
           {users.length>0 ? users?.map(user=>(<Search user={user}/>)) : 'Not Found'}
        </div>
    </div>
   )
}
export default SearchList