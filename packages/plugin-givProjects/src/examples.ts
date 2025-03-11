import { ActionExample } from "@elizaos/core";

export const getProjectsForReviewExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Can you find me the latest projects that need to be reviewed?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll fetch the most recent projects that need review.",
                action: "REVIEW_GIVETH_PROJECTS",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What new Giveth projects need moderation?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll check for new projects requiring moderation review.",
                action: "REVIEW_GIVETH_PROJECTS",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Show me projects pending review on Giveth",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll retrieve the list of pending projects that need review.",
                action: "REVIEW_GIVETH_PROJECTS",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Are there any new projects that need to be checked for compliance?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll fetch the latest projects that need compliance review.",
                action: "REVIEW_GIVETH_PROJECTS",
            },
        },
    ],
];
