import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();

  const { points, id: postId } = post;

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        icon={<ChevronUpIcon />}
        aria-label="Up vote"
        h={8}
        w={8}
        onClick={async () => {
          if (post.voteStatus === 1) return;

          setLoadingState("updoot-loading");
          await vote({ variables: { postId, value: 1 } });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "updoot-loading"}
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
      />
      {points}
      <IconButton
        aria-label="Down vote"
        icon={<ChevronDownIcon />}
        h={8}
        w={8}
        onClick={async () => {
          if (post.voteStatus === -1) return;

          setLoadingState("downdoot-loading");
          await vote({ variables: { postId, value: -1 } });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downdoot-loading"}
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
      />
    </Flex>
  );
};
