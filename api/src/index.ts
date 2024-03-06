// Import the dependencies
import express from "express";
import cors from "cors";
import todosRouter from "./routers/todos";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Add the routers
app.use("/api/todos", todosRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
