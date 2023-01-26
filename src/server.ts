import express, { Express } from "express";
import { classesRoute } from "./routes/classes-routes";

const app: Express = express();
app.use(express.json());

const port = process.env.PORT;

app.use("/classes", classesRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
