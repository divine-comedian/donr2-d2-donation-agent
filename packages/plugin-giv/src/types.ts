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
            id: string;
            vouch: boolean;
            attestTimestamp: string;
            comment: string;
            project: {
                projectId: string;
                totalVouches: number;
                title: string;
                source: string;
                url: string;
            };
            attestorOrganisation: {
                attestor: {
                    id: string;
                };
                organisation: {
                    id: string;
                    name: string;
                    color: string;
                };
            };
        }>;
    };
}
