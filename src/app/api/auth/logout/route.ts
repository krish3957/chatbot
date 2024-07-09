import { cookies } from "next/headers";

export async function POST(req: Request) {
    cookies().delete('Set-Cookie');
    return Response.json({ message: 'Logged out' });
}