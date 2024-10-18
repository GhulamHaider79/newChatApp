"use client"

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { auth, signInWithEmailAndPassword } from "@/firebase/firebaseConfig";
import { useState } from 'react';


function page() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const route = useRouter();

  function handleSubmit (e) {
    e.preventDefault();
    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    
    const user = userCredential.user;

    localStorage.setItem('loginUser', user.uid); // Use user.uid instead of user.id
    console.log('Logged in user ID:', user.uid);

    setLoading(false)
     
     
    if(user){
      route.push('/usersChat')
    }
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });




  }


  return (
    <div className='flex h-screen items-center justify-center'>
      <form onSubmit={handleSubmit} className='w-[350px] bg-gray-300 p-8 flex flex-col gap-8 items-center rounded-lg '>
        <div>
          <h2 className='text-3xl font-bold'>Login</h2>
        </div>
        <div className='flex flex-col gap-4 '>

          <div className='flex flex-col '>
            <label htmlFor="email">Email</label>
            <input onChange={(e) => setEmail(e.target.value)} className='w-[18rem] p-2 rounded-md hover:bg-gray-100' type="email" id='email' />
          </div>

          <div className='flex flex-col  '>
            <label htmlFor="password">Password</label>
            <input onChange={(e) => setPassword(e.target.value)} className='w-[18rem] p-2 rounded-md hover:bg-gray-100' type="password" id='password' />
          </div>
        </div>

       {loading ? (<div>Loading...</div>) : ( <button type='submit' className="w-32 p-3  font-bold rounded-md bg-green-300 hover:bg-green-500 ">Submit</button>)}

        <p>If you have not account go <Link className='font-bold' href={'./sigUp'}>Signup</Link> </p>



      </form>
    </div>
  )
}

export default page