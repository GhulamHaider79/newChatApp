import Link from "next/link";


export default function Home() {
  return (
   <div className=" bg-gray-100  ">
       <div className="flex flex-col justify-center items-center gap-4 h-screen">
       <Link href={`/signUp`}>
       <button type="button" className="w-32 p-3  font-bold rounded-md bg-green-300 hover:bg-green-500 ">Get Starded</button>
       </Link>
        <p>
          Here You will find real world chat experience!
        </p>
       </div>
   </div>
  );
}
