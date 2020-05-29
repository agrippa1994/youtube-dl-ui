import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type DownloadDto = {
  __typename?: 'DownloadDto';
  url: Scalars['String'];
  type: Scalars['String'];
  progress?: Maybe<Scalars['Int']>;
  file?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getData: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  startDownload: Scalars['Boolean'];
};

export type MutationStartDownloadArgs = {
  id: Scalars['String'];
  url: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  download: DownloadDto;
};

export type SubscriptionDownloadArgs = {
  id: Scalars['String'];
};

export type DownloadSubscriptionVariables = {
  id: Scalars['String'];
};

export type DownloadSubscription = { __typename?: 'Subscription' } & {
  download: { __typename?: 'DownloadDto' } & Pick<
    DownloadDto,
    'type' | 'progress' | 'file' | 'url'
  >;
};

export type StartDownloadMutationVariables = {
  id: Scalars['String'];
  url: Scalars['String'];
};

export type StartDownloadMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'startDownload'
>;

export const DownloadDocument = gql`
  subscription Download($id: String!) {
    download(id: $id) {
      type
      progress
      file
      url
    }
  }
`;

/**
 * __useDownloadSubscription__
 *
 * To run a query within a React component, call `useDownloadSubscription` and pass it any options that fit your needs.
 * When your component renders, `useDownloadSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDownloadSubscription({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDownloadSubscription(
  baseOptions?: ApolloReactHooks.SubscriptionHookOptions<
    DownloadSubscription,
    DownloadSubscriptionVariables
  >
) {
  return ApolloReactHooks.useSubscription<
    DownloadSubscription,
    DownloadSubscriptionVariables
  >(DownloadDocument, baseOptions);
}
export type DownloadSubscriptionHookResult = ReturnType<
  typeof useDownloadSubscription
>;
export type DownloadSubscriptionResult = ApolloReactCommon.SubscriptionResult<
  DownloadSubscription
>;
export const StartDownloadDocument = gql`
  mutation StartDownload($id: String!, $url: String!) {
    startDownload(id: $id, url: $url)
  }
`;
export type StartDownloadMutationFn = ApolloReactCommon.MutationFunction<
  StartDownloadMutation,
  StartDownloadMutationVariables
>;

/**
 * __useStartDownloadMutation__
 *
 * To run a mutation, you first call `useStartDownloadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartDownloadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startDownloadMutation, { data, loading, error }] = useStartDownloadMutation({
 *   variables: {
 *      id: // value for 'id'
 *      url: // value for 'url'
 *   },
 * });
 */
export function useStartDownloadMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    StartDownloadMutation,
    StartDownloadMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    StartDownloadMutation,
    StartDownloadMutationVariables
  >(StartDownloadDocument, baseOptions);
}
export type StartDownloadMutationHookResult = ReturnType<
  typeof useStartDownloadMutation
>;
export type StartDownloadMutationResult = ApolloReactCommon.MutationResult<
  StartDownloadMutation
>;
export type StartDownloadMutationOptions = ApolloReactCommon.BaseMutationOptions<
  StartDownloadMutation,
  StartDownloadMutationVariables
>;
