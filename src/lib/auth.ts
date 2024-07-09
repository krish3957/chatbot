import { JwtPayload, verify } from 'jsonwebtoken';

export function verifyToken(token: string) {
    try {
        return verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch (e) {
        return null;
    }
}
