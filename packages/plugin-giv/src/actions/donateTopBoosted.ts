import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
} from "@elizaos/core";
import { donateTopBoostedExamples } from "../examples";
import { createGivethGraphService } from "../services";
import { DonationHandlerService } from "../services";
import { DonationHandlerAddress } from "../constants";
import { Donation } from "../types";
import { celoAlfajores } from "viem/chains";
import { parseEther } from "viem";
export const donateTopBoostedAction: Action = {
    name: "DONATE_TOP_BOOSTED",
    similes: ["DONATE", "TIP", "BOOSTED", "GIVPOWER"],
    description: "Donate some tokens to the top boosted projects on Giveth through the donation handler.",
    validate: async (runtime) => {
        const privateKey = runtime.getSetting("EVM_PRIVATE_KEY");
        if (!privateKey) {
            return false;
        }
        return true;
    },
    handler: async (runtime: IAgentRuntime, message: Memory, state: State, options: { [key: string]: unknown }, callback: HandlerCallback) => {
        const givethGraphService = createGivethGraphService();
        const donationHandlerService = DonationHandlerService(runtime.getSetting("EVM_PRIVATE_KEY"));
        const chainId = DonationHandlerAddress.ALFAJORES.networkId;
        try {
            givethGraphService.getProjects().then(async (projects) => {
                const topProject = projects.data.allProjects.projects[0];
                const address = topProject.addresses.find(addr => addr.networkId === chainId);
                console.log("address", address)
                const donation: Donation = {
                    recipient: address.address,
                    amount: parseEther("0.01"),
                    projectId: topProject.id,
                }
                const donationHash = await donationHandlerService.sendDonation(donation, celoAlfajores);
                console.log("donationHash", donationHash)
                callback({
                    text: `Donation of ${donation.amount} CELO sent to ${topProject.title}, here is the hash: ${donationHash}`,
                });
            });
        } catch (error) {
            elizaLogger.error("Error in Giveth plugin handler:", error);
            callback({
                text: `Error donating to the top boosted project: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: donateTopBoostedExamples as ActionExample[][],
} as Action;
