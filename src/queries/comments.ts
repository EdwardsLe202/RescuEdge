import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCommentsRequest, createCommentRequest } from "@/services/comments";

export const commentsKeys = {
  all: ["comments"] as const,
};

export const useComments = () => {
  return useQuery({
    queryKey: commentsKeys.all,
    queryFn: getCommentsRequest,
    staleTime: 10 * 1000, // 10 seconds stale time
    refetchInterval: 5000, // Poll comments every 5 seconds so anyone's comments show up automatically!
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => createCommentRequest(content),
    onSuccess: () => {
      // Invalidate and refetch all comments queries
      queryClient.invalidateQueries({ queryKey: commentsKeys.all });
    },
  });
};
