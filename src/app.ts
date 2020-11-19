import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import speakeasy from "speakeasy";
import { v4 as uuidv4 } from "uuid";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

dotenv.config();

const db = new JsonDB(new Config("myDatabase", true, false, "/"));

const app: Application = express();

app.use(express.json());

const { APP_PORT = 4000 } = process.env;

app.get("/api", (req: Request, res: Response): void => {
  res.json({ msg: `Welcome to the Two Factor Authtication Example` });
});

/**
 * Register User && Create temp secret
 */
app.post("/api/register", (req: Request, res: Response): void => {
  const id = uuidv4();

  interface secretInterface {
    ascii: string;
    hex: string;
    base32: string;
    otpauth_url: string;
  }

  try {
    const path: string = `/user/${id}`;
    const secret: secretInterface = speakeasy.generateSecret() as secretInterface;
    const { base32 }: { base32: string } = secret;

    db.push(path, { id, secret });
    res.json({ id, secret: base32 });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ msg: "Error generating the secret" });
  }
});

/**
 * Validate token
 */
app.post("/api/validate", (req: Request, res: Response): void => {
  interface payloadInterface {
    token: string;
    userId: string;
  }

  const { token, userId }: payloadInterface = req.body;

  try {
    const path: string = `/user/${userId}`;
    const user: any = db.getData(path);
    const { base32: secret }: { base32: string } = user.secret;

    const tokenValidates: boolean = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 1
    });

    if (tokenValidates) {
      res.json({ verified: true });
    } else {
      res.json({ verified: false });
    }
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ msg: "Error finding user" });
  }
});

app.listen(APP_PORT, (): void => {
  console.log(`Server running on port ${APP_PORT}`);
});
