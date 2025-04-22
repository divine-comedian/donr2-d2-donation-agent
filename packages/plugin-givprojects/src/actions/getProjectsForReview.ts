import {
    elizaLogger,
    type Action,
    type ActionExample,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    type State,
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

                const projectReviewPrompt = buildProjectReviewPrompt(projects);

                console.log(
                    "Using model:",
                    getModelSettings(runtime.modelProvider, ModelClass.LARGE)
                );

                const projectValidationAnswer = await generateText({
                    runtime,
                    context: projectReviewPrompt,
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

function buildProjectReviewPrompt(projects) {
    const baseSlug = "https://giveth.io/project/";
    const template = `
###Projects review###
You will check the following projects and give a review for each of them. If their review is consistent with their status, you will approve them. If not, you will reject them. You will also check if the project is a scam or not. In addition, provide a one sentence description of the project.

You will answer me something like this:

## Found ${projects.length} projects needing to be reviewed
**[{projectTitle}](projectLink)** - all good.
{one sentence description of the project}

**[{projectTitle}](projectLink)** - no issues found.
{one sentence description of the project}

**[{projectTitle}](projectLink)** - contains references to illegal gambling
{one sentence description of the project}

**[{projectTitle}](projectLink)** - looks like phishing scam because x
{one sentence description of the project}

###Projects list###
${projects.map(project => 
  `• Project title: ${project.title}\n  Project description: ${project.description}, projectLink: ${baseSlug}${project.slug}`
).join("\n\n")}
`;

    return template.trim();
}
