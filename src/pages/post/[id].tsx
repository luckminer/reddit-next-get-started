import { Box, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

export const Post = ({}) => {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? +router.query.id : -1;

  const [{ data, error, fetching }] = usePostQuery({
    pause: id === -1,
    variables: { id },
  });

  if (fetching)
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );

  if (error) return <div>{error.message}</div>;

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading mb={4}>{data?.post?.title}</Heading>
      <div>{data?.post?.text}</div>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
