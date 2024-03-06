# Frello tutorial

## Introduction

This tutorial is a step-by-step guide to create a simple todo application using the following technologies:

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Sqlite](https://www.sqlite.org/index.html)
- [Tailwind CSS](https://tailwindcss.com/)

The tutorial is written using Node LTS v18.19.1 and npm v10.5.0.

## Prerequisites

- [ ] [Node.js](https://nodejs.org/en/)
- [ ] [Visual Studio Code](https://code.visualstudio.com/) or any other code editor
- [ ] [Postman](https://www.postman.com/) or any other API client

## Part 01: Create a simple REST API

In the world of web development, creating a RESTful API is a fundamental skill. This tutorial aims to equip you with the knowledge to build a basic CRUD (Create, Read, Update, Delete) API using: Express, TypeScript, and Prisma, with SQLite as the database.

### Step 1: Initialize Your Project

First, create a new directory for your project and navigate into it:

```bash
mkdir frello
cd frello
```

Make a folder for the api, and navigate into it:

```bash
mkdir api
cd api
```

Initialize a new Node.js project:

```bash
npm init -y
```

### Step 2: Install Dependencies

Install the necessary packages:

```bash
npm install express ts-node typescript @prisma/client cors
npm install --save-dev prisma nodemon @types/express @types/node @types/cors
```

- `express` is the web framework for configuring the server.
- `ts-node` enables running TypeScript directly without compiling.
- `typescript` is the TypeScript compiler and language service.
- `@prisma/client` is the Prisma client library for querying the database.
- `cors` is a middleware for enabling Cross-Origin Resource Sharing (CORS).
- `prisma` is the Prisma CLI and object relational mapper (ORM).
- `nodemon` is used for hot reloading during development to allow the server to restart automatically when changes are made.
- `@types/express` provides TypeScript types for Express and its middleware.
- `@types/node` provides TypeScript types for Node.js core modules.
- `@types/cors` provides TypeScript types for cors middleware.

### Step 3: Configure TypeScript and Prisma

Create a `tsconfig.json` file for TypeScript configuration:

```bash
npx tsc --init
```

Initialize Prisma in your project:

```bash
npx prisma init
```

This creates a `prisma` directory with a `schema.prisma` file, which is where you'll define your database models.

### Step 4: Define Your Data Model

In `prisma/schema.prisma`, configure your data source to use SQLite:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Todo {
  id          Int     @id @default(autoincrement())
  name        String
  description String?
  is_done   Boolean @default(false)
}
```

This defines a simple `Todo` model with an autoincrementing `id`, `title`, an optional `description`, and a `is_done` indicator.

### Step 5: Generate Prisma Client

Generate the Prisma client:

```bash
npx prisma generate
```

Create a `src/utilities/db.server.ts` file:

```bash
mkdir src
mkdir src/utilities
touch src/utilities/db.server.ts
```

In `src/utilities/db.server.ts`, import the Prisma client:

```typescript
import { PrismaClient } from "@prisma/client";

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient();
}

const db = global.__db;

export default db;
```

The client is created and stored in a global variable to ensure it's only instantiated once.

### Step 6: Migrate the Database

Run the migration to create the database tables:

```bash
npx prisma migrate dev --name init
```

This creates a `migrations` directory with a new migration file that contains the SQL commands to create the database tables.

This will also create a `dev.db` file in the root of your project, which is the SQLite database file.

### Step 7: Create the Express Server

Create `index.ts` file inside the `src` directory:

```bash
touch src/index.ts
```

In `src/index.ts`, import the necessary modules and create a basic Express server:

```typescript
import express from 'express';
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

### Step 8: Explaining RESTful methods

Before defining the routes, here's a brief explanation of the HTTP methods and their corresponding CRUD operations:

- `GET` - Read from the server
- `POST` - Create a new resource
- `PUT` - Update an existing resource
- `DELETE` - Delete an existing resource

For more information on RESTful APIs, refer to the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

For more information on status codes, refer to the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

### Step 9: Define the routes

Create a `src/routes/todos.ts` file:

```bash
mkdir src/routes
touch src/routes/todos.ts
```

The `todos` router will handle the CRUD operations for your API.

In `src/routes/todos.ts`, define the routes for your API:

#### GET /todos - Get all todos

```typescript
import express from 'express';
import db from '../utilities/db.server';

const router = express.Router();

router.get('/', async (req, res) => {
  const todos = await db.todo.findMany();
  res.json(todos);
});

export default router;
```

#### GET /todos/:id - Get an todo by ID

```typescript
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const todo = await db.todo.findUnique({
    where: { id: parseInt(id) },
  });
  res.json(todo);
});
```

#### POST /todos - Create a new todo

```typescript
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  const todo = await db.todo.create({
    data: { title, description },
  });
  res.status(201).json(todo);
});
```

#### PUT /todos/:id - Update an todo by ID

```typescript
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, is_done } = req.body;
  const todo = await db.todo.update({
    where: { id: parseInt(id) },
    data: { title, description, is_done },
  });
  res.status(204).send();
});
```

#### DELETE /todos/:id - Delete an todo by ID

```typescript
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.todo.delete({
    where: { id: parseInt(id) },
  });
  res.status(204).send();
});
```

### Step 10: Add the router to the server

In `src/index.ts`, import the `todos` router and add it to the server:

```typescript
import express from 'express';
import todosRouter from './routes/todos';

const app = express();
app.use(express.json());

// Add the routers
app.use('/api/todos', todosRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

### Step 11: Run the server

Add a `dev` and `start` script to your `package.json`:

```json
"scripts": {
  "dev": "nodemon --exec ts-node src/index.ts",
  "start": "ts-node src/index.ts",
}
```

Start the server:

```bash
npm run dev
```

You can now test your API using an API client like Postman.

### API Conclusion

In this part of the tutorial, you learned how to create a simple REST API using Express, TypeScript, and Prisma. You set up your project environment, defined your data model, and implemented the CRUD operations for your API. In the next part, you will create a simple frontend using React and Tailwind CSS to interact with your API.

## Part 02: Create a simple React frontend

In this part of the tutorial, you will create a simple frontend using React and Tailwind CSS to interact with the REST API you built in Part 01. You will learn how to set up a new React project, create components to display and manage your todo items, and make HTTP requests to your API using the `fetch` API.

For more information on the `fetch` API, refer to the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

### Step 1: Create a new React project

Navigate back out to the `frello` folder and initiate a new React project using the Vite compiler:

```bash
cd ..
npx create-vite@latest app --template react-ts
cd app
npm install
```

### Step 2: Install Tailwind CSS

Install Tailwind CSS and its dependencies:

```bash
npm install tailwindcss@latest postcss@latest autoprefixer@latest
```

Create a `tailwind.config.js` file:

```bash
npx tailwindcss init -p
```

In `src/index.css`, import Tailwind CSS:

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

In `tailwind.config`, update the content to define which files to scan for classes:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Step 3: Create a `Todo` type

Create a `src/types/todo.ts` file:

```bash
mkdir src/types
touch src/types/todo.ts
```

In `src/types/todo.ts`, define the `Todo` type:

```typescript
export type Todo = {
  id: number;
  title: string;
  description?: string;
  is_done: boolean;
};
```

### Step 4: Create a `Todo` component

The convention in React is to create a separate component for each UI element.

Compnent files are named like the component itself, with a `.tsx` extension to indicate that they contain JSX.

Create a `src/components/Todo.tsx` file:

```bash
mkdir src/components
touch src/components/Todo.tsx
```

In `src/components/Todo.tsx`, define the `Todo` component:

```tsx
import type { Todo } from '../types/todo';

type Props = {
  todo: Todo;
};

const TodoComponent = ({ todo }: Props) => {
  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-bold">{todo.title}</h2>
      {todo.description && <p className="mt-2">{todo.description}</p>}
    </div>
  );
};

export default TodoComponent;
```

### Step 5: Create a `TodoList` component

Create a `src/components/TodoList.tsx` file:

```bash
touch src/components/TodoList.tsx
```

In `src/components/TodoList.tsx`, define the `TodoList` component:

```tsx
import { useEffect, useState } from 'react';
import type { Todo } from '../types/todo';
import TodoComponent from './Todo';

const TodoListComponent = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/todos')
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  return (
    <div className="grid gap-4 grid-cols-3 pt-4">
      {todos.map((todo) => (
        <TodoComponent key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoListComponent;
```

`useState` is a React hook that allows you to manage state in functional components. In this case, it's used to store the todo items fetched from the API.

`useEffect` is a React hook that runs after the first render and after every update. It's used to fetch the todo items from the API and update the state.

For more information on React hooks, refer to the [official documentation](https://reactjs.org/docs/hooks-intro.html).

### Step 6: Create a `TodoForm` component

Create a `src/components/TodoForm.tsx` file:

```bash
touch src/components/TodoForm.tsx
```

In `src/components/TodoForm.tsx`, define the `TodoForm` component:

```tsx
import { useState } from 'react';
import type { Todo } from '../types/todo';

const TodoFormComponent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTodo: Partial<Todo> = {
      title,
      description,
    };

    fetch('http://localhost:3000/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodo),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
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
```

### Step 7: Add the components to the `App` component

In `src/App.tsx`, import the `TodoList` and `TodoForm` components and add them to the `App` component:

```tsx
import TodoListComponent from './components/TodoList';
import TodoFormComponent from './components/TodoForm';

const App = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Frello</h1>
      <TodoFormComponent />
      <TodoListComponent />
    </div>
  );
}

export default App;
```

### Step 8: Create a `DeleteButton` component

Create a `src/components/DeleteButton.tsx` file:

```bash
touch src/components/DeleteButton.tsx
```

In `src/components/DeleteButton.tsx`, define the `DeleteButton` component:

```tsx
type Props = {
  id: number;
};

const DeleteButtonComponent = (props: Props) => {
  const deleteTodo = (id: number) => {
    fetch(`http://localhost:3000/api/todos/${id}`, {
      method: "DELETE",
    });
  };

  return (
    <button
      onClick={() => deleteTodo(props.id)}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-4 w-full rounded"
    >
      Delete
    </button>
  );
};

export default DeleteButtonComponent;
````

### Step 9: Create an `UpdateButton` component

Create a `src/components/UpdateButton.tsx` file:

```bash
touch src/components/UpdateButton.tsx
```

In `src/components/UpdateButton.tsx`, define the `UpdateButton` component:

```tsx
import { Todo } from "../types/todo";

const completeTodo = (todo: Todo, is_done: boolean) => {
  fetch(`http://localhost:3000/api/todos/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...todo, is_done }),
  });
};

type Props = {
  todo: Todo;
};

const UpdateButtonComponent = ({ todo }: Props) => {
  console.log('props', todo)

  if (todo.is_done) {
    return (
      <button
        onClick={() => completeTodo(todo, false)}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-4 w-full rounded"
      >
        Completed
      </button>
    );
  }

  return (
    <button
      onClick={() => completeTodo(todo, true)}
      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mt-4 w-full rounded"
    >
      Pending
    </button>
  );
};

export default UpdateButtonComponent;
```

### Step 10: Add the `DeleteButton` and `UpdateButton` components to the `Todo` component

In `src/components/Todo.tsx`, import the `DeleteButton` and `UpdateButton` components and add them to the `Todo` component:

```tsx
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
```

### Step 11: Run the frontend

Start the development server:

```bash
npm run dev
```

You can now view your simple todo application at `http://localhost:5173`.

### APP Conclusion

In this part of the tutorial, you learned how to create a simple frontend using React and Tailwind CSS to interact with the REST API you built in Part 01. You set up a new React project, created components to display and manage your todo items, and made HTTP requests to your API using the `fetch` API.

## Part 03: Advanced state management with TanStack Query

If you test the application, you will notice that the UI does not update when you add, update, or delete a todo item. This is because the state of the application is not being managed properly.

In this part of the tutorial, you will learn how to manage the state of your application using TanStack Query. TanStack Query is a data fetching and caching library for React that provides a set of hooks and utilities for managing the state of your application.

For more information on TanStack Query, refer to the [official documentation](https://tanstack.com/query).

### Step 1: Install TanStack Query

Install TanStack Query and its dependencies:

```bash
npm install @tanstack/react-query
```

### Step 2: Set up the query client

In `src/App.tsx`, import the `QueryClient` and `QueryClientProvider` from TanStack Query and set up the query client:

```tsx
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
```

By wrapping the `App` component with the `QueryClientProvider`, you can access the query client from any component in the application.

### Step 3: Create a `useTodos` hook

Create a `src/hooks/useTodos.ts` file:

```bash
mkdir src/hooks
touch src/hooks/useTodos.ts
```

In `src/hooks/useTodos.ts`, define the `useTodos` hook:

```tsx
import { useQuery } from "@tanstack/react-query";
import type { Todo } from "../types/todo";

const fetchTodos = async () => {
  const res = await fetch("http://localhost:3000/api/todos");
  return res.json();
};

const useTodos = () => useQuery<Todo[]>({
  queryKey: ["todos"],
  queryFn: fetchTodos,
})

export default useTodos;
```

The `useQuery` hook is used to fetch the todo items from the API and manage the state of the application.

### Step 4: Update the `TodoList` component

In `src/components/TodoList.tsx`, import the `useTodos` hook and update the `TodoList` component:

```tsx
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
````

The `useTodos` hook is used to fetch the todo items from the API and manage the state of the application.

### Step 5: Update the `TodoForm` component

In `src/components/TodoForm.tsx`, import the `useTodos` hook and update the `TodoForm` component:

```tsx
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
````

The `useTodos` hook is used to refetch the todo items from the API and update the state of the application.

### Step 6: Update the `UpdateButton` component

In `src/components/UpdateButton.tsx`, import the `useTodos` hook and update the `UpdateButton` component:

```tsx
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
````

The `useTodos` hook is used to refetch the todo items from the API and update the state of the application, when a todo item is updated.

### Step 7: Update the `DeleteButton` component

In `src/components/DeleteButton.tsx`, import the `useTodos` hook and update the `DeleteButton` component:

```tsx
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

```

The `useTodos` hook is used to refetch the todo items from the API and update the state of the application, when a todo item is deleted.
