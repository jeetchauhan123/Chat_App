import React from 'react'
import ChatNav from './ChatNav'

const ChatPanel = (user) => {
    console.log("userpanel",user);
  return (
    <div className='h-full w-full bg-[#2f2f2f] rounded-2xl'>
        <ChatNav user={user.user}/>
    </div>
  )
}

export default ChatPanel