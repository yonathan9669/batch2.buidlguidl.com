import { links as LINKS } from "./data.json";
import type { NextApiRequest, NextApiResponse } from "next";

type APILink = { url: string; platform: { name: string; description: string } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") throw new Error("Invalid method");

  const links = (LINKS as Array<APILink>).map(({ url, platform: { name, description } }) => ({
    name,
    description,
    url,
    network: name.split(".").pop(),
  }));

  res.status(200).json(links);
}
