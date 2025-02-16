import { Plugin } from "@elizaos/core";
import { getBoostedProjectsAction } from "./actions/getBoostedProjects";
import { getPendingVouchedProjects } from "./actions/getPendingVouchedProjects";
import { getRecentDonations } from "./actions/getRecentDonations";

export const givPlugin: Plugin = {
    name: "giv",
    actions: [getPendingVouchedProjects, getRecentDonations],
    description: "GIV plugin",
    evaluators: [],
    providers: [],
};

export default givPlugin;
