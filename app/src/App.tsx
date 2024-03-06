import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TodoListComponent from "./components/TodoList";
import TodoFormComponent from "./components/TodoForm";

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Frello</h1>
        <TodoFormComponent />
        <TodoListComponent />
      </div>
    </QueryClientProvider>
  );
};

export default App;
