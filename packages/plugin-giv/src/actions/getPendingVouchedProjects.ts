import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
} from "@elizaos/core";
import { getPendingVouchedProjectsExamples } from "../examples";
import { createGivethGraphService } from "../services";

export const getPendingVouchedProjects: Action = {
    name: "PENDING_VOUCHED_PROJECTS",
    similes: ["PENDING", "VOUCHED", "VERIFY"],
    description:
        "Check for Giveth projects that have 3+ vouches but aren't verified",
    validate: async () => true,
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        const givethService = createGivethGraphService();
        let unverifiedProjects: string[] = [];

        try {
            // Get DeVouch attestations
            const attestationsResponse =
                await givethService.getDeVouchAttestations();
            const attestations = attestationsResponse.data.projectAttestations;

            // Filter for projects with 3+ vouches
            const projectsWithEnoughVouches = attestations.filter(
                (attest) => attest.project.attests.length >= 1
            );

            // Check verification status for each project
            for (const project of projectsWithEnoughVouches) {
                const projectResponse = await givethService.getProjectById(
                    parseInt(project.project.projectId)
                );

                if (!projectResponse.data.projectById.verified) {
                    unverifiedProjects.push(
                        projectResponse.data.projectById.title
                    );
                }
            }

            // Prepare output message
            let outputText = "";
            if (unverifiedProjects.length > 0) {
                outputText =
                    "The following projects have 3+ vouches but are not verified:\n";
                unverifiedProjects.forEach((title) => {
                    console.log(title);
                    outputText += `- ${title}\n`;
                });
                outputText +=
                    "\nPlease review these projects for verification.";
            } else {
                outputText = "No unverified projects with 3+ vouches found.";
            }

            await callback({ text: outputText });
        } catch (error) {
            elizaLogger.error("Error in getPendingVouchedProjects:", error);
            throw error;
        }
    },
    examples: getPendingVouchedProjectsExamples as ActionExample[][],
} as Action;
