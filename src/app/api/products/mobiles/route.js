import MobileModel from "@/utils/models/mobiles";
import { NextResponse } from "next/server";
import { DBConnection } from "@/utils/config/db";

const connectDB = async () => {
  await DBConnection();
};
connectDB();

export async function GET() {
  const mobiledata = await MobileModel.find({});
  return NextResponse.json({ mobiledata });
}

export async function POST(request) {
  const { title, model, price } = await request.json();
  await MobileModel.create({ title, model, price });
  return NextResponse.json({ Success: "Mobile Added" });
}

export async function PUT(request) {
  const mobileId = await request.nextUrl.searchParams.get("id");
  const {
    newtitle: title,
    newmodel: model,
    newprice: price,
  } = await request.json();

  await MobileModel.findByIdAndUpdate(mobileId, { title, model, price });

  return NextResponse.json({ mgs: "Mobile is updated" });
}

export async function DELETE(request) {
  const mobileId = await request.nextUrl.searchParams.get("id");
  await MobileModel.findByIdAndDelete(mobileId);
  return NextResponse.json({
    msg: "Mobile is Deleted",
  });
}
