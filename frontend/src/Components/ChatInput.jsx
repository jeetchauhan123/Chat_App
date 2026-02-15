import React from 'react'

const ChatInput = () => {
  return (
    <div className='h-20 flex flex-row items-center '>
        <button className='w-12 h-12 flex items-center justify-center text-3xl font-semibold bg-gray-500 rounded-[100%]'>
            <span className='text-center flex items-center justify-center'>+</span>
        </button>
        <input type="text" name="message" id="message" className='h-12 px-4 bg-gray-500 rounded-full'/>
        <button>
            <img src="/send.png" alt="send" className='h-10 w-10'/>
        </button>
    </div>
  )
}

export default ChatInput