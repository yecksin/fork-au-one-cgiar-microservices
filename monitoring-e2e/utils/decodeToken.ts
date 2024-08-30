export const decode = (token: string): DecodedToken => {
  return { ...decodeJwtPayload(token), token };
};

const decodeJwtPayload = (token: string): DecodedJwtPayload => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('JWT not valid');
  }

  const payloadBase64 = base64UrlToBase64(parts[1]);
  const decodedPayload = atob(payloadBase64);
  return JSON.parse(decodedPayload);
};

const base64UrlToBase64 = (input: string): string => {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return base64;
};

interface DecodedToken extends DecodedJwtPayload {
  token: string;
}

interface DecodedJwtPayload {
  login: string;
  sub: number;
  permissions: string[];
  iat: number;
  exp: number;
}
