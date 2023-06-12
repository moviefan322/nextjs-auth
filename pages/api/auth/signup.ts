import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/db";
import { hashPassword } from "../../../utils/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return;
  }

  const data = req.body;

  const { email, password } = data;

  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({ message: "Invalid input." });
    return;
  }

  let client;
  let db;
  try {
    client = await connect();
    db = client.db();
  } catch (error) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  const existingUser = await db.collection("users").findOne({ email: email });

  if (existingUser) {
    client.close();
    res.status(422).json({ message: "User exists already!" });
    return;
  }

  try {
    const hasedPassword = await hashPassword(password);

    const result = await db.collection("users").insertOne({
      email,
      password: hasedPassword,
    });

    if (!result) {
      client.close();
      res.status(500).json({ message: "Inserting data failed!" });
      return;
    }
    
  } catch (error) {
    client.close();
    res.status(500).json({ message: "Inserting data failed!" });
    return;
  }

  client.close();
  res.status(201).json({ message: "Signed up!" });
}

export default handler;
