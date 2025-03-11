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
