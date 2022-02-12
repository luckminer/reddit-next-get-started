import { usePostQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetPostFromUrl = () => {
  const id = useGetIntId();

  const post = usePostQuery({
    skip: id === -1,
    variables: { id },
  });

  return post;
};
