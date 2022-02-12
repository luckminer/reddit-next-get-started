import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";
import { gql } from "@urql/core";
import { ApolloCache } from "@apollo/client";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: `Post:${postId}`,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) return;

    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;

    cache.writeFragment({
      id: `Post:${postId}`,
      fragment: gql`
        fragment _ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

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
          await vote({
            variables: { postId, value: 1 },
            update: (cache) => {
              updateAfterVote(1, postId, cache);
            },
          });
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
          await vote({
            variables: { postId, value: -1 },
            update: (cache) => {
              updateAfterVote(-1, postId, cache);
            },
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downdoot-loading"}
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
      />
    </Flex>
  );
};
