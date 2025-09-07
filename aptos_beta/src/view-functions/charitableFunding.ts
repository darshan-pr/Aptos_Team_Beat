import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { NETWORK, MODULE_ADDRESS, APTOS_API_KEY } from "@/constants";

let aptosConfig: AptosConfig;
if (APTOS_API_KEY) {
  aptosConfig = new AptosConfig({ 
    network: NETWORK as Network, 
    fullnode: undefined,
    indexer: undefined,
    clientConfig: { API_KEY: APTOS_API_KEY }
  });
} else {
  aptosConfig = new AptosConfig({ network: NETWORK as Network });
}

const aptos = new Aptos(aptosConfig);

export type ProjectDetails = {
  title: string;
  description: string;
  totalFundingRequired: bigint;
  currentFunding: bigint;
  creator: string;
};

export type MilestoneDetails = {
  title: string;
  description: string;
  fundingAmount: bigint;
  isCompleted: boolean;
  isVerified: boolean;
  verificationCount: number;
};

export const getProjectDetails = async (projectId: number): Promise<ProjectDetails> => {
  try {
    const response = await aptos.view({
      payload: {
        function: `${MODULE_ADDRESS}::charitable_funding::get_project_details`,
        functionArguments: [projectId.toString()],
      },
    });

    return {
      title: response[0] as string,
      description: response[1] as string,
      totalFundingRequired: BigInt(response[2] as string),
      currentFunding: BigInt(response[3] as string),
      creator: response[4] as string,
    };
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
};

export const getProjectCount = async (): Promise<number> => {
  try {
    const response = await aptos.view({
      payload: {
        function: `${MODULE_ADDRESS}::charitable_funding::get_project_count`,
        functionArguments: [],
      },
    });

    return Number(response[0]);
  } catch (error) {
    console.error("Error fetching project count:", error);
    throw error;
  }
};

export const projectExists = async (projectId: number): Promise<boolean> => {
  try {
    const response = await aptos.view({
      payload: {
        function: `${MODULE_ADDRESS}::charitable_funding::project_exists`,
        functionArguments: [projectId.toString()],
      },
    });

    return response[0] as boolean;
  } catch (error) {
    console.error("Error checking if project exists:", error);
    throw error;
  }
};

export const getMilestoneDetails = async (projectId: number, milestoneId: number): Promise<MilestoneDetails> => {
  try {
    const response = await aptos.view({
      payload: {
        function: `${MODULE_ADDRESS}::charitable_funding::get_milestone_details`,
        functionArguments: [projectId.toString(), milestoneId.toString()],
      },
    });

    return {
      title: response[0] as string,
      description: response[1] as string,
      fundingAmount: BigInt(response[2] as string),
      isCompleted: response[3] as boolean,
      isVerified: response[4] as boolean,
      verificationCount: Number(response[5]),
    };
  } catch (error) {
    console.error("Error fetching milestone details:", error);
    throw error;
  }
};

export const getMilestoneCount = async (projectId: number): Promise<number> => {
  try {
    const response = await aptos.view({
      payload: {
        function: `${MODULE_ADDRESS}::charitable_funding::get_milestone_count`,
        functionArguments: [projectId.toString()],
      },
    });

    return Number(response[0]);
  } catch (error) {
    console.error("Error fetching milestone count:", error);
    throw error;
  }
};
