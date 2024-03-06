import type { Todo } from "../types/todo";
import DeleteButtonComponent from "./DeleteButton";
import UpdateButtonComponent from "./UpdateButton";

type Props = {
  todo: Todo;
};

const TodoComponent = ({ todo }: Props) => {
  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-bold">{todo.title}</h2>
      {todo.description && <p className="mt-2">{todo.description}</p>}
      <UpdateButtonComponent todo={todo} />
      <DeleteButtonComponent id={todo.id} />
    </div>
  );
};

export default TodoComponent;
