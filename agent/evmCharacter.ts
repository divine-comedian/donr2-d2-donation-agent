import { evmPlugin } from "@elizaos/plugin-evm";
import {
    defaultCharacter,
    Character,
    ModelProviderName,
    Clients,
} from "@elizaos/core";
// import { defaultCharacter } from "../packages/core/src/defaultCharacter.ts";
// import {
//     Character,
//     ModelProviderName,
//     Clients,
// } from "../packages/core/src/types";

export const evmCharacter: Character = {
    ...defaultCharacter,
    name: "Player One",
    plugins: [evmPlugin],
    clients: [Clients.DISCORD],
    modelProvider: ModelProviderName.OPENAI,
    settings: {
        chains: {
            evm: ["optimism", "mainnet", "base"],
        },
    },
};
