import LaptopDiscount from "./laptopDiscount";

export const metadata = {
  title: "Laptop Page",
  description: "Best Laptop In Recent Times",
};

export default function LaptopLayout({ children }) {
  return (
    <div align="center">
      <LaptopDiscount />
      {children}
    </div>
  );
}
