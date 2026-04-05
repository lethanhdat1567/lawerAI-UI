export type IdeaStatus = "PENDING" | "COMPLETED" | "FAILED";

export type BlogIdea = {
  id: number;
  name: string;
  description: string;
  status: IdeaStatus;
  createdAt: string;
  updatedAt: string;
};

export type ScheduleBlogSystem = {
  id: string;
  isActive: boolean;
  model: string;
  prompt: string;
  updatedAt: string;
};
