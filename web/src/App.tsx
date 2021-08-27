import {
	useTasksQuery,
	useMarkAsCompletedMutation,
	useAddTaskMutation,
	useClearAllMutation,
} from 'generated/graphql';

function App() {
	const { loading, error, data: tasks } = useTasksQuery(),
		[markAsCompleted, { error: markError }] = useMarkAsCompletedMutation(),
		[clearAll] = useClearAllMutation(),
		[addTask] = useAddTaskMutation();

	if (loading) {
		return <div>loading...</div>;
	}

	if (error) {
		console.error(error);
		return <div>an error occurred while loading the tasks</div>;
	}

	return (
		<>
			<div>
				{tasks!.tasks.map((task) => {
					if (!task) {
						return <p>error</p>;
					}
					return (
						<>
							<div key={task.id}>
								<div>
									<strong>Task: {task.name}</strong>
									<p>id: {task.id}</p>
									<p>Completed: {task.completed ? 'yes' : 'no'}</p>
								</div>
								<button
									onClick={async () => {
										markAsCompleted({
											variables: {
												id: task.id,
											},
										})
											.then(() => window.location.reload())
											.catch((err) => console.error(err));
									}}
								>
									mark as completed
								</button>
								{markError && (
									<p style={{ color: 'red' }}>Error: {markError.message}</p>
								)}
							</div>
							<hr />
						</>
					);
				})}
				<div style={{ float: 'right' }}>
					<button
						onClick={async () => {
							const tasks = ['clean room', 'washing', 'cooking'];
							addTask({
								variables: {
									name: tasks[Math.floor(Math.random() * tasks.length)],
								},
							})
								.then(() => window.location.reload())
								.catch((err) => console.error(err));
						}}
					>
						add task
					</button>
					<button
						onClick={async () => {
							await clearAll();
							window.location.reload();
						}}
					>
						clear all
					</button>
				</div>
			</div>
		</>
	);
}

export default App;
