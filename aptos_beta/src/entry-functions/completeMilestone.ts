import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";

/**
 * Create a transaction for marking a milestone as complete
 */
export function completeMilestone({
  projectId,
  milestoneId,
}: {
  projectId: number;
  milestoneId: number;
}): InputTransactionData {
  return {
    data: {
      function: `${MODULE_ADDRESS}::charitable_funding::complete_milestone`,
      functionArguments: [projectId, milestoneId],
    },
  };
}
