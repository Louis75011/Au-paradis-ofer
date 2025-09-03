export const runtime = "edge";
import { NextResponse } from "next/server";
import tarifs from "@/data/tarifs.json";
export function GET() { return NextResponse.json(tarifs); }