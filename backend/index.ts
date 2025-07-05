import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRouter from "./routes/chat";
import generateRouter from "./routes/generate"
import path from "path";

dotenv.config();

const app = express();
const port: number = parseInt(process.env.PORT || '3000', 10);
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));


app.use(express.json());

app.use("/chat", chatRouter);
app.use("/generate",generateRouter)


app.use('/manim', express.static(path.join(__dirname, '../dist/manim')));


app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
