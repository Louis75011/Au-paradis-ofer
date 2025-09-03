export const runtime = "edge"

// import { getRequestContext } from "@cloudflare/next-on-pages";
// import type Stripe from "stripe";

// export async function POST(req: Request) {
//   const { env } = getRequestContext();

//   const body = await req.json() as Stripe.Event;

//   // Exemple : récupérer un Checkout Session
//   if (body.type === "checkout.session.completed") {
//     const session = body.data.object as Stripe.Checkout.Session;

//     const dateISO = session.metadata?.dateISO;
//     if (dateISO) {
//       await env.BOOKINGS_KV.put(
//         `booking:${dateISO}`,
//         JSON.stringify({ dateISO, status: "reserved", title: "Réservé (Stripe)" })
//       );
//     }
//   }

//   return new Response("ok", { status: 200 });
// }
