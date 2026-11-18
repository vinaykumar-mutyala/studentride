import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "Healthy",
    application: "StudentRide",
    message: "Backend API is running successfully",
    timestamp: new Date().toISOString(),
  });
}