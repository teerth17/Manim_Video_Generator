import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRouter from "./routes/chat";
import generateRouter from "./routes/generate"
import path from "path";

dotenv.config();

const app = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

app.use(cors());
app.use(express.json());

app.use("/chat", chatRouter);
app.use("/generate",generateRouter)


app.use('/manim', express.static(path.join(__dirname, '../dist/manim')));


app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
