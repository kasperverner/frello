import { useQuery } from "@tanstack/react-query";
import type { Todo } from "../types/todo";

const fetchTodos = async () => {
  const res = await fetch("http://localhost:3000/api/todos");
  return res.json();
};

const useTodos = () =>
  useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

export default useTodos;
