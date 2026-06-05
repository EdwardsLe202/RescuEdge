import axios from "axios";

export interface IComment {
  id: string;
  author: string;
  avatar: string;
  role: string;
  content: string;
  timestamp: string;
  isTagged: boolean;
}

export interface IGetCommentsResponse {
  comments: IComment[];
}

export interface ICreateCommentResponse {
  comment: IComment;
}

export const getCommentsRequest = async (): Promise<IGetCommentsResponse> => {
  try {
    const response = await axios.get("/api/comments");
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.error || error?.message || "Failed to fetch comments";
    throw new Error(message);
  }
};

export const createCommentRequest = async (content: string): Promise<ICreateCommentResponse> => {
  try {
    const response = await axios.post("/api/comments", { content });
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.error || error?.message || "Failed to create comment";
    throw new Error(message);
  }
};
