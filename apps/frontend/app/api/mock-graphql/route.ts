import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(req: Request) {
  // On lit la requête juste pour rester conforme à GraphQL,
  // mais on renvoie une réponse fixe minimale.
  const body = await req.json().catch(() => ({}));

  // Exemple : simuler la mutation requestBooking
  const data = {
    requestBooking: {
      id: "mock-1",
      status: "RECEIVED"
    }
  };

  return NextResponse.json({ data });
}
