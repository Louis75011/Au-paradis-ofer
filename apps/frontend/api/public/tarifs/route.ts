import { NextResponse } from "next/server";
import tarifs from "@/data/tarifs.json";
export const runtime = "edge";
export function GET() { return NextResponse.json(tarifs); }