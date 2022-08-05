import { ec } from "elliptic";

export const EC = new ec("secp256k1");

const key = EC.genKeyPair();
const publicKey = key.getPublic("hex");
const privateKey = key.getPrivate("hex");
