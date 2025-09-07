import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";

export type DonateToProjectArguments = {
  projectId: number;
  amount: bigint | number;
};

export const donateToProject = (args: DonateToProjectArguments): InputTransactionData => {
  const { projectId, amount } = args;
  return {
    data: {
      function: `${MODULE_ADDRESS}::charitable_funding::donate_to_project`,
      functionArguments: [projectId.toString(), amount.toString()],
    },
  };
};
