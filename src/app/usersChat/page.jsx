'use client'
import  { useEffect, useState } from 'react';
import {
  auth, 
  collection, 
  getDocs, 
  db, 
  signOut,
  onAuthStateChanged, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  getDoc } from "@/firebase/firebaseConfig";
import Image from 'next/image';

import { useRouter } from 'next/navigation';

import userImage from '@/public/corporate-user-icon.webp'


function chatPage() {

  const [userList, setUserList] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const route = useRouter();

  // Get all users from the database
  useEffect(() => {
    const getUser = async () => {
      const response = await getDocs(collection(db, "users"));
      const userData = response.docs.map(doc => ({ id: doc.id, ...doc.data() }));
     
      
      setUserList(userData);
    };
    getUser();
  }, []);

  // Get logged-in user
  useEffect(() => {
    const loginUser = onAuthStateChanged(auth, async (user) => {
      const userIdLocal = localStorage.getItem("loginUser");
     
      if (user) {
        try {
          const response = await getDocs(collection(db, "users"));
          const userData = response.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const userDoc = userData.find((docs) => {
            if (docs.userId === userIdLocal) {
              return  docs.id
            }
          })
          if (userDoc) {
              setLoggedInUser({
              id: user.uid,
              name: userDoc.name || "Anonymous",
              email: user.email,
              photoURL: userDoc.photoURL || null,
            });
          }
          setChatMessages([]);
        } catch (error) {
          console.error("Error fetching logged-in user data:", error);
        }
      } else {
        setLoggedInUser({
          id: null,
          name: "Anonymous",
          email: null,
          photoURL: null,
        });

        setChatMessages([]);
      }

    });

    return () => loginUser();
  }, []);

  // Fetch chat messages between the logged-in user and the selected user
  const fetchChatMessages = async (userId1, userId2) => {
    const chatQuery = query(
      collection(db, "chats"),
      where("participants", "array-contains", userId1)
    );

    const usersChats = onSnapshot(chatQuery, (snapshot) => {
      const messages = snapshot.docs
        .map(doc => doc.data())
        .filter(chat => chat.participants.includes(userId2))
        .sort((a, b) => a.timestamp - b.timestamp);
      
      setChatMessages(messages);
    });

    return () => usersChats();
  };

  // Handle user selection for chatting
  function handleUserChat(user) {
    setSelectedUser(user);
    fetchChatMessages(loggedInUser?.id, user.id);
  }

  // Send a new message
  const sendMessage = async () => {
    if (newMessage.trim() === "" || !selectedUser) return;

    await addDoc(collection(db, "chats"), {
      senderId: loggedInUser?.id,
      receiverId: selectedUser.id,
      message: newMessage,
      timestamp: new Date(),
      participants: [loggedInUser?.id, selectedUser.id],
    });

    setNewMessage("");
  };

// SignOut 

function logout(params) {
  signOut(auth).then(() => {
    route.push('/')
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}

  return (
    <div className="bg-gray-100 flex  justify-between px-4">
      <div className="w-[30%] border border-gray-400 flex flex-col gap-4 border-r-4 overflow-y-scroll border-l-0 border-b-0 border-t-0 p-3">
       {userList?.map((user, index) =>{
        return <div onClick={() => handleUserChat(user)}  key={user.id} className='flex items-end gap-1 '>
             <Image
                src={userImage} 
                alt={user.name}
                width={48} 
                height={48} 
                className="rounded-full"
              />
             <p className='hover:bg-gray-300 w-[20rem] cursor-pointer flex items-center font-bold transition duration-200 p-1 px-1 rounded-sm'>{user.name}</p>
           </div>
       })}
      </div>


       {/* Chat Section */}
       <div className="w-[40%] border border-gray-400 flex flex-col gap-4 p-3">
        <h2 className="text-xl font-bold mb-4">Your Chat with {selectedUser?.name || "..."}</h2>
        <div className="flex-grow h-[400px] overflow-y-scroll border p-2">
          {selectedUser ? (
            chatMessages.map((msg, idx) => (
              <div key={idx} className={`p-2 rounded-md mb-2 ${msg.senderId === loggedInUser?.id ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
                <p>{msg.message}</p>
              </div>
            ))
          ) : (
            <p>Select a user to start chatting.</p>
          )}
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            className="border p-2 w-full rounded-l-md"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-r-md">Send</button>
        </div>
      </div>



      <div>
        <div>
        <p>{loggedInUser?.name}</p>
        
        </div>
        <button onClick={logout} className="w-32 p-3  font-bold rounded-md bg-green-300 hover:bg-green-500 ">Logout</button>
      </div>



     </div>
  )
}

export default chatPage