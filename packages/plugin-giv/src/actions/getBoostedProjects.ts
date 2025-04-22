import {
    elizaLogger,
    type Action,
    type ActionExample,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    type State,
} from "@elizaos/core";
import { getProjectsExamples } from "../examples";
import { createGivethGraphService } from "../services";

export const getBoostedProjectsAction: Action = {
    name: "BOOSTED_GIVETH_PROJECTS",
    similes: ["GIVPOWER", "BOOSTED", "TOP", "TRENDING"],
    description: "Get the top boosted projects on Giveth.",
    validate: async () => true,
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        const givethGraphService = createGivethGraphService();

        try {
            const BoostedProjectsData = await givethGraphService.getProjects();
            elizaLogger.success(`Successfully fetched Boosted Projects`);
            if (callback) {
                const projects = BoostedProjectsData.data.allProjects.projects;
                const projectsList = projects
                    .map((project) => `• ${project.title}`)
                    .join("\n");

                callback({
                    text: `Here are the top boosted projects right now:\n${projectsList}`,
                });
            }
            return true;
        } catch (error: any) {
            elizaLogger.error("Error in Giveth plugin handler:", error);
            callback({
                text: `Error fetching boosted projects: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: getProjectsExamples as ActionExample[][],
} as Action;
