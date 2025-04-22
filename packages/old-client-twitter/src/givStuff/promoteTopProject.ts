import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    ModelClass,
    generateText,
} from "@elizaos/core";
import { createGivethGraphService } from "./services";


export const promoteTopProjectAction = async (state: State, runtime: IAgentRuntime) => {
       try {
            const givethGraphService = createGivethGraphService();
            const topProjects = await givethGraphService.getProjects(20);
            const randomNumber = Math.floor(Math.random() * topProjects.data.allProjects.projects.length);
            const project = topProjects.data.allProjects.projects[randomNumber];
            // console.log("project\n\n", project);
        const [projectInfo, projectUpdates] = await Promise.all([
            givethGraphService.getProjectById(project.id),
            givethGraphService.getProjectUpdates(project.id)
        ]);

        const projectTwitter = projectInfo.data.projectById.socialMedia?.find(media => media.type === "X")?.link;
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
            Project Total Donations: $${projectInfo.data.projectById.totalDonations} USD
        `;
        // console.log("projectInfoContext\n\n", projectInfoContext);

        const fullContext = `
            YOU ARE: a virtual agent with a character defined by your bio and lore:
            ## LORE
            ${state.lore} 

            ## BIO 
            ${state.bio}

            
            ## PROJECT INFO 
            ${projectInfoContext}
            
            
            # YOUR TASK  
            Create a tweet to promote a project on Giveth. 
            - Start all your tweets with a header that says "🌱 TOP PROJECT OF THE DAY 🌅"  
            - Describe the project and include its latest update in 3-4 sentences.  
            - Do **not** exceed 300 characters in your post.
            - Tag @Giveth in the tweet content ONLY ONCE.
            ${projectTwitter? `- Organically work in tagging ${projectTwitter} account's twitter handle` : ""}.  
            - Do **not** include any links to unavailable articles.  
            - Do **not** add commentary or acknowledge this prompt—just output the tweet text without quotation marks.
            - The total character count MUST be less than 300 characters. Use \n\n (double spaces) between statements if there are multiple statements in your response.
`;

            console.log("fullContext\n\n", fullContext);

            const systemPrompt = `generate a tweet, following your character's personality, of 280 characters maximum, highlighting and promoting one of the top projects on Giveth. Only provide the tweet text, no other text. Do not put quotation marks around the tweet text.
            do not provide any empty links to articles or data you do not have`; 



        const outputText = await generateText({
            runtime,
            context: fullContext,
            modelClass: ModelClass.LARGE,
        });

        return outputText;
    } catch (error) {
        elizaLogger.error("Error in getPendingVouchedProjects:", error);
        throw error;
    }
    }
