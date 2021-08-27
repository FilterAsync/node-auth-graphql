import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};


export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type Mutation = {
  __typename?: 'Mutation';
  markAsCompleted?: Maybe<Scalars['Boolean']>;
  addTask: Scalars['Boolean'];
  clearAll: Scalars['Boolean'];
};


export type MutationMarkAsCompletedArgs = {
  id: Scalars['Int'];
};


export type MutationAddTaskArgs = {
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  test: Scalars['String'];
  tasks: Array<Maybe<Task>>;
};

export type Task = {
  __typename?: 'Task';
  id: Scalars['Int'];
  name: Scalars['String'];
  completed: Scalars['Boolean'];
};


export type AddTaskMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type AddTaskMutation = { __typename?: 'Mutation', addTask: boolean };

export type ClearAllMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearAllMutation = { __typename?: 'Mutation', clearAll: boolean };

export type MarkAsCompletedMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type MarkAsCompletedMutation = { __typename?: 'Mutation', markAsCompleted?: Maybe<boolean> };

export type TasksQueryVariables = Exact<{ [key: string]: never; }>;


export type TasksQuery = { __typename?: 'Query', tasks: Array<Maybe<{ __typename?: 'Task', id: number, name: string, completed: boolean }>> };


export const AddTaskDocument = gql`
    mutation AddTask($name: String!) {
  addTask(name: $name)
}
    `;
export type AddTaskMutationFn = Apollo.MutationFunction<AddTaskMutation, AddTaskMutationVariables>;

/**
 * __useAddTaskMutation__
 *
 * To run a mutation, you first call `useAddTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTaskMutation, { data, loading, error }] = useAddTaskMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useAddTaskMutation(baseOptions?: Apollo.MutationHookOptions<AddTaskMutation, AddTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddTaskMutation, AddTaskMutationVariables>(AddTaskDocument, options);
      }
export type AddTaskMutationHookResult = ReturnType<typeof useAddTaskMutation>;
export type AddTaskMutationResult = Apollo.MutationResult<AddTaskMutation>;
export type AddTaskMutationOptions = Apollo.BaseMutationOptions<AddTaskMutation, AddTaskMutationVariables>;
export const ClearAllDocument = gql`
    mutation ClearAll {
  clearAll
}
    `;
export type ClearAllMutationFn = Apollo.MutationFunction<ClearAllMutation, ClearAllMutationVariables>;

/**
 * __useClearAllMutation__
 *
 * To run a mutation, you first call `useClearAllMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClearAllMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [clearAllMutation, { data, loading, error }] = useClearAllMutation({
 *   variables: {
 *   },
 * });
 */
export function useClearAllMutation(baseOptions?: Apollo.MutationHookOptions<ClearAllMutation, ClearAllMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ClearAllMutation, ClearAllMutationVariables>(ClearAllDocument, options);
      }
export type ClearAllMutationHookResult = ReturnType<typeof useClearAllMutation>;
export type ClearAllMutationResult = Apollo.MutationResult<ClearAllMutation>;
export type ClearAllMutationOptions = Apollo.BaseMutationOptions<ClearAllMutation, ClearAllMutationVariables>;
export const MarkAsCompletedDocument = gql`
    mutation MarkAsCompleted($id: Int!) {
  markAsCompleted(id: $id)
}
    `;
export type MarkAsCompletedMutationFn = Apollo.MutationFunction<MarkAsCompletedMutation, MarkAsCompletedMutationVariables>;

/**
 * __useMarkAsCompletedMutation__
 *
 * To run a mutation, you first call `useMarkAsCompletedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkAsCompletedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markAsCompletedMutation, { data, loading, error }] = useMarkAsCompletedMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMarkAsCompletedMutation(baseOptions?: Apollo.MutationHookOptions<MarkAsCompletedMutation, MarkAsCompletedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkAsCompletedMutation, MarkAsCompletedMutationVariables>(MarkAsCompletedDocument, options);
      }
export type MarkAsCompletedMutationHookResult = ReturnType<typeof useMarkAsCompletedMutation>;
export type MarkAsCompletedMutationResult = Apollo.MutationResult<MarkAsCompletedMutation>;
export type MarkAsCompletedMutationOptions = Apollo.BaseMutationOptions<MarkAsCompletedMutation, MarkAsCompletedMutationVariables>;
export const TasksDocument = gql`
    query Tasks {
  tasks {
    id
    name
    completed
  }
}
    `;

/**
 * __useTasksQuery__
 *
 * To run a query within a React component, call `useTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTasksQuery({
 *   variables: {
 *   },
 * });
 */
export function useTasksQuery(baseOptions?: Apollo.QueryHookOptions<TasksQuery, TasksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TasksQuery, TasksQueryVariables>(TasksDocument, options);
      }
export function useTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TasksQuery, TasksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TasksQuery, TasksQueryVariables>(TasksDocument, options);
        }
export type TasksQueryHookResult = ReturnType<typeof useTasksQuery>;
export type TasksLazyQueryHookResult = ReturnType<typeof useTasksLazyQuery>;
export type TasksQueryResult = Apollo.QueryResult<TasksQuery, TasksQueryVariables>;