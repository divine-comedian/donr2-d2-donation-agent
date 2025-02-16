import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    composeContext,
    generateObjectDeprecated,
    generateText,
    ModelClass,
} from "@elizaos/core";
import { getRecentDonationsExamples } from "../examples";
import { createGivethGraphService } from "../services";

type TakeAmount = {
    number: number;
};

const getRecentDonationsTemplate = `
    Review the recent messages from the conversation:
        {{recentMessages}}
    Your purpose is to extract the number of recent donations to lookup for and return that inside an object.
    generate an object with the following format:
    \`\`\`json
    {
        "number": number
    }
    \`\`\`

    If the user doesn't specify a number, respond with the latest 50 donations.
    If the user specifies a number, respond with that many donations.
    If the number is greater than 50, respond with the latest 50 donations.



`;

export const getRecentDonations: Action = {
    name: "RECENT_DONATIONS",
    similes: ["DONATIONS", "DONATION", "RECENT_DONATIONS", "RECENT_ACTIVITY"],
    description: "Get the recent donations to Giveth projects",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const keywords = [
            "donations",
            "donation",
            "recent donations",
            "recent activity",
            "latest",
        ];
        if (
            !keywords.some((keyword) =>
                message.content.text.toLowerCase().includes(keyword)
            )
        ) {
            return false;
        } else {
            return true;
        }
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        const givethService = createGivethGraphService();

        const buildTakeAmount = async (
            runtime: IAgentRuntime,
            state: State
        ): Promise<number> => {
            const recentDonationsContext = composeContext({
                state,
                template: getRecentDonationsTemplate,
            });

            const take = (await generateObjectDeprecated({
                runtime,
                context: recentDonationsContext,
                modelClass: ModelClass.SMALL,
            })) as TakeAmount;

            return take.number;
        };

        try {
            const take = await buildTakeAmount(runtime, state);
            console.log("take", take);
            const recentDonations = await givethService.getRecentDonations(
                take as number
            );
            const recentDonationsData = recentDonations.data.recentDonations;
            const sortedDonations = [...recentDonationsData].sort(
                (a, b) => (b.valueUsd || 0) - (a.valueUsd || 0)
            );

            let outputContext = ` Take the final result of all the recent donations, sorted by highest USD value, and respond to the user in your chartacter. Use bullet points and markdown formatting. Here are the recent donations to Giveth projects:\n";
            ${sortedDonations.forEach((donation) => {
                console.log(donation);
                outputContext += `- *${donation.project.title}* - $${donation.valueUsd} USD\n`;
            })} Summarize the donations in an easily digestible way, using bullet points and markdown formatting to highlight the project titles. Use appropriate emojis for high value donations. Be concise and to the point.`;
            const outputText = await generateText({
                runtime,
                context: outputContext,
                modelClass: ModelClass.SMALL,
            });

            await callback({
                text: outputText,
            });
        } catch (error) {
            elizaLogger.error("Error in getRecentDonations:", error);
            return callback({ text: "Error getting recent donations" });
        }
    },
    examples: getRecentDonationsExamples as ActionExample[][],
};
