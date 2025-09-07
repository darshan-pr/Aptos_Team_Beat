import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";

/**
 * Create a transaction for adding a milestone to a project
 */
export function addMilestone({
  projectId,
  title,
  description,
  fundingAmount,
}: {
  projectId: number;
  title: string;
  description: string;
  fundingAmount: bigint;
}): InputTransactionData {
  return {
    data: {
      function: `${MODULE_ADDRESS}::charitable_funding::add_milestone`,
      functionArguments: [projectId, title, description, fundingAmount],
    },
  };
}
