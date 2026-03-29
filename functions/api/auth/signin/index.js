export async function onRequest(context) {
  // Your Supabase auth logic or redirect
  return new Response('Auth endpoint', { status: 200 });
}
