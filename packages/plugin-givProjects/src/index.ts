import { Plugin } from "@elizaos/core";
import { getProjectsForReviewAction } from "./actions/getProjectsFOrReview";

export const givProjectsPlugin: Plugin = {
    name: "givProjects",
    actions: [getProjectsForReviewAction],
    description: "GIV Review Projects plugin",
    evaluators: [],
    providers: [],
};

export default givProjectsPlugin;
