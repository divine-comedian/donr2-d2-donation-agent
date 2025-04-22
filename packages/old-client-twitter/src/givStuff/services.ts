import {
    type ProjectsResponse,
    type DeVouchAttestationsResponse,
    type ProjectByIdResponse,
    type RecentDonationsResponse,
    type KarmaAPIResponse,
    Donation,
    Donations,
    Transaction,
    type ProjectUpdatesResponse
} from "./types";

import { celoAlfajores, Chain } from "viem/chains";
import { composeContext, State, ModelClass, IAgentRuntime, generateObjectDeprecated } from "@elizaos/core";

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
        totalDonations
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
