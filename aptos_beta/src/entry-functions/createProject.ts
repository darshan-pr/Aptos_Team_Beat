import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";

export type CreateProjectArguments = {
  title: string;
  description: string;
  totalFundingRequired: bigint | number;
};

export const createProject = (args: CreateProjectArguments): InputTransactionData => {
  const { title, description, totalFundingRequired } = args;
  return {
    data: {
      function: `${MODULE_ADDRESS}::charitable_funding::create_project`,
      functionArguments: [
        title,
        description,
        totalFundingRequired.toString(),
      ],
    },
  };
};
