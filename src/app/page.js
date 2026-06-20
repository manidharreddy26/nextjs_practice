// const page = () => {
//   return (
//     <div>
//       <h1>My First Next.js Project</h1>

//     </div>
//   );
// };

"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

import React from "react";

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [user, setuser] = useState(true)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  console.log(router);

  const userhandler = () => {
    if (user) router.push('./Dashboard')
    else router.push('./loginpage')
  };

  return (
    <div align="center">
      <h1 style={{ color: "red" }}>Welcome To Next Js</h1>
      <button onClick={userhandler}>Login</button>
    </div>
  );
};

export default page;
