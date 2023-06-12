import { MongoClient } from "mongodb";

export async function connect() {
  return await MongoClient.connect(process.env.MONGO_URI);
}
