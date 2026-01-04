
import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"


// import {PrismaClient} from "@/lib/generated/prisma";
// const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, fieldToUpdate, value } = body;

  try {

    // Construct update object
    const updateData: any = {
      email: body.email,
      password: body.password,
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    if (fieldToUpdate) {
      updateData[fieldToUpdate] = value; // dynamic field update
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("API Update Error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}