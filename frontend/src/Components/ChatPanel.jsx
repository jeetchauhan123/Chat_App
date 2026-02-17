import React from 'react'
import ChatNav from './ChatNav'
import MessageSection from './MessageSection';

const ChatPanel = (user) => {
    console.log("userpanel",user);
  return (
    <div className=' w-full flex flex-col bg-[#272727] rounded-2xl'>
        <ChatNav user={user.user}/>
        <MessageSection />
    </div>
  )
}

export default ChatPanel