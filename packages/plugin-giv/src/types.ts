/** Represents a blockchain address with its network ID */
export interface ProjectAddress {
    address: string;
    networkId: number;
}

/** Represents a single Giveth project */
export interface Project {
    title: string;
    slug: string;
    description: string;
    addresses: ProjectAddress[];
}

/** Represents the projects list response from the Giveth API */
export interface ProjectsResponse {
    data: {
        allProjects: {
            projects: Project[];
        };
    };
    errors?: Array<{
        message: string;
        locations?: Array<{ line: number; column: number }>;
        path?: string[];
    }>;
}

export interface DeVouchAttestationsResponse {
    data: {
        projectAttestations: Array<{
            attestTimestamp: string;
            project: {
                projectId: string;
                title: string;
                url: string;
                attests: Array<{
                    attestorOrganisation: {
                        organisation: {
                            id: string;
                        };
                        attestor: {
                            id: string;
                        };
                    };
                }>;
            };
        }>;
    };
}

export interface ProjectByIdResponse {
    data: {
        projectById: {
            title: string;
            slug: string;
            description: string;
            verified: boolean;
        };
    };
}

export interface RecentDonationsResponse {
    data: {
        recentDonations: Array<{
            valueUsd: number;
            project: {
                title: string;
            };
        }>;
    };
}
