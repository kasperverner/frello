import { useState } from "react";
import type { Todo } from "../types/todo";
import useTodos from "../hooks/useTodos";

const TodoFormComponent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { refetch } = useTodos();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTodo: Partial<Todo> = {
      title,
      description,
    };

    fetch("http://localhost:3000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    })
      .then(() => refetch())
      .then(() => {
        setTitle("");
        setDescription("");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="p-2 border rounded-md"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="p-2 border rounded-md"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
        Add Todo
      </button>
    </form>
  );
};

export default TodoFormComponent;
