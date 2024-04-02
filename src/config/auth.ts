import jsonwebtoken, { JwtPayload, TokenExpiredError, decode } from "jsonwebtoken";
import crypto from "crypto";
import { Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";
import { Token } from "nodemailer/lib/xoauth2";

type TokenDecoded = {
  sub: number,
  iat: number,
  exp: number,
} | string | jsonwebtoken.JwtPayload

const PRIV_KEY = fs.readFileSync(
  path.join(__dirname, "..", "..", "id_rsa_priv.pem"),
  "utf-8"
);

const generatePassword = (password: string) => {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: hash,
  };
};

const generateJWT = (user: any, time?: string) => {
  const sub = user.id;
  const payload = {
    sub: sub,
    iat: Date.now(),
  };

  console.log(time)

  const jwt = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: time ? time : "7d",
    algorithm: "RS256",
  });

  return jwt;
};

/* const generateJWTTest = (req: Request, res: Response) => {
  const user = {
    id: 324235432,
    name: "Gabriel"
  }
  const sub = user.id;
  const payload = {
    sub: sub,
    iat: Date.now(),
  }
  const jwt = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: "21d",
    algorithm: "RS256"
  })

  const decode = decodeJWT(jwt)
  const {exp} = decode

  console.log(decode.exp - decode.iat)
  
  return res.status(200).send(jwt)
} */

const validateJWT = (req: Request, res: Response) => {
  const {token} = req.body
  const decoded = jsonwebtoken.verify(token, PRIV_KEY) as JwtPayload
  if(decoded.iat && decoded.exp) {
    const expired = isTokenExpired(decoded.iat, decoded.exp)
    if(!expired) return res.status(200).json(decoded)
    else return res.status(401).json("Invalid token")
  }
}

const isTokenExpired = (iat: number, exp: number) => {
  const duration = exp - iat
  const beg = new Date(iat)
  const limit = new Date(beg.getTime() + duration * 1000)
  return (new Date() > limit)
}

/* const isTokenExpired = (token: string) => {
  const payload = decodeJWT(token)
  const { exp } = decodeJWT(token);
  const date = new Date(exp)
  const expirationTimeInSeconds = exp * 1000; // converting expiration time to milliseconds
  console.log(payload)
  console.log(date)
  const currentTime = Date.now();
  return expirationTimeInSeconds < currentTime;
}; */

const checkPassword = (password: string, hash: string, salt: string) => {
  const hashFromRequest = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hashFromRequest === hash;
};

/* const decodeJWT = (token: any) => {
  const payload = token.split(".")[1];
  const encodedPayload = Buffer.from(payload, "base64");
  const decodePayload = encodedPayload.toString("utf-8");
  return JSON.parse(decodePayload);
}; */

const getToken = (req: Request) => {
  let token = null;
  // Recuperando token dos cookies

  const cookiesHeader = req.headers.cookie;

  if (cookiesHeader) {
    console.log(cookiesHeader);
    const cookies: { [key: string]: string } = cookiesHeader
      .split(";")
      .reduce((cookies: any, cookie) => {
        const [key, value] = cookie.trim().split("=");

        cookies[key] = value;

        return cookies;
      }, {});

    token = cookies.token1;
  }

  if (!token) {
    return Error;
  } else {
    //return token.split(" ")[1];
    return token;
  }
};

export default {
  generatePassword,
  generateJWT,
  checkPassword,
  isTokenExpired,
  getToken,
  validateJWT,
};
