import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";
import { Request } from "express";
import * as fs from "fs";
import * as path from "path";

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

  const jwt = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: time ? time : "7d",
    algorithm: "RS256",
  });
  return jwt;
};

const checkPassword = (password: string, hash: string, salt: string) => {
  const hashFromRequest = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hashFromRequest === hash;
};

const decodeJWT = (token: any) => {
  const payload = token.split(".")[1];
  const encodedPayload = Buffer.from(payload, "base64");
  const decodePayload = encodedPayload.toString("utf-8");
  return JSON.parse(decodePayload);
};

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
  decodeJWT,
  getToken,
};
