import { ProjectsResponse } from "./types";

const GIVETH_PROD_URL = "https://mainnet.serve.giveth.io/graphql";

export const createGivethGraphService = () => {
    const getProjects = async (
        limit: number = 2
    ): Promise<ProjectsResponse> => {
        try {
            const query = `{
                allProjects(sortingBy: InstantBoosting, limit: ${limit}, skip: 0) {
                    projects {
                        title
                        slug
                        description
                        addresses {
                            address
                            networkId
                        }
                        status {
                            name
                        }
                        reviewStatus
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

    return { getProjects };
};
