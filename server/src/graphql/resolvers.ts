import type { GraphQLResolverMap } from 'apollo-graphql';

function* IDGen() {
	let current = 0;
	while (current < current + 1) {
		yield ++current;
	}
	return current;
}

let gen = IDGen();

const tasks = [{ id: gen.next().value, name: 'clean room', completed: false }];

export const resolvers: GraphQLResolverMap = {
	Query: {
		tasks: () => tasks,
	},
	Mutation: {
		markAsCompleted: (_, { id }) => {
			const findTask = (task: any) => task.id === id;

			const task = tasks.find(findTask);

			if (!task) {
				throw new Error('that task does not exist');
			}
			if (task.completed) {
				throw new Error('that task is already completed');
			}

			task.completed = true;

			const foundIndex = tasks.findIndex(findTask);

			tasks[foundIndex] = task;
			return true;
		},
		addTask: (_, { name }) => {
			console.log('adding task');
			tasks.push({ id: gen.next().value, name, completed: false });
			return true;
		},
		clearAll() {
			tasks.length = 0;
			return true;
		},
	},
};
