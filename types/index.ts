export enum Role {
  human = "human",
  ai = "ai",
  system = "system",
}
export type Talk = (input: string) => Promise<void>;
export type TemplateMessage = [type: Role, content: string];
