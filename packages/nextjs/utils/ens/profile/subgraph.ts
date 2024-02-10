import { createEnsPublicClient } from "@ensdomains/ensjs";
import { getName } from "@ensdomains/ensjs/public";
import { http } from "viem";
import { mainnet } from "viem/chains";

const client = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function getProfile({ name, address }: { name?: string; address?: string }) {
  if (!name && !address) throw new Error("Invalid parameters");
  if (!name && address) {
    const resolver = await getName(client, { address });
    name = resolver?.name;
  }
  if (!name) throw new Error("No ENS found");

  const subgraphRecords = await client.getSubgraphRecords({ name });
  const records = await client.getRecords({
    name,
    coins: subgraphRecords?.coins,
    texts: subgraphRecords?.texts,
    contentHash: true,
  });

  return {
    name,
    ...records,
  };
}
export default getProfile;
