import {
    type ProjectsResponse,
    type DeVouchAttestationsResponse,
    type ProjectByIdResponse,
    type RecentDonationsResponse,
    type KarmaAPIResponse,
    type Donation,
    Donations,
    Transaction,
    type ProjectUpdatesResponse
} from "./types";

import { DonationHandlerAddress } from "./constants";
import { privateKeyToAccount } from 'viem/accounts'
import { createWalletClient, createPublicClient, http } from 'viem'
import DonationHandlerABI from "../abi/DonationHandler.json";
import IERC20ABI from "../abi/IERC20.json";
import { celoAlfajores, type Chain } from "viem/chains";
import { composeContext, type State, ModelClass, type IAgentRuntime, generateObjectDeprecated } from "@elizaos/core";

const GIVETH_PROD_URL = "https://mainnet.serve.giveth.io/graphql";
const DEVOUCH_PROD_URL = "https://optimism.backend.devouch.xyz/graphql";
const KARMA_SEARCH_API_URL = "https://gapapi.karmahq.xyz/search?q=";
export const createGivethGraphService = () => {
    const getProjects = async (
        limit = 10
    ): Promise<ProjectsResponse> => {
        try {
            const query = `{
                allProjects(sortingBy: InstantBoosting, limit: ${limit}, skip: 0) {
                    projects {
                        title
                        slug
                        id
                        description
                        addresses {
                            address
                            networkId
                        }
                    }
                }
            }`;

            const response = await fetch(GIVETH_PROD_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData?.errors?.[0]?.message ||
                        errorData?.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const data = await response.json();

            // Validate that the response has the expected structure
            if (!data?.data?.allProjects?.projects) {
                throw new Error("Invalid response structure from Giveth API");
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                console.error("Giveth API Error:", error.message);
            } else {
                console.error("Unexpected error:", error);
            }
            throw error;
        }
    };

    const getDeVouchAttestations = async (
        limit: number,
        offset = 0,
        organisation_id = "0xf63f2a7159ee674aa6fce42196a8bb0605eafcf20c19e91a7eafba8d39fa0404"
    ): Promise<DeVouchAttestationsResponse> => {
        try {
            const query = `
                {
  projectAttestations(
    offset: ${offset},
    limit: ${limit},
    orderBy: attestTimestamp_DESC,
    where: {
      vouch_eq: true,
      project: {
        source_eq: "giveth"
      },
      attestorOrganisation: {
        organisation: {
          id_eq: "${organisation_id}"
        }
      }
    }
  ) {
    attestTimestamp
    project {
      projectId
      title
      url
      attests(
        where: {
          attestorOrganisation: {
            organisation: {
              id_eq: "${organisation_id}"
            }
          }
        }
      ) {
        attestorOrganisation {
          organisation {
            id
          }
        }
        attestorOrganisation {
          attestor {
            id
          }
        }
      }
    }
  }
}`;

            // const variables = {
            //     limit,
            //     offset,
            //     organisation_id,
            // };

            const response = await fetch(DEVOUCH_PROD_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData?.errors?.[0]?.message ||
                        errorData?.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const data = await response.json();

            // Validate that the response has the expected structure
            if (!data?.data?.projectAttestations) {
                throw new Error("Invalid response structure from DeVouch API");
            }
            if (data) {
                console.log(data.data?.projectAttestations[0].project.title);
                console.log(data.data?.projectAttestations[0].attestTimestamp);
            }
            return data;
        } catch (error) {
            if (error instanceof Error) {
                console.error("DeVouch API Error:", error.message);
            } else {
                console.error("Unexpected error:", error);
            }
            throw error;
        }
    };

    const getProjectById = async (
        projectId: number
    ): Promise<ProjectByIdResponse> => {
        try {
            const query = `query {
    projectById(id: ${projectId}) {
        title
        slug
        description
        verified
        socialMedia{
            link
            type
        }
    }
}`;
            const response = await fetch(GIVETH_PROD_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData?.errors?.[0]?.message ||
                        errorData?.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const data = await response.json();

            // Validate that the response has the expected structure
            if (!data?.data?.projectById) {
                throw new Error("Invalid response structure from Giveth API");
            }
            if (data) {
                console.log(data.data?.projectById.title);
            }
            return data;
        } catch (error) {
            if (error instanceof Error) {
                console.error("Giveth API Error:", error.message);
            } else {
                console.error("Unexpected error:", error);
            }
            throw error;
        }
    };

    const getProjectUpdates = async (
        projectId: number
    ): Promise<ProjectUpdatesResponse> => {
        try {
            const query = `query {
    getProjectUpdates(projectId:${projectId}) {
        title
        content
        createdAt
    }
}
`;
            const response = await fetch(GIVETH_PROD_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData?.errors?.[0]?.message ||
                        errorData?.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const data = await response.json();

            // Validate that the response has the expected structure
            if (!data?.data?.getProjectUpdates) {
                throw new Error("Invalid response structure from Giveth API");
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                console.error("Giveth API Error:", error.message);
            } else {
                console.error("Unexpected error:", error);
            }
            throw error;
        }
    };

    const getRecentDonations = async (
        take: number
    ): Promise<RecentDonationsResponse> => {
        try {
            const query = `
query getRecentDonations {
    recentDonations( take:${take} ) {
        valueUsd
        project {
            title
        }
    }
}
`;

            const response = await fetch(GIVETH_PROD_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData?.errors?.[0]?.message ||
                        errorData?.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const data = await response.json();

            // Validate that the response has the expected structure
            if (!data?.data?.recentDonations) {
                throw new Error("Invalid response structure from Giveth API");
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                console.error("Giveth API Error:", error.message);
            } else {
                console.error("Unexpected error:", error);
            }
            throw error;
        }
    };

    const getProjectsByCategory = async (
        category: string,
        limit: number,
        sortingBy: string,
        mainCategory: string
    ): Promise<ProjectsResponse> => {
        try {
            const query = `
                query FetchProjectsByCategory(
      $limit: Int,
      $sortingBy: SortingField,
      $mainCategory: String,
      $category: String
    ) {
      allProjects(
        limit: ${limit},
        sortingBy: ${sortingBy},
        mainCategory: ${mainCategory},
        category: ${category}
      ) {
        projects {
          title
          description
          qualityScore
        }
      }
    }`;
    const response = await fetch(GIVETH_PROD_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            errorData?.errors?.[0]?.message ||
                errorData?.message ||
                `HTTP error! status: ${response.status}`
        );
    }

    const data = await response.json();

    // Validate that the response has the expected structure
    if (!data?.data?.recentDonations) {
        throw new Error("Invalid response structure from Giveth API");
    }

    return data;
} catch (error) {
    if (error instanceof Error) {
        console.error("Giveth API Error:", error.message);
    } else {
        console.error("Unexpected error:", error);
    }
    throw error;
        }
    };

    const getKarmaProjects = async (searchTerm: string): Promise<KarmaAPIResponse> => {
        try {
            const response = await fetch(KARMA_SEARCH_API_URL + searchTerm);
            const data = await response.json();
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Karma API Error:", error.message);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };

    return {
        getProjects,
        getDeVouchAttestations,
        getProjectById,
        getRecentDonations,
        getProjectsByCategory,
        getKarmaProjects,
        getProjectUpdates
    }
    
    
    
};
export const DonationHandlerService = (privateKey: string) => {
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    interface ValidateDonationResponse {
        success: boolean
        error?: string
    }
    const validateDonation = async (donation: Donation, chain: Chain, donationHandlerAddress: string): Promise<ValidateDonationResponse> => {
       const validationResponse:ValidateDonationResponse  = {
        success: true,
        error: ""
       }
       
        const publicClient = createPublicClient({
            chain: chain,
            transport: http()
        })

        const balanceCheck = await publicClient.readContract({
            address: donation.tokenAddress as `0x${string}`,
            abi: IERC20ABI.abi,
            functionName: "balanceOf",
            args: [account.address]
        }) as bigint;
        if (balanceCheck > donation.amount) {
            validationResponse.success = true
        }

        const allowanceCheck = await publicClient.readContract({
            address: donation.tokenAddress as `0x${string}`,
            abi: IERC20ABI.abi,
            functionName: "allowance",
            args: [account.address, donationHandlerAddress]
        }) as bigint;
        if (allowanceCheck < donation.amount) {
            validationResponse.success = false
            validationResponse.error = "Insufficient allowance"
        }
        
        return validationResponse
    }
    const sendDonation = async (donation: Donation, chain: Chain): Promise<string> => {
        if (!privateKey) {
            throw new Error("Private key is required");
        }


        const walletClient = createWalletClient({
            account,
            chain: chain,
            transport: http()
        });
        const publicClient = createPublicClient({
            chain: chain,
            transport: http()
        });
        let donationHash: string;
        try {
            // First approve the tokens
            
            const { request: allowanceRequest } = await publicClient.simulateContract({
                address: donation.tokenAddress as `0x${string}`,
                abi: IERC20ABI.abi,
                functionName: "approve",
                args: [DonationHandlerAddress.ALFAJORES.address, donation.amount]
            });
                
                const allowanceHash = await walletClient.writeContract(allowanceRequest);
                
                // Wait for allowance transaction to be mined
                await publicClient.waitForTransactionReceipt({ hash: allowanceHash });
                if (donation.tokenAddress) {
                    
                    const validationResponse = await validateDonation(donation, chain, DonationHandlerAddress.ALFAJORES.address);
                    console.log("validationResponse", validationResponse)
            
                    // if (!validationResponse.success) {
            //     throw new Error(validationResponse.error);
            // }
                
                // Then execute the donation
                const { request: donateRequest } = await publicClient.simulateContract({
                    address: DonationHandlerAddress.ALFAJORES.address as `0x${string}`,
                    abi: DonationHandlerABI.abi,
                    functionName: "donateERC20",
                    args: [donation.tokenAddress, donation.recipient, donation.amount, donation.projectId]
                });
                
                donationHash = await walletClient.writeContract(donateRequest);
            } else {
                // Execute ETH donation
                const { request: donateRequest } = await publicClient.simulateContract({
                    address: DonationHandlerAddress.ALFAJORES.address as `0x${string}`,
                    abi: DonationHandlerABI.abi,
                    functionName: "donateETH",
                    args: [
                        donation.recipient,
                        donation.amount,
                        donation.projectId // This should be properly encoded as bytes
                    ],
                    value: donation.amount
                });
                
                donationHash = await walletClient.writeContract(donateRequest);
            }

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Transaction failed: ${error.message}`);
            }
            throw new Error('Transaction failed with unknown error');
        }
        return donationHash;
    }
    return {
        sendDonation
    }
}

export const generateInput = async (
    runtime: IAgentRuntime,
    state: State,
    template: string
): Promise<any> => {
    const recentDonationsContext = composeContext({
        state,
        template: template,
    });

    const input = (await generateObjectDeprecated({
        runtime,
        context: recentDonationsContext,
        modelClass: ModelClass.SMALL,
    })) as any;

    return input;
};
