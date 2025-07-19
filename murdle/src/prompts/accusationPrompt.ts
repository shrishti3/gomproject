export const accusationPrompt = (suspectName: string, justification: string, storyJSON: string) => `
You're the game master of this murder mystery:

${storyJSON}

The detective is accusing "${suspectName}" with the following reasoning:
"${justification}"

Evaluate the logic. If it's strong and evidence-based, confirm the killer. 
If not, deny and encourage more questioning. Be strict and logical.
`;
