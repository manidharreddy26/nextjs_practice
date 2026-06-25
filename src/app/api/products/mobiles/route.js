import MobileModel from "@/utils/models/mobiles";
import { NextResponse } from "next/server";
import { DBConnection } from "@/utils/config/db";
import mongoose from "mongoose";

const connectDB = async () => {
  await DBConnection();
};

export async function GET() {
  try {
    await connectDB();

    const mobiledata = await MobileModel.find({}).sort({ _id: -1 });

    return NextResponse.json({ mobiledata }, { status: 200 });
  } catch (error) {
    console.log("GET MOBILE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to get mobiles" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const { title, model, price, image } = await request.json();

    const cleanTitle = title?.trim();
    const cleanModel = model?.trim();
    const numericPrice = Number(price);

    if (!cleanTitle || !cleanModel || !price || !image) {
      return NextResponse.json(
        { message: "Title, model, price and image are required" },
        { status: 400 },
      );
    }

    if (cleanTitle.length < 2 || cleanTitle.length > 60) {
      return NextResponse.json(
        { message: "Mobile title must contain 2 to 60 characters" },
        { status: 400 },
      );
    }

    if (cleanModel.length < 2 || cleanModel.length > 60) {
      return NextResponse.json(
        { message: "Mobile model must contain 2 to 60 characters" },
        { status: 400 },
      );
    }

    if (
      Number.isNaN(numericPrice) ||
      numericPrice <= 0 ||
      numericPrice > 10000000
    ) {
      return NextResponse.json(
        { message: "Enter a valid mobile price" },
        { status: 400 },
      );
    }

    const existingMobile = await MobileModel.findOne({
      title: cleanTitle,
      model: cleanModel,
    });

    if (existingMobile) {
      return NextResponse.json(
        { message: "This mobile already exists" },
        { status: 409 },
      );
    }

    const newMobile = await MobileModel.create({
      title: cleanTitle,
      model: cleanModel,
      price: numericPrice,
      image,
    });

    return NextResponse.json(
      {
        message: "Mobile added successfully",
        mobile: newMobile,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("POST MOBILE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to add mobile" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    const mobileId = request.nextUrl.searchParams.get("id");

    if (!mobileId || !mongoose.Types.ObjectId.isValid(mobileId)) {
      return NextResponse.json(
        { message: "Valid mobile ID is required" },
        { status: 400 },
      );
    }

    const { newtitle, newmodel, newprice, newimage } = await request.json();

    const cleanTitle = newtitle?.trim();
    const cleanModel = newmodel?.trim();
    const numericPrice = Number(newprice);

    if (!cleanTitle || !cleanModel || !newprice) {
      return NextResponse.json(
        { message: "Title, model and price are required" },
        { status: 400 },
      );
    }

    if (
      cleanTitle.length < 2 ||
      cleanTitle.length > 60 ||
      cleanModel.length < 2 ||
      cleanModel.length > 60
    ) {
      return NextResponse.json(
        { message: "Title and model must contain 2 to 60 characters" },
        { status: 400 },
      );
    }

    if (
      Number.isNaN(numericPrice) ||
      numericPrice <= 0 ||
      numericPrice > 10000000
    ) {
      return NextResponse.json(
        { message: "Enter a valid mobile price" },
        { status: 400 },
      );
    }

    const duplicateMobile = await MobileModel.findOne({
      title: cleanTitle,
      model: cleanModel,
      _id: { $ne: mobileId },
    });

    if (duplicateMobile) {
      return NextResponse.json(
        { message: "Another mobile with this title and model already exists" },
        { status: 409 },
      );
    }

    const updateData = {
      title: cleanTitle,
      model: cleanModel,
      price: numericPrice,
    };

    // Keep the old image if no new image was selected
    if (newimage) {
      updateData.image = newimage;
    }

    const updatedMobile = await MobileModel.findByIdAndUpdate(
      mobileId,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedMobile) {
      return NextResponse.json(
        { message: "Mobile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Mobile updated successfully",
        mobile: updatedMobile,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("PUT MOBILE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update mobile" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const mobileId = request.nextUrl.searchParams.get("id");

    if (!mobileId || !mongoose.Types.ObjectId.isValid(mobileId)) {
      return NextResponse.json(
        { message: "Valid mobile ID is required" },
        { status: 400 },
      );
    }

    const deletedMobile = await MobileModel.findByIdAndDelete(mobileId);

    if (!deletedMobile) {
      return NextResponse.json(
        { message: "Mobile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Mobile deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("DELETE MOBILE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to delete mobile" },
      { status: 500 },
    );
  }
}
