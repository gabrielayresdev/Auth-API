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

const generateJWT = (user: any) => {
  const sub = user.id;
  const payload = {
    sub: sub,
    iat: Date.now(),
  };

  const jwt = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: "7d",
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

const getToken = (request: Request) => {
  const token = request.get("Authorization");

  if (!token) {
    return Error;
  } else {
    return token.split(" ")[1];
  }
};

export default {
  generatePassword,
  generateJWT,
  checkPassword,
  decodeJWT,
  getToken,
};
