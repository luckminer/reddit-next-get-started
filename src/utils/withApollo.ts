import { withApollo as createWithAppolo } from "next-apollo";
import { InMemoryCache, ApolloClient } from "@apollo/client";
import { PaginatedPosts } from "../generated/graphql";

const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL as string,
  credentials: "include",

  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: [],
            merge(
              existing: PaginatedPosts | undefined,
              incoming: PaginatedPosts
            ): PaginatedPosts {
              return {
                ...incoming,
                posts: [...(existing?.posts || []), ...incoming.posts],
              };
            },
          },
        },
      },
    },
  }),
});

export const withAppolo = createWithAppolo(apolloClient);
