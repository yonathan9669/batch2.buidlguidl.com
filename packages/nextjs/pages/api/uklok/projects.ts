import { projects } from "./data.json";
import type { NextApiRequest, NextApiResponse } from "next";

type APIProject = {
  title: string;
  image: string;
  description: string;
  link: string;
};
export default async function handler(req: NextApiRequest, res: NextApiResponse<APIProject[]>) {
  if (req.method !== "GET") throw new Error("Invalid method");

  res.status(200).json(projects);
}
