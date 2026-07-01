import Link from "next/link";

export const Header = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        backgroundColor: "red",
        width: "100%",
        height: "25px",
      }}
    >
      <Link href="./About">
        <div>About</div>
      </Link>
      <Link href="./Home">
        <div>Home</div>
      </Link>
      <Link href="./login">
        <div>login</div>
      </Link>
      <Link href="./Register">
        <div>Register</div>
      </Link>
    </div>
  );
};
