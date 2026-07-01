import { DBConnection } from "@/utils/config/db";
import { NextResponse } from "next/server";

const connectDB = async () => {
  await DBConnection();
};
connectDB();

export async function GET() {
  return NextResponse.json({ student: "All Student Data" });
}
 