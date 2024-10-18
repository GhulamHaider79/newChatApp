'use client'
import Link from 'next/link'
import { 
   auth,
   db, 
  createUserWithEmailAndPassword,
  collection, 
  addDoc
 } from '@/firebase/firebaseConfig'
import { useState } from 'react';
import { useRouter } from 'next/navigation';


function SignupPage() {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [userName, setUserName] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const route = useRouter();



function handleSubmit(e) {
   e.preventDefault()
   setLoading(true)
createUserWithEmailAndPassword(auth, email, password)
  .then(async(userCredential) => {

    const user = userCredential.user;
    
   try {
    const docRef = await addDoc(collection(db, "users"), {
      name: userName,
      email,
      userId: user.uid,
    });
    localStorage.setItem('loginUser', user.uid); // Use user.uid instead of user.id
   
    setLoading(false)

    if(user){
      route.push('/usersChat')
    }

   } catch (error) {
    console.error("user Write Error:", error); 
    setErrorMessage(error.message);
    setLoading(false);
   }
    
  })
  .catch((error) => {
    console.error("Firestore Write Error:", error); 
    setErrorMessage(error.message);
    setLoading(false);
  });
}




  return (
    <div className='flex h-screen items-center justify-center'>
      <form onSubmit={handleSubmit} className='w-[350px] bg-gray-300 p-8 flex flex-col gap-8 items-center rounded-lg '>
        <div>
          <h2 className='text-3xl font-bold'>Signup</h2>
        </div>
        <div className='flex flex-col gap-4 '>

          <div className='flex flex-col '>
            <label htmlFor="name">Name</label>
            <input onChange={((e)=> setUserName(e.target.value))} className='w-[18rem] p-2 rounded-md hover:bg-gray-100' type="text" id='name' />
          </div>

          <div className='flex flex-col '>
            <label htmlFor="email">Email</label>
            <input onChange={((e)=> setEmail(e.target.value))} className='w-[18rem] p-2 rounded-md hover:bg-gray-100' type="email" id='email' />
          </div>

          <div className='flex flex-col  '>
            <label htmlFor="password">Password</label>
            <input onChange={((e)=> setPassword(e.target.value))} className='w-[18rem] p-2 rounded-md hover:bg-gray-100' type="password" id='password' />
          </div>
        </div>

        {loading ? (<div>Loading..</div>) : (<button type='submit' className="w-32 p-3  font-bold rounded-md bg-green-300 hover:bg-green-500 ">Submit</button>)}

        <p>If already have account go <Link className='font-bold' href={'./signin'}>Login</Link> </p>



      </form>
    </div>
  )
}

export default SignupPage;