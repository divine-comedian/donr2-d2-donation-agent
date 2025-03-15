/** Represents a blockchain address with its network ID */
export interface ProjectAddress {
    address: string;
    networkId: number;
}

/** Represents a single Giveth project */
export interface Project {
    title: string;
    slug: string;
    id?: string;
    description?: string;
    addresses?: ProjectAddress[];
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
                slug: string;
            };
        }>;
    };
}

export type NumberObject = {
  number: number;
};


// Karma types

interface KarmaLink {
    type: string;
    url: string | null;
  }
  
  interface KarmaDetails {
    _id: {
      $oid: string;
    };
    uid: string;
    schemaUID: string;
    refUID: string;
    attester: string;
    recipient: string;
    revoked: boolean;
    revocationTime: number;
    createdAt: {
      $timestamp: {
        t: number;
        i: number;
      };
    };
    updatedAt: {
      $timestamp: {
        t: number;
        i: number;
      };
    };
    chainID: number;
    type: string;
    data: {
      description: string;
      imageURL: string;
      title: string;
      links: KarmaLink[];
      slug: string;
    };
    txid: string;
  }
  
  interface KarmaProject {
    uid: string;
    type: string;
    details: KarmaDetails;
    recipient: string;
    createdAt: string;
    updatedAt: string;
  }
  
  interface KarmaCommunity {
    uid: string;
    type: string;
    details: KarmaDetails;
    recipient: string;
    createdAt: string;
    updatedAt: string;
  }
  
export interface KarmaAPIResponse {
    communities: KarmaCommunity[];
    projects: KarmaProject[];
  }


export interface Transaction {
    hash?: string;
    from: string;
    to: string;
    value?: string;
    data?: string;
    chainId?: number;
}

export interface Donation {
    projectId: string;
    recipient: string;
    amount: bigint;
    tokenAddress?: string;
}

export interface Donations {
  projectIds: string[];
  recipients: string[];
  amounts: bigint[];
  tokenAddress?: string
}
// Enum for sorting options
  
  // Usage example:
//   const exampleQuery: FetchProjectsByCategoryQuery = {
//     query: `
//       query FetchProjectsByCategory(
//         $limit: Int,
//         $sortingBy: SortingField,
//         $mainCategory: String,
//         $category: String
//       ) {
//         allProjects(
//           limit: $limit,
//           sortingBy: $sortingBy,
//           mainCategory: $mainCategory,
//           category: $category
//         ) {
//           projects {
//             title
//             description
//             qualityScore
//           }
//         }
//       }
//     `,
//     variables: {
//       limit: 10,
//       sortingBy: SortingField.InstantBoosting,
//       mainCategory: "community",
//       category: "food"
//     },
//     response: {
//       allProjects: {
//         projects: [
//           {
//             title: "Example Project",
//             description: "Example Description",
//             qualityScore: 95
//           }
//         ]
//       }
//     }
//   };
  
//   // Type guard function to validate response
//   export function isProject(obj: any): obj is Project {
//     return (
//       typeof obj === 'object' &&
//       typeof obj.title === 'string' &&
//       typeof obj.description === 'string' &&
//       typeof obj.qualityScore === 'number'
//     );
//   }