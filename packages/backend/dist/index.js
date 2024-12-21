"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const recordRoutes_1 = __importDefault(require("./routes/recordRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/records", recordRoutes_1.default);
app.get("/", (req, res) => {
    res.json({ message: "Privasee API is running" });
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
