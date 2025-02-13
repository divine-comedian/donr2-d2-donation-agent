import { Plugin } from "@elizaos/core";
import { getBoostedProjectsAction } from "./actions/getBoostedProjects";
export const givPlugin: Plugin = {
    name: "giv",
    actions: [getBoostedProjectsAction],
    description: "GIV plugin",
    evaluators: [],
    providers: [],
};

export default givPlugin;
