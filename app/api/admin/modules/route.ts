import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function GET() {

  try {
    const data = await prisma.module.findMany();

    if (!data) {
      return NextResponse.json({ error: "Modules not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching module:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const newModule = await prisma.module.create({
      data: {
        module: body.module,
        name: body.name,
        title: body.title,
        description: body.description,
        icon: body.icon,
        order: body.order,
        introVideo: body.introVideo,
        unlocked: body.unlocked,
        completed: body.completed,
        sections: body.sections,        // ✅ no map, just raw array
        preTest: body.preTest,          // ✅ raw object
        postTest: body.postTest,        // ✅ raw object
        updatedAt: new Date(),
      },
    });

    const newModuleSummary = await prisma.moduleSummary.create({
      data: {
        title: body.title,
        name: body.module,
        shortTitle: body.title.split(" ")[0],
        description: body.description,
        icon: body.icon,
        order: body.order,
        introVideo: body.introVideo,
        unlocked: true,
        completed: false,
        upDatedAt: new Date(),
      },
    });

    return NextResponse.json({newModule, newModuleSummary});
  } catch (error: any) {
    console.error("❌ POST failed:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Module ID is required" }, { status: 400 });
    }

    await prisma.module.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete module error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
