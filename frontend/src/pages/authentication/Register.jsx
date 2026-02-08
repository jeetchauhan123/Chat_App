import React from 'react'

const Register = () => {
  return (
    <section className='w-screen h-screen bg-amber-50 flex flex-col justify-center items-center gap-4 relative'>
      <p className='absolute text-4xl top-5 left-6'>ChatApp</p>
      <div className='bg-white w-150 px-7 py-10 flex justify-center items-center gap-2 rounded-3xl border'>
        <img src="/lock.svg" alt="" className='text-lg w-8 h-8'/>
        <p className='text-lg'>Your messages are Safe and protected with us</p>
      </div>
      <div className='bg-white w-150 px-7 py-10 flex flex-col items-center gap-10 rounded-3xl border'>
        <section className='flex flex-col items-center gap-3'>
          <h2 className='text-5xl font-normal'>Welcome</h2>
          <p className='text-3xl'>Enter Your Email</p>
        </section>
        <section className='flex flex-col gap-5'>
          <input type="email" name="email" id="email" className='bg-gray-100 w-70 h-10 rounded-full text-center border'/>
          <button className='bg-amber-100 w-70 h-10 rounded-full text-lg'>Next</button>
        </section>
      </div>
      <p className='text-md'>
        <span>Already Have Account &nbsp;</span>
        <a href="" className='underline'>Login</a>
      </p>
      <p className='text-sm text-gray-500'>
        <a href="" className='hover:underline'>Terms and Conditions</a>
      </p>
    </section>
  )
}

export default Register