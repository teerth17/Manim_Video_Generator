"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const chat_1 = __importDefault(require("./routes/chat"));
const generate_1 = __importDefault(require("./routes/generate"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/chat", chat_1.default);
app.use("/generate", generate_1.default);
app.use('/manim', express_1.default.static(path_1.default.join(__dirname, '../dist/manim')));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
