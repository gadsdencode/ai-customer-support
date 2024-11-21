import useAuth from '@/app/contexts/useAuth';
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase/client'

interface UserData {
  id: string
  email: string
  full_name: string
  avatar_url: string
}

const UserProfile = () => {
  const { user } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching user data:', error)
        } else {
          setUserData(data)
        }
      }
    }

    fetchUserData()
  }, [user])

  if (!userData) {
    return <div>Loading user data...</div>
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="space-y-2">
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Full Name:</strong> {userData.full_name}</p>
        <p><strong>User ID:</strong> {userData.id}</p>
        {userData.avatar_url && (
          <img 
            src={userData.avatar_url} 
            alt="User Avatar" 
            className="w-20 h-20 rounded-full"
          />
        )}
      </div>
    </div>
  )
}

export default UserProfile