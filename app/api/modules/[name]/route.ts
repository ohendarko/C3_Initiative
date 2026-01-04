import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_req: Request, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params; // ✅ await the params

  try {
    const data = await prisma.module.findUnique({
      where: {
        module: name, // "module-1", etc.
      },
    });

    if (!data) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching module:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
