import React from 'react'
import { useLocation } from "react-router-dom";
import Sidebar from '../Components/Sidebar'

const Chat = () => {
  const location = useLocation();
  const user = location.state?.user;
  // console.log(user)
  return (
    <section className='h-screen p-5'>
      <Sidebar user={user}/>
    </section>
  )
}

export default Chat