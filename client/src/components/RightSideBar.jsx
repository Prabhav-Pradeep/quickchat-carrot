import React, { useContext, useState, useEffect } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSideBar = () => {
  const  {selectedUser,messages} = useContext(ChatContext)
  const {logout, onlineUsers} = useContext(AuthContext)
  const [msgImages, setMsgImages] = useState([])

  //All images
  useEffect(()=>{
    setMsgImages(
      messages.filter(msg => msg.image).map(msg=>msg.image)
    )
  },[messages])
return selectedUser && (
    <div className='...'>
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-square rounded-full'/>
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2 text-white'>
  {onlineUsers.includes(selectedUser._id) ? (
    <p className='w-2 h-2 rounded-full bg-green-500'></p>
  ) : (
    <p className='w-2 h-2 rounded-full bg-red-500'></p>
  )}
  {selectedUser.fullName}
</h1>
<p className='px-10 mx-auto text-white'>{selectedUser.bio}</p>

      </div>

      <hr className='border-[#ffffff50] my-4'/>

      <div className='px-5 text-xs'>
        <button onClick={() => logout()}
        className='mt-5 mb-5 mx-auto block bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer'>
        Logout
      </button>
      </div>
    </div>
)
}

export default RightSideBar
