import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();

    // Example: Check for required fields before saving
    const requiredFields = [
      "age",
      "relationshipStatus",
      "religion",
      "programOfStudy",
      "yearOfStudy",
      "sexuallyActive",
      "familyHistoryCancer",
      "cervicalCancerEducation",
      "papSmearTest",
      "hpvVaccine",
    ];

    const missingFields = requiredFields.filter(
      (field) => !data[field] || data[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: "Missing required fields", missingFields },
        { status: 400 }
      );
    }

    // Save questionnaire data to the DB
    const response = await prisma.questionnaire.create({
      data: {
        age: data.age,
        gender: data.gender,
        relationshipStatus: data.relationshipStatus,
        relationshipOther: data.relationshipOther,
        religion: data.religion,
        religionOther: data.religionOther,
        programOfStudy: data.programOfStudy,
        yearOfStudy: data.yearOfStudy,
        sexuallyActive: data.sexuallyActive,
        familyHistoryCancer: data.familyHistoryCancer,
        cancerType: data.cancerType,
        cervicalCancerEducation: data.cervicalCancerEducation,
        papSmearTest: data.papSmearTest,
        hpvVaccine: data.hpvVaccine,
        userEmail: session.user.email,
        user: {
          connect: { email: session.user.email },
        },
      },
    });


    return NextResponse.json({ success: true, response }, { status: 201 });
  } catch (error) {
    console.error("[QUESTIONNAIRE_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong submitting questionnaire" },
      { status: 500 }
    );
  }
}
