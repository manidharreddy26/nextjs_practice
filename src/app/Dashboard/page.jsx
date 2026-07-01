"use client";

import { useRouter } from "next/navigation";

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  return (
    <div
      align="center"
      style={{ backgroundColor: "pink", height: "50px", color: "white" }}
    >
      <h1>Welcome to Dsahboard</h1>
      <button onClick={() => router.back()}>Go Back</button>
    </div>
  );
};
export default page;
