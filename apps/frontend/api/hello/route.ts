export const runtime = 'edge';

export async function GET() {
  return new Response(JSON.stringify({ message: 'Bonjour depuis Next.js API' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// à tester https://APO/api/hello

// // app/api/contact/route.ts
// export async function POST(request: Request) {
//   const data = await request.json();
//   // traitement...
//   return new Response(`Message reçu : ${data.message}`, { status: 200 });
// }