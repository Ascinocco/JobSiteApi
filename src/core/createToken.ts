import jwt from 'jsonwebtoken';

export default function createToken(secret) {
  return (id, email) => {
    const signInfo = { id, email, createdAt: Date.now() };
    const algoInfo = { algorithm: 'HS256', expiresIn: "1h" };
    return jwt.sign(signInfo, secret, algoInfo);
  }
}