export enum Role {
  human = "human",
  ai = "ai",
  system = "system",
}
export interface SESSION_WITH_MESSAGES {
  id: string;
  messages: {
    type: string;
    content: string;
  }[];
}
export type Talk = (input: string) => Promise<void>;
export type TemplateMessage = [type: Role, content: string];
