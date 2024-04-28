"use client"

import SpinLoader from "@/components/common/spinLoader"
import axios from "@/lib/axios"
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

function ProfilePage() {

    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState({})
    useEffect(() => {
        fetchUserProfile();
    }, [])

    const fetchUserProfile = async () => {
        setLoading(true)

        try {
            const { data } = await axios.get(`/users/${session?.user.userId}/`, {
                headers: {
                    Authorization: `Bearer ${session?.user.access_token}`
                }
            })
            console.log(data)
            setUser(data)
        } catch (error) {

        }finally{
            setLoading(false)
        }

    }

    if(loading){
        return <SpinLoader />
    }
    return (
        <div className="container mx-auto p-4">
        <div className="bg-white dark:bg-graydark shadow-md rounded-lg overflow-hidden w-full max-w-lg">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">User Details</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="text-gray-600 dark:text-gray-400">First Name:</div>
              <div>{user.first_name}</div>
              <div className="text-gray-600 dark:text-gray-400">Last Name:</div>
              <div>{user.last_name}</div>
              <div className="text-gray-600 dark:text-gray-400">Email:</div>
              <div>{user.email_id}</div>
              <div className="text-gray-600 dark:text-gray-400">Phone Number:</div>
              <div>{user.phone_number}</div>
              <div className="text-gray-600 dark:text-gray-400">Country:</div>
              <div>{user.country}</div>
              <div className="text-gray-600 dark:text-gray-400">State:</div>
              <div>{user.state}</div>
              <div className="text-gray-600 dark:text-gray-400">City:</div>
              <div>{user.city}</div>
              {/* Add more fields as needed */}
            </div>
          </div>
        </div>
      </div>
    )
}

export default ProfilePage