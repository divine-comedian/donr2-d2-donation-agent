import { ActionExample } from "@elizaos/core";

export const getProjectsExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "I wonder what projects are currently top boosted with GIVpower?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me fetch the projects from GIV.",
                action: "BOOSTED_GIVETH_PROJECTS",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Show me the most popular GIV projects right now",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll retrieve the top boosted projects from GIV for you.",
                action: "BOOSTED_GIVETH_PROJECTS",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Which projects have the most GIVpower?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll check which projects currently have the most GIVpower boost.",
                action: "BOOSTED_GIVETH_PROJECTS",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What are the trending projects on Giveth?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll fetch the trending projects based on GIVpower boosts.",
                action: "BOOSTED_GIVETH_PROJECTS",
            },
        },
    ],
];
