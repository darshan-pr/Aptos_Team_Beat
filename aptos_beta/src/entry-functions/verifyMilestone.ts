import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";

/**
 * Create a transaction for verifying a milestone
 */
export function verifyMilestone({
  projectId,
  milestoneId,
}: {
  projectId: number;
  milestoneId: number;
}): InputTransactionData {
  return {
    data: {
      function: `${MODULE_ADDRESS}::charitable_funding::verify_milestone`,
      functionArguments: [projectId, milestoneId],
    },
  };
}
