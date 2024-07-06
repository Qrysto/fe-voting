import { type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'secret';

export async function GET(request: NextRequest) {
  const body = await request.json();
  const jwToken: string = body?.jwToken;

  try {
    const decoded: any = jwt.verify(jwToken, jwtSecret);
    const phoneNumber = decoded.phoneNumber;
    return Response.json({ ok: true, token: jwToken, phoneNumber });
  } catch (err: any) {
    return Response.json(
      { message: err?.message, error: err },
      { status: 401 }
    );
  }
}
