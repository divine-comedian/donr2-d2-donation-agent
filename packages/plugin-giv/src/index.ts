import type { Plugin } from "@elizaos/core";
import { getBoostedProjectsAction } from "./actions/getBoostedProjects";
import { getPendingVouchedProjects } from "./actions/getPendingVouchedProjects";
import { getRecentDonations } from "./actions/getRecentDonations";
import { promoteTopProjectAction } from "./actions/promoteTopProject";

export const givPlugin: Plugin = {
    name: "giv",
    actions: [getPendingVouchedProjects, getRecentDonations, promoteTopProjectAction],
    description: "GIV plugin",
    evaluators: [],
    providers: [],
};

export default givPlugin;
