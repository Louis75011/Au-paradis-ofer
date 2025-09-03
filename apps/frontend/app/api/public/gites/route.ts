import { NextResponse } from "next/server";
import gites from "@/data/gites.json";
export const runtime = "edge";
export function GET() { return NextResponse.json(gites); }
