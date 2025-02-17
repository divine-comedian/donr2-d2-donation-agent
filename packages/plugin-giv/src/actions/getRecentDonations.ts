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
   TASK: Review the last 2 messages from {{senderName}} in the conversation.
        
    Your purpose is to extract the number of recent donations to lookup for and return that inside an object.
    generate an object with the following format:
    \`\`\`json
    {
        "number": number
    }
    \`\`\`
    Do not respond with any other text than the object.
    If the user doesn't specify a number, respond with the latest 100 donations.
    If the user specifies a number, respond with that many donations.
    If the number is greater than 100, respond with the latest 100 donations.
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

            // Aggregate Giveth Community of Makers donations
            const makersDonations = sortedDonations.filter(
                donation => donation.project.title === "Giveth Community of Makers"
            );
            const makersTotal = makersDonations.reduce(
                (sum, donation) => sum + (donation.valueUsd || 0), 
                0
            );
            
            // Remove individual makers donations and add aggregated total
            const consolidatedDonations = sortedDonations
                .filter(donation => donation.project.title !== "Giveth Community of Makers")
                .concat(makersTotal > 0 ? [{
                    project: { title: "Giveth Community of Makers" },
                    valueUsd: makersTotal
                }] : []);
            // console.log("consolidatedDonations", consolidatedDonations);
            let outputContext = ` Take the final result of all the recent donations, sorted by highest USD value, be sure to include any donations worth more than $5 in your response
             and respond to the user in your character. Use bullet points and markdown formatting, highlighting the project titles in bold and the amounts
              in regular text. Here are the recent donations to Giveth projects:\n
            ${consolidatedDonations.map((donation) => `- *${donation.project.title}* - $${donation.valueUsd} USD`).join("\n")}
             Summarize the donations in an easily digestible way. Use appropriate emojis for high value donations. Be concise and to the point.`;
            
            const outputText = await generateText({
                runtime,
                context: outputContext,
                modelClass: ModelClass.SMALL,
            });
            console.log("outputText", outputText);
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
