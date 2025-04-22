import {
    elizaLogger,
    type Action,
    type ActionExample,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    type State,
    ModelClass,
    generateText,
} from "@elizaos/core";
import { createGivethGraphService } from "../services";
import { promoteTopProjectExamples } from "../examples";


export const promoteTopProjectAction: Action = {
    name: "PROMOTE_TOP_PROJECT",
    examples: promoteTopProjectExamples as ActionExample[][],
    similes: ["TOP_PROJECT", "BEST_PROJECT", "TOP_BOOSTED", "PROJECT_INFO"],
    description: "Get the top boosted project on Giveth. Fetch information about the project, its twitter handle ",
    validate: async (runtime) => {
        const givethGraphService = createGivethGraphService();
        const topProject = await givethGraphService.getProjects(10);
        return topProject.data.allProjects.projects.length > 0;
    },
    handler: async (runtime: IAgentRuntime, message: Memory, state: State, options: { [key: string]: unknown }, callback: HandlerCallback) => {
        try {
            const givethGraphService = createGivethGraphService();
            const topProjects = await givethGraphService.getProjects(10);
            const randomNumber = Math.floor(Math.random() * topProjects.data.allProjects.projects.length);
            const project = topProjects.data.allProjects.projects[randomNumber];
            console.log("project\n\n", project);
        const [projectInfo, projectUpdates] = await Promise.all([
            givethGraphService.getProjectById(project.id),
            givethGraphService.getProjectUpdates(project.id)
        ]);

        const projectTwitter = project.socialMedia?.find(media => media.type === "X")?.link;
        let projectLatestUpdate: string;


        if (projectUpdates.data.getProjectUpdates.length > 0) {
            projectLatestUpdate = `${projectUpdates.data.getProjectUpdates[0].title}: ${projectUpdates.data.getProjectUpdates[0].content}`;
        } else {
            projectLatestUpdate = "No updates";
        }
        const projectInfoContext = `
            Project Name: ${projectInfo.data.projectById.title}
            Project Description: ${projectInfo.data.projectById.description}
            Project Twitter Handle: ${projectTwitter}
            Project Latest Updates: ${projectLatestUpdate}
            Project URL: https://giveth.io/project/${projectInfo.data.projectById.slug}
        `;
        console.log("projectInfoContext\n\n", projectInfoContext);

        const fullContext = `
            YOU ARE: a virtual agent with a character defined by your bio and lore:
            ## LORE
            ${state.lore} 

            ## BIO 
            ${state.bio}

            
            ----
            # YOUR TASK:
            generate a tweet, promoting the specified project on Giveth and giving a brief description of the project and its latest update, also mention that this project is one of the top boosted projects on Giveth at the moment. Only provide the tweet text, no other text. Do not put quotation marks around the tweet text.
            do not provide any links to articles you do not have
            synthesize the project's infomation such as the title, description and their last project update. Ensure you tag @giveth and also the project's twitter handle if it has one.
            the info is provided here: 
            
            ${state.postDirections}

            ## PROJECT INFO 
            ${projectInfoContext}

            `;

            console.log("fullContext\n\n", fullContext);

            const systemPrompt = `generate a tweet, following your character's personality, of 260 characters maximum, highlighting and promoting one of the top projects on Giveth. Only provide the tweet text, no other text. Do not put quotation marks around the tweet text.
            do not provide any empty links to articles or data you do not have`; 



        const outputText = await generateText({
            runtime,
            context: fullContext,
            modelClass: ModelClass.LARGE,
            customSystemPrompt: systemPrompt
        });

       await callback({
        text: outputText
       })
    }
    catch (error) {
        elizaLogger.error("Error in getPendingVouchedProjects:", error);
        throw error;
    }
    },
} as Action;
