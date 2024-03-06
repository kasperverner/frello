import { Todo } from "../types/todo";
import useTodos from "../hooks/useTodos";

const completeTodo = (todo: Todo, is_done: boolean) =>
  fetch(`http://localhost:3000/api/todos/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...todo, is_done }),
  });

const UpdateButtonComponent = ({ todo }: { todo: Todo }) => {
  const { refetch } = useTodos();

  if (todo.is_done) {
    return (
      <button
        onClick={() => completeTodo(todo, false).then(() => refetch())}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-4 w-full rounded"
      >
        Completed
      </button>
    );
  }

  return (
    <button
      onClick={() => completeTodo(todo, true).then(() => refetch())}
      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mt-4 w-full rounded"
    >
      Pending
    </button>
  );
};

export default UpdateButtonComponent;
