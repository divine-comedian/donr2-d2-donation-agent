import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    ModelClass,
    generateObjectDeprecated,
    composeContext,
    generateText,
} from "@elizaos/core";
import { getPendingVouchedProjectsExamples } from "../examples";
import { createGivethGraphService, generateInput } from "../services";
import { NumberObject, Project } from "../types";

const getVouchedThresholdTemplate = `
   TASK: Review the last 2 messages from {{recentMessages}} in the conversation that were sent by the user.
        
    Your purpose is to extract the number of vouches a project needs to have from Giveth Verifiers and return the number inside a json object.
    generate an object with the following format:
    \`\`\`json
    {
        "number": number
    }
    \`\`\`
    
    Do not respond with any other text than the number.
    If the user doesn't specify a number, respond with 3.
    If the user specifies a number, respond with that number.

    For example, if the user says "I want to check for projects that have 5 vouches", you should respond with:  5
`;

export const getPendingVouchedProjects: Action = {
    name: "PENDING_VOUCHED_PROJECTS",
    similes: ["PENDING", "VOUCHED", "VERIFY", "VERIFICATION", "VOUCHES"],
    description:
        "Check for Giveth projects that have a target threshold of vouches but aren't yet issued the verified status",
    validate: async () => true,
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        const givethService = createGivethGraphService();
        const limit: number = 100;
        let unverifiedProjects: Set<Project> = new Set<Project>();

        const buildTargetVouches = async (
            runtime: IAgentRuntime,
            state: State
        ): Promise<number> => {
            const vouchedThresholdContext = composeContext({
                state,
                template: getVouchedThresholdTemplate,
            });

            const threshold = (await generateObjectDeprecated({
                runtime,
                context: vouchedThresholdContext,
                modelClass: ModelClass.SMALL,
            })) as NumberObject;

            return threshold.number;
        };
        
        try {
           const targetVouches = await buildTargetVouches(runtime, state);
            console.log("targetVouches", targetVouches);
            // Get DeVouch attestations
            const attestationsResponse =
                await givethService.getDeVouchAttestations(limit);
            const attestations = attestationsResponse.data.projectAttestations;

            // Filter for projects with 3+ vouches
            const projectsWithEnoughVouches = attestations.filter(
                (attest) => attest.project.attests.length >= targetVouches
            );

            // Check verification status for each project
            for (const project of projectsWithEnoughVouches) {
                const projectResponse = await givethService.getProjectById(
                    parseInt(project.project.projectId)
                );

                if (!projectResponse.data.projectById.verified) {
                    unverifiedProjects.add({
                        title: projectResponse.data.projectById.title,
                        slug: projectResponse.data.projectById.slug,
                    });
                }
            }

            // Prepare output message
            let outputContext = "";
            if (unverifiedProjects.size > 0) {
                outputContext = `Parse through this list of projects and let the user know that they need to be verified and meet the threshold of ${targetVouches} vouches.`;
                unverifiedProjects.forEach((project) => {
                    console.log(project.title);
                    outputContext += `- [${project.title}](https://giveth.io/project/${project.slug})\n`;
                });
               outputContext += `ensure to remove any duplicate entries. in the above list. be concise and short in your answer.`;
            } else {
                outputContext = `Inform the user that there are no unverified projects with ${targetVouches}+ vouches were found.`;
            }

            const outputSystemPrompt = `
            You are a helpful assistant that checks for data about projects on Giveth. Read through the information and look up how many vouches each project has.
            Ensure you preserve the original format of the list items, keeping the markdown formatting with the project title and link to the project. Remove any duplicate entries, and don't mention that you removed duplicates in your response.
            in your response consider the following information about your character: ${state.lore}
            be concise and short in your answer.
            `;

            const outputText = await generateText({
                runtime,
                context: outputContext,
                modelClass: ModelClass.SMALL,
                customSystemPrompt: outputSystemPrompt,
            });

            await callback({ text: outputText });
        } catch (error) {
            elizaLogger.error("Error in getPendingVouchedProjects:", error);
            throw error;
        }
    },
    examples: getPendingVouchedProjectsExamples as ActionExample[][],
} as Action;
