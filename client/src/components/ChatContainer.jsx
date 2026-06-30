import React, { useRef, useEffect, useCallback, useContext, useState } from 'react' // Added useEffect here
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage } = useContext(ChatContext)
  const { authUser, onlineUsers } = useContext(AuthContext)
  const scrollEnd = useRef()
  const  [input, setInput] = useState('');

  //Handle Sending
  const handleSendMessage = async (e)=> {
    e.preventDefault();
    if(input.trim() === "" ) return null;
    await sendMessage({text: input.trim()});
    setInput("")
  }

  //Handle Sending an image
  const handleSendImage = async(e) => {
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error("Select an Image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async ()=> {
      await sendMessage({image: reader.result})
      e.target.value = "";
    }
    reader.readAsDataURL(file);
  }



  useEffect(() => {
    if (scrollEnd.current && messages){
      // Changed "behaviour" to "behavior" (DOM API requires US spelling)
      scrollEnd.current.scrollIntoView({ behavior: "smooth" }) 
    }
  }, [messages])

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      {/* Header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full'/>
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id)}<span className={`w-2 h-2 rounded-full ${onlineUsers.includes(selectedUser._id) ? 'bg-green-500' : 'bg-red-500'}`}></span>
        </p>
        {/* Fixed md:hiden typo */}
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7'/>
        <img src={assets.help_icon} alt=""  className='max-md:hidden max-w-5'/>
      </div>

      {/* Chatbox */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}> 
            {msg.image ? (
              <img src={msg.image} alt="" className='max-w-[230px] border-gray-700 rounded-lg overflow-hidden mb-8'/>  
            ) : (
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none': 'rounded-bl-none'}`}>
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs"> 
              <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.av} alt=" " className='w-7 rounded-full'></img>
              <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

<div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
  {/* Input Container */}
  <div className="flex-1 flex items-center bg-white/10 px-4 rounded-full">
    
    {/* Text Input */}
    <input onChange={(e)=>setInput(e.target.value)} value = {input}
      onKeyDown = {(e)=> e.key === "Enter" ? handleSendMessage(e) : null}
      type="text" 
      placeholder="send a message" 
      className="flex-1 bg-transparent text-sm py-3 border-none outline-none text-white placeholder-gray-400"
    />
    
    {/* Gallery Button (Inside the pill, pushed to the right) */}
    <input 
      onChange={handleSendImage}
    type="file" id="image" accept="image/png, image/jpeg" hidden />
    <label htmlFor="image" className="cursor-pointer shrink-0 ml-2">
      <img src={assets.gallery_icon} alt="gallery" className="w-5" />
    </label>
    
  </div>

  {/* Send Button (Outside the pill, on the far right) */}
  <img 
    onClick={handleSendMessage}
    src={assets.send_button} 
    alt="send" 
    className="w-10 h-10 cursor-pointer shrink-0" 
  />
</div>

    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} className='max-w-16' alt=""></img>
      {/* Fixed text0lg typo */}
      <p className='text-lg font-medium text-white'> Chat Anytime, Anywhere</p>
    </div>
  )
}

export default ChatContainer