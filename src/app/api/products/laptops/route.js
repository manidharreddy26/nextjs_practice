import LaptopModel from "@/utils/models/laptops";
import { NextResponse } from "next/server";
import { DBConnection } from "@/utils/config/db";

const connectDB = async () => {
  await DBConnection();
};
connectDB();

export async function GET() {
  const laptopdata = await LaptopModel.find({});
  return NextResponse.json({ laptopdata });
}

export async function POST(request) {
  const { title, model, price } = await request.json();
  await LaptopModel.create({ title, model, price });
  return NextResponse.json({ success: "laptop is added" });
}

export async function PUT(request) {
  const laptopId = await request.nextUrl.searchParams.get("id");
  const {
    newtitle: title,
    newmodel: model,
    newprice: price,
  } = await request.json();

  await LaptopModel.findByIdAndUpdate(laptopId, { title, model, price });

  return NextResponse.json({ mgs: "Laptop is updated" });
}

export async function DELETE(request) {
  const laptopId = await request.nextUrl.searchParams.get("id");
  await LaptopModel.findByIdAndDelete(laptopId);
  return NextResponse.json({
    msg: "Laptop is Deleted",
  });
}
