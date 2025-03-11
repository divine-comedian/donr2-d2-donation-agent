import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    ModelClass,
    generateMessageResponse,
    getModelSettings,
    generateText,
} from "@elizaos/core";

import { getProjectsForReviewExamples } from "../examples";
import { createGivethGraphService } from "../services";

export const getProjectsForReviewAction: Action = {
    name: "GET_PROJECTS_FOR_REVIEW",
    similes: [
        "REVIEW",
        "REVIEW_PROJECTS",
        "REVIEW_PROJECT",
        "REVIEW_GIVETH_PROJECTS",
        "REVIEW_GIVETH_PROJECT",
        "REVIEW_NEW_PROJECTS",
        "REVIEW_NEW_PROJECT",
        "REVIEW_LATEST_PROJECTS",
        "REVIEW_LATEST_PROJECT",
        "REVIEW_LATEST_GIVETH_PROJECTS",
        "REVIEW_LATEST_GIVETH_PROJECT",
    ],
    description: "Get the projects for review.",
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
            const ProjectsData = await givethGraphService.getProjects();
            elizaLogger.success(
                `Successfully fetched Projects for review`,
                ProjectsData
            );
            if (callback) {
                const projects = ProjectsData.data.allProjects.projects;

                let context = `###Projects review###\nYou will check the following projects and give a review for each of them. If their review ok with their status,
                 you will approve them. If not, you will reject them. You will also check if the project is a scam or not.
                  In addition provide a one sentence description of the project.`;
                context += `You will answer me something like this:\n\n`;
                context += `
                            ## Found ${projects.length} projects needing to be reviewed
                            **{projectTitle}** - all good.\n
                            {one sentence description of the project}
                            **{projectTitle}** - no issues found.\n
                            {one sentence description of the project}
                            **{projectTitle}** - contains references to illegal gambling\n
                            {one sentence description of the project}
                            **{projectTitle}** - looks like phishing scam because x \n
                            {one sentence description of the project}
                            `;

                context += `\n\n###Projects list###\n`;

                const projectsList = projects
                    .map(
                        (project) =>
                            `• Project title: ${project.title} \n Project description: ${project.description}`
                    )
                    .join("\n");

                context += `\n\n${projectsList}\n`;

                console.log(
                    "Using model:",
                    getModelSettings(runtime.modelProvider, ModelClass.LARGE)
                );

                const projectValidationAnswer = await generateText({
                    runtime,
                    context,
                    modelClass: ModelClass.LARGE,
                });
                console.log(
                    "Project validation answer:",
                    projectValidationAnswer
                );
                callback({
                    text: projectValidationAnswer,
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
    examples: getProjectsForReviewExamples as ActionExample[][],
} as Action;
