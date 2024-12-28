"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const express_1 = __importDefault(require("express"));
const prompts_1 = require("./prompts");
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
// const CLAUDE_API_KEY = (process.env.CLAUDE_API_KEY)
const anthropic = new sdk_1.default();
const app = (0, express_1.default)();
app.listen(3000);
app.use(express_1.default.json());
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body.prompt;
    const response = yield anthropic.messages.create({
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 200,
        system: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
    });
    const answer = response.content[0].text;
    if (answer == "react") {
        res.json({
            prompts: [prompts_1.BASE_PROMPT, react_1.basePrompt],
        });
        return;
    }
    if (answer == "node") {
        res.json({
            prompts: [node_1.basePrompt],
        });
        return;
    }
    res.status(403).json({ message: "You can't access this!" });
    return;
}));
// async function main() {
//   anthropic.messages
//     .stream({
//       messages: [
//         {
//           role: "user",
//           content:
//             "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos.\n\nUse stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.",
//         },
//       ],
//       model: "claude-3-5-sonnet-20241022",
//       max_tokens: 1024,
//       system: getSystemPrompt(),
//     })
//     .on("text", (text) => {
//       console.log(text);
//     });
// }
// main();
