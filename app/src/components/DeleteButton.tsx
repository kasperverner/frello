import useTodos from '../hooks/useTodos';

const deleteTodo = (id: number) =>
  fetch(`http://localhost:3000/api/todos/${id}`, {
    method: "DELETE",
  });

const DeleteButtonComponent = ({ id }: { id: number }) => {
  const { refetch } = useTodos();


  return (
    <button
      onClick={() => deleteTodo(id).then(() => refetch())}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-4 w-full rounded"
    >
      Delete
    </button>
  );
};

export default DeleteButtonComponent;
