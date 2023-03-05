import { useState, useEffect } from "react";
import { parseCookies } from "nookies";
import baseURL from "@/helper/baseURL";

const User_Role = () => {

  const [users, setUsers] = useState([])
  const { Token } = parseCookies()

  const fetchUsers = async () => {
    const res = await fetch(`${baseURL}/api/user`, {
      headers: {
        "Content-type": "application/json",
        "authorization": `${Token}`
      },
    })

    const data = await res.json()
    console.log(data)
    if (data) {
      setUsers(data)
      return console.log("Fetch user role success!")
    }
    return console.log("Fetch user role failed!")
  }

  const handleRole = async(role,_id) => {
    const res = await fetch(`${baseURL}/api/user`, {
      method:"PUT",
      headers: {
        "Content-type": "application/json",
        "authorization": `${Token}`
      },
      body :JSON.stringify({
        _id,
        role
      })
    })

    const data = await res.json()
    // console.log(data)
    if (data) {
      // setUsers(data)
      const updatedUsers = users.map((user)=>{
        if((user.role!=data.role) && (user.email==data.email)){
          return data
        }
        else{
          return user
        }
      })
      setUsers(updatedUsers)
      return console.log("Fetch user role success!")
    }
    return console.log("Fetch user role failed!")
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="mt-5 p-5 border bg-gray-100 rounded">
      <div className="text-3xl m-3 font-bold">Users Role</div>
      <table class="table-fixed w-[550px] text-xl">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>User Role</th>
          </tr>
        </thead>
        <tbody>
          {
            Array.from(users).map((user,key) => {
              return (
                <tr key={key} className="text-center py-3">
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="hover:font-semibold" onClick={()=>{handleRole(user.role,user._id)}}>{user.role}</td>
                </tr>
              )
            })
          }


        </tbody>
      </table>
    </div>
  )
}

export default User_Role