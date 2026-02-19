import React from 'react'

const ChatInput = () => {
  return (
    // <div className='h-20 flex flex-row items-center justify-between align-bottom'>
    //     <button className='w-12 h-12 flex items-center justify-center text-3xl font-semibold bg-gray-500 rounded-[100%]'>
    //         <span className='text-center flex items-center justify-center'>+</span>
    //     </button>
    //     <input type="text" name="message" id="message" className='h-12 px-4 bg-gray-500 rounded-full'/>
    //     <button>
    //         <img src="/send.png" alt="send" className='h-10 w-10'/>
    //     </button>
    // </div>

    <div className="h-20 w-full px-4 flex items-center gap-4 bg-[#434343] rounded-b-2xl ">
      <button className="w-12 h-12 flex items-center justify-center text-5xl font-normal bg-gray-500 rounded-full leading-none">
        <span className='leading-none relative -top-[4px]'>+</span>
      </button>

      <input
        type="text"
        className="flex-1 h-12 px-4 bg-gray-500 rounded-full outline-none"
        placeholder="Type a message"
      />

      <button className='h-12 w-12 rounded-full hover:bg-[#5c5c5c] flex items-center justify-center transition'>
        <img src="/send.png" alt="send" className="h-7 w-7" />
      </button>
    </div>
  )
}

export default ChatInput