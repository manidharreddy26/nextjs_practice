import LaptopModel from "@/utils/models/laptops";
import { NextResponse } from "next/server";
import { DBConnection } from "@/utils/config/db";
import mongoose from "mongoose";

const connectDB = async () => {
  await DBConnection();
};

// GET: Get all laptops
export async function GET() {
  try {
    await connectDB();

    const laptopdata = await LaptopModel.find({}).sort({ _id: -1 });

    return NextResponse.json({ laptopdata }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to get laptops" },
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

    if (cleanTitle.length < 2 || cleanModel.length < 2) {
      return NextResponse.json(
        { message: "Title and model must contain at least 2 characters" },
        { status: 400 },
      );
    }

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json(
        { message: "Laptop price must be greater than 0" },
        { status: 400 },
      );
    }

    const existingLaptop = await LaptopModel.findOne({
      title: cleanTitle,
      model: cleanModel,
    });

    if (existingLaptop) {
      return NextResponse.json(
        { message: "This laptop already exists" },
        { status: 409 },
      );
    }

    const newLaptop = await LaptopModel.create({
      title: cleanTitle,
      model: cleanModel,
      price: numericPrice,
      image,
    });

    return NextResponse.json(
      {
        message: "Laptop added successfully",
        laptop: newLaptop,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("POST LAPTOP ERROR:", error);

    return NextResponse.json(
      { message: "Failed to add laptop" },
      { status: 500 },
    );
  }
}

// PUT: Update laptop by id
export async function PUT(request) {
  try {
    await connectDB();

    const laptopId = request.nextUrl.searchParams.get("id");

    if (!laptopId || !mongoose.Types.ObjectId.isValid(laptopId)) {
      return NextResponse.json(
        { message: "Valid laptop ID is required" },
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

    if (cleanTitle.length < 2 || cleanModel.length < 2) {
      return NextResponse.json(
        { message: "Title and model must contain at least 2 characters" },
        { status: 400 },
      );
    }

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json(
        { message: "Laptop price must be greater than 0" },
        { status: 400 },
      );
    }

    const updateData = {
      title: cleanTitle,
      model: cleanModel,
      price: numericPrice,
    };

    // Update image only when a new image was selected
    if (newimage) {
      updateData.image = newimage;
    }

    const updatedLaptop = await LaptopModel.findByIdAndUpdate(
      laptopId,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedLaptop) {
      return NextResponse.json(
        { message: "Laptop not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Laptop updated successfully",
        laptop: updatedLaptop,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("PUT LAPTOP ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update laptop" },
      { status: 500 },
    );
  }
}

// DELETE: Delete laptop by id
export async function DELETE(request) {
  try {
    await connectDB();

    const laptopId = request.nextUrl.searchParams.get("id");

    if (!laptopId || !mongoose.Types.ObjectId.isValid(laptopId)) {
      return NextResponse.json(
        { message: "Valid laptop ID is required" },
        { status: 400 },
      );
    }

    const deletedLaptop = await LaptopModel.findByIdAndDelete(laptopId);

    if (!deletedLaptop) {
      return NextResponse.json(
        { message: "Laptop not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Laptop deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete laptop" },
      { status: 500 },
    );
  }
}
