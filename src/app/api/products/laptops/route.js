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
      { status: 500 }
    );
  }
}

// POST: Add laptop
export async function POST(request) {
  try {
    await connectDB();

    const { title, model, price } = await request.json();

    const cleanTitle = title?.trim();
    const cleanModel = model?.trim();
    const numericPrice = Number(price);

    if (!cleanTitle || !cleanModel || !price) {
      return NextResponse.json(
        { message: "Title, model and price are required" },
        { status: 400 }
      );
    }

    if (cleanTitle.length < 2) {
      return NextResponse.json(
        { message: "Laptop title must contain at least 2 characters" },
        { status: 400 }
      );
    }

    if (cleanModel.length < 2) {
      return NextResponse.json(
        { message: "Laptop model must contain at least 2 characters" },
        { status: 400 }
      );
    }

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json(
        { message: "Laptop price must be greater than 0" },
        { status: 400 }
      );
    }

    const existingLaptop = await LaptopModel.findOne({
      title: cleanTitle,
      model: cleanModel,
    });

    if (existingLaptop) {
      return NextResponse.json(
        { message: "This laptop already exists" },
        { status: 409 }
      );
    }

    const newLaptop = await LaptopModel.create({
      title: cleanTitle,
      model: cleanModel,
      price: numericPrice,
    });

    return NextResponse.json(
      {
        message: "Laptop added successfully",
        laptop: newLaptop,
      },
      { status: 201 }
    );
  } catch (error) {
    // MongoDB duplicate-key error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Laptop title or model already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Failed to add laptop" },
      { status: 500 }
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
        { status: 400 }
      );
    }

    const body = await request.json();

    const cleanTitle = body.newtitle?.trim();
    const cleanModel = body.newmodel?.trim();
    const numericPrice = Number(body.newprice);

    if (!cleanTitle || !cleanModel || !body.newprice) {
      return NextResponse.json(
        { message: "Title, model and price are required" },
        { status: 400 }
      );
    }

    if (cleanTitle.length < 2 || cleanModel.length < 2) {
      return NextResponse.json(
        { message: "Title and model must contain at least 2 characters" },
        { status: 400 }
      );
    }

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json(
        { message: "Laptop price must be greater than 0" },
        { status: 400 }
      );
    }

    const updatedLaptop = await LaptopModel.findByIdAndUpdate(
      laptopId,
      {
        title: cleanTitle,
        model: cleanModel,
        price: numericPrice,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedLaptop) {
      return NextResponse.json(
        { message: "Laptop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Laptop updated successfully",
        laptop: updatedLaptop,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Laptop title or model already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Failed to update laptop" },
      { status: 500 }
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
        { status: 400 }
      );
    }

    const deletedLaptop = await LaptopModel.findByIdAndDelete(laptopId);

    if (!deletedLaptop) {
      return NextResponse.json(
        { message: "Laptop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Laptop deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete laptop" },
      { status: 500 }
    );
  }
}