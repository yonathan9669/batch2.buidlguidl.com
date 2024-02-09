import { profile } from "./data.json";
import type { NextApiRequest, NextApiResponse } from "next";

type APIProfile = {
  bio: string;
  avatar: string;
  slogan: string;
  address: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<APIProfile>) {
  if (req.method !== "GET") throw new Error("Invalid method");

  // TODO: Load from ENS. [socials, slogan, avatar]. https://docs.ens.domains/contract-api-reference/publicresolver#get-text-data
  res.status(200).json(profile);
}
