import { NextResponse } from "next/server";
import { generateReading } from "@/lib/groq";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateReadingRequest } from "@/lib/validate-reading-request";

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || "local-dev";
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.ok) {
      return NextResponse.json(
        {
          error: "请求过于频繁，请稍等一分钟后再试。",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
            ),
          },
        },
      );
    }

    const payload = await request.json();
    const input = validateReadingRequest(payload);
    const reading = await generateReading(input);

    return NextResponse.json(reading, {
      headers: {
        "X-RateLimit-Remaining": String(rateLimit.remaining),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "生成解读时发生未知错误。";

    const status =
      message.includes("请求体") ||
      message.includes("不能为空") ||
      message.includes("格式不正确")
        ? 400
        : message.includes("频繁")
          ? 429
        : message.includes("GROQ_API_KEY")
          ? 500
          : 502;

    return NextResponse.json({ error: message }, { status });
  }
}
