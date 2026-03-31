import { NextResponse } from "next/server";
import { generateReading } from "@/lib/groq";
import { validateReadingRequest } from "@/lib/validate-reading-request";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = validateReadingRequest(payload);
    const reading = await generateReading(input);

    return NextResponse.json(reading);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "生成解读时发生未知错误。";

    const status =
      message.includes("请求体") ||
      message.includes("不能为空") ||
      message.includes("格式不正确")
        ? 400
        : message.includes("GROQ_API_KEY")
          ? 500
          : 502;

    return NextResponse.json({ error: message }, { status });
  }
}
