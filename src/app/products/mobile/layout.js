import MobileDiscount from "./MobileDiscount";

export const metadata = {
  title: "Mobile Page",
  description: "Best Mobiles In Recent Times",
};

export default function mobileLayout({ children }) {
  return (
    <div align="center">
      <MobileDiscount />
      {children}
    </div>
  );
}
