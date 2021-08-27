import { gql } from 'apollo-server-core';

export const typeDefs = gql`
	type Query {
		test: String!
		tasks: [Task]!
	}
	type Task {
		id: Int!
		name: String!
		completed: Boolean!
	}
	type Mutation {
		markAsCompleted(id: Int!): Boolean
		addTask(name: String!): Boolean!
		clearAll: Boolean!
	}
`;
