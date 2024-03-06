import useTodos from "../hooks/useTodos";
import TodoComponent from "./Todo";

const TodoListComponent = () => {
  const { data, isLoading } = useTodos();

  if (isLoading) return <p className="pt-4 text-xl text-center">Loading...</p>;

  return (
    <div className="grid gap-4 grid-cols-3 pt-4">
      {data?.map((todo) => (
        <TodoComponent key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoListComponent;
