import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { problemName, code, pattern } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    const patternLabel = pattern || "unknown";

    const prompt = `
You are an experienced coding interview mentor.
A candidate is working on the following problem:

Problem: ${problemName || "Unknown problem"}
Pattern: ${patternLabel}

Here is their solution code:

\`\`\`
${code}
\`\`\`

1. Identify the most likely algorithmic pattern being used.
2. Point out any logical issues or edge cases the code might fail on.
3. Comment on time and space complexity.
4. Give 2 or 3 clear suggestions to improve the solution or explanation.

Be concise but specific. Assume the candidate is smart but still learning patterns.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a strict but helpful coding interview mentor." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const feedback =
      completion.choices[0]?.message?.content?.trim() ||
      "No feedback generated.";

    return NextResponse.json({ feedback });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
