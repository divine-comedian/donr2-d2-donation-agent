import type { Plugin } from "@elizaos/core";
import { getProjectsForReviewAction } from "./actions/getProjectsForReview";

export const givProjectsPlugin: Plugin = {
    name: "givProjects",
    actions: [getProjectsForReviewAction],
    description: "GIV Review Projects plugin",
    evaluators: [],
    providers: [],
};

export default givProjectsPlugin;
