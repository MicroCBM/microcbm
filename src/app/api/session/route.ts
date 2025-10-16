import { NextResponse } from "next/server";
import { getUserSession } from "../../../libs/session";

export async function GET() {
  try {
    const session = await getUserSession();

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: session.user });
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

