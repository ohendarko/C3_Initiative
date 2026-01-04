import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust if you use a different import
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options"; // if using NextAuth for protection

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
        sections: {
          create: body.sections.map((section: any) => ({
            title: section.title,
            order: section.order,
            learningCards: {
              create: section.learningCards.map((card: any) => ({
                title: card.title,
                content: card.content,
              })),
            },
          })),
        },
        postTest: {
          create: body.postTest.map((q: any) => ({
            question: q.question,
            options: q.options,
            correct: q.correct,
          })),
        },
        preTest: {
          create: body.preTest ? body.preTest.map((q: any) => ({
            question: q.question,
            options: q.options,
            correct: q.correct,
          })) : [],
        },
      },
      include: {
        Section: true,
      },
    });

    return NextResponse.json(newModule);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

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
