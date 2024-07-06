import { type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'secret';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const jwtToken = searchParams.get('token');

  if (!jwtToken) {
    return Response.json({ message: 'JWT token missing' }, { status: 400 });
  }

  try {
    const decoded: any = jwt.verify(jwtToken, jwtSecret);
    const phoneNumber = decoded.phoneNumber;
    return Response.json({ ok: true, token: jwtToken, phoneNumber });
  } catch (err: any) {
    return Response.json(
      { message: err?.message, error: err },
      { status: 401 }
    );
  }
}
