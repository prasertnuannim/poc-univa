import { NextRequest, NextResponse } from "next/server"
import { createExam } from "@/server/services/exam.service"
import { createExamSchema } from "@/server/schemas/create-exam.schema"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = createExamSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const exam = await createExam(parsed.data)
    return NextResponse.json(exam, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
