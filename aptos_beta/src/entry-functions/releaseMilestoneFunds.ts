import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";

/**
 * Create a transaction for releasing funds for a verified milestone
 */
export function releaseMilestoneFunds({
  projectId,
  milestoneId,
}: {
  projectId: number;
  milestoneId: number;
}): InputTransactionData {
  return {
    data: {
      function: `${MODULE_ADDRESS}::charitable_funding::release_milestone_funds`,
      functionArguments: [projectId, milestoneId],
    },
  };
}
