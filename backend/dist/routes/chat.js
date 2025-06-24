"use strict";
// import { RequestHandler, Router,Request,Response } from "express";
// import axios from "axios";
// import dotenv from "dotenv";
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
// const router = Router();
// dotenv.config();
// function extractFirstPythonCodeBlock(text: string): string | null {
//   const match = text.match(/```(?:python)?\s*([\s\S]*?)```/i);
//   return match ? match[1].trim() : null;
// }
// function cleanManimCode(code: string): string {
//   // Remove invalid parameters from Sector initialization
//   code = code.replace(/outer_radius=\d+/g, '');
//   // Add proper imports if missing
//   if (!code.includes('from manim import *')) {
//     code = 'from manim import *\n\n' + code;
//   }
//   // Add proper Scene class if missing
//   if (!code.includes('class')) {
//     code = `
// from manim import *
// class YourScene(Scene):
//     def construct(self):
//         # Your code here
//     `.replace('# Your code here', code);
//   }
//   return code;
// }
// const generateManimScript = async (req: Request, res: Response) => {
//   const userMessage = req.body.message;
//   const errorContext = req.body.errorContext; 
//   if (!userMessage) {
//     res.status(400).json({ error: "Message is required" });
//   }
//   const enhancedPrompt = `
//   You are an expert in Manim animation library. Your task is to generate perfect, error-free Manim scripts that can be run immediately.
// Previous Error Context:
// ${errorContext || "No previous errors"}
// Rules:
// 1. Only use Manim's built-in classes and methods
// 2. Always use the Scene class as the base class
// 3. Include all necessary imports at the top
// 4. Use proper Manim syntax and structure
// 5. Follow Manim's animation patterns
// 6. Only provide Python code, no additional text
// User Request: Create an animation showing how the area of a circle (πr²) is derived using sector rearrangement.
// Manim Requirements:
// 1. Use proper Manim class parameters
// 2. For Sector:
//    - Use angle instead of outer_radius
//    - Use start_angle for positioning
//    - Use color, fill_opacity, and stroke_width for styling
// 3. For Circle:
//    - Use radius parameter
//    - Use color and fill_opacity for styling
// 4. For MathTex:
//    - Use proper LaTeX syntax
//    - Use next_to, to_edge for positioning
// 5. Use smooth animations with appropriate timing
// 6. Add visual indicators and labels as needed
// 7. Use Scene class as the base class
// 8. Include all necessary imports
// 9. Only provide the code, no additional text
// 10. Avoid common errors like duplicate parameter definitions
// 11. Ensure all required parameters are properly specified
// Example Structure:
// from manim import *
// class CircleAreaDerivation(Scene):
//     def construct(self):
//         # Setup circle and labels
//         circle = Circle(radius=2, color=BLUE, fill_opacity=0.5)
//         circle_label = MathTex("A = \\pi r^2").to_edge(UP)
//         radius_line = Line(circle.get_center(), circle.point_at_angle(0), color=RED)
//         radius_label = MathTex("r").next_to(radius_line.get_center(), RIGHT)
//         # Animate initial circle
//         self.play(Create(circle))
//         self.play(Create(radius_line), Write(radius_label))
//         self.play(Write(circle_label))
//         self.wait(1)
//         # Create sectors
//         n_sectors = 12
//         sectors = VGroup(*[
//             Sector(
//                 angle=TAU/n_sectors,
//                 start_angle=i * TAU/n_sectors,
//                 color=interpolate_color(BLUE_A, BLUE_D, i/n_sectors),
//                 fill_opacity=0.7,
//                 stroke_width=1
//             )
//             for i in range(n_sectors)
//         ])
//         # Transform circle to sectors
//         self.play(ReplacementTransform(circle, sectors))
//         self.wait(0.5)
//         # Rest of the code...
// `;
//   try {
//     console.log(process.env.OPENROUTER_API_KEY)
//     const response = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "deepseek/deepseek-chat-v3-0324:free",
//         messages: [
//           {
//             role: "system",
//             content: "You are an expert in Manim animation library. Your task is to generate perfect, error-free Manim scripts that can be run immediately."
//           },
//           {
//             role: "user",
//             content: enhancedPrompt
//           }
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//           "HTTP-Referer": "http://localhost:5173", 
//           "X-Title": "MyManimApp",
//         },
//       }
//     );
//     const LLMResponse = response.data.choices[0].message.content;
//     const manimResponse = extractFirstPythonCodeBlock(LLMResponse);
//     const cleanedCode = cleanManimCode(manimResponse || '');
//     console.log("clean code" ,cleanedCode)
//     res.json({ 
//       code: cleanedCode,
//       errorContext: null  // Clear error context if successful
//     });
//   } catch (err: any) {
//     console.error(err?.response?.data || err.message);
//     res.status(500).json({ 
//       error: "Failed to generate Manim script",
//       errorContext: err?.response?.data || err.message
//     });
//   }
// }
// router.post("/", generateManimScript)
// export default router;
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const router = (0, express_1.Router)();
dotenv_1.default.config();
function extractFirstPythonCodeBlock(text) {
    const match = text.match(/```(?:python)?\s*([\s\S]*?)```/i);
    return match ? match[1].trim() : null;
}
function validateManimCode(code) {
    const errors = [];
    // Check for required imports
    if (!code.includes('from manim import *') && !code.includes('import manim')) {
        errors.push("Missing Manim imports");
    }
    // Check for Scene class
    if (!code.match(/class\s+\w+\s*\(\s*Scene\s*\)/)) {
        errors.push("Missing Scene class definition");
    }
    // Check for construct method
    if (!code.includes('def construct(self)')) {
        errors.push("Missing construct method");
    }
    // Check for common syntax errors
    const invalidPatterns = [
        { pattern: /outer_radius\s*=/, message: "Invalid 'outer_radius' parameter for Sector" },
        { pattern: /inner_radius\s*=/, message: "Invalid 'inner_radius' parameter for Sector" },
        { pattern: /Sector\([^)]*radius[^)]*\)/, message: "Sector should use 'angle' parameter, not radius" },
        { pattern: /\.move_to\(\s*UP\s*\*\s*\d+\s*\)/, message: "Use proper positioning with to_edge() or shift()" },
    ];
    invalidPatterns.forEach(({ pattern, message }) => {
        if (pattern.test(code)) {
            errors.push(message);
        }
    });
    return {
        isValid: errors.length === 0,
        errors
    };
}
function cleanManimCode(code) {
    // Remove problematic parameters
    code = code.replace(/outer_radius\s*=\s*[^,)]+,?/g, '');
    code = code.replace(/inner_radius\s*=\s*[^,)]+,?/g, '');
    // Fix common Sector issues
    code = code.replace(/Sector\(\s*([^)]*)\)/g, (match, params) => {
        // Ensure Sector has proper parameters
        if (!params.includes('angle=')) {
            params = `angle=TAU/6, ${params}`;
        }
        return `Sector(${params})`;
    });
    // Add proper imports if missing
    if (!code.includes('from manim import *')) {
        code = 'from manim import *\n\n' + code;
    }
    // Ensure proper Scene class structure
    if (!code.includes('class') || !code.includes('def construct(self)')) {
        const codeWithoutImports = code.replace(/^from manim import \*\s*\n*/m, '');
        code = `from manim import *

class GeneratedScene(Scene):
    def construct(self):
        ${codeWithoutImports.split('\n').map(line => '        ' + line).join('\n')}
`;
    }
    return code;
}
function createEnhancedPrompt(userMessage, errorContext) {
    const basePrompt = `You are a Manim expert. Generate a complete, error-free Manim script for: "${userMessage}"

CRITICAL REQUIREMENTS:
1. Use ONLY these tested Manim patterns:
   - Circle(radius=2, color=BLUE, fill_opacity=0.3)
   - Square(side_length=2, color=RED, fill_opacity=0.3)
   - Rectangle(width=3, height=2, color=GREEN, fill_opacity=0.3)
   - Line(start=LEFT, end=RIGHT, color=WHITE)
   - Text("Hello", font_size=48)
   - MathTex("x^2 + y^2 = r^2")
   - Sector(angle=PI/3, color=YELLOW, fill_opacity=0.5)
   - Dot(point=ORIGIN, color=RED)
   - Arrow(start=LEFT, end=RIGHT, color=BLUE)

2. POSITIONING (use these exact patterns):
   - .move_to(UP * 2)
   - .shift(RIGHT * 3)
   - .to_edge(UP)
   - .next_to(other_object, RIGHT)

3. ANIMATIONS (use these exact patterns):
   - self.play(Create(object))
   - self.play(Write(text))
   - self.play(Transform(obj1, obj2))
   - self.play(FadeIn(object))
   - self.play(FadeOut(object))
   - self.wait(1)

4. COLORS: Use built-in colors: RED, BLUE, GREEN, YELLOW, WHITE, BLACK, ORANGE, PURPLE

5. STRUCTURE:
from manim import *

class GeneratedScene(Scene):
    def construct(self):
        # Your animation code here
        
6. NEVER use these problematic patterns:
   - outer_radius or inner_radius parameters
   - Complex custom functions
   - Undefined variables
   - Non-existent Manim methods

${errorContext ? `\nPREVIOUS ERROR TO FIX:\n${errorContext}\n\nGenerate corrected code that avoids this error.` : ''}

Generate ONLY the Python code, no explanations.`;
    return basePrompt;
}
const generateManimScript = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const userMessage = req.body.message;
    const errorContext = req.body.errorContext;
    if (!userMessage) {
        res.status(400).json({ error: "Message is required" });
    }
    try {
        const enhancedPrompt = createEnhancedPrompt(userMessage, errorContext);
        console.log("Sending request to OpenRouter...");
        const response = yield axios_1.default.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "deepseek/deepseek-chat-v3-0324:free",
            messages: [
                {
                    role: "system",
                    content: "You are a Manim expert. Generate only working, tested Manim code. No explanations, just code."
                },
                {
                    role: "user",
                    content: enhancedPrompt
                }
            ],
            temperature: 0.3, // Lower temperature for more consistent output
            max_tokens: 2000
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "ManimApp",
            },
        });
        const LLMResponse = response.data.choices[0].message.content;
        console.log("Raw LLM Response:", LLMResponse);
        const extractedCode = extractFirstPythonCodeBlock(LLMResponse);
        if (!extractedCode) {
            throw new Error("No Python code block found in LLM response");
        }
        const cleanedCode = cleanManimCode(extractedCode);
        console.log("Cleaned code:", cleanedCode);
        // Validate the generated code
        const validation = validateManimCode(cleanedCode);
        if (!validation.isValid) {
            console.warn("Code validation issues:", validation.errors);
            // Still return the code, but with validation warnings
            res.json({
                code: cleanedCode,
                warnings: validation.errors,
                errorContext: null
            });
        }
        res.json({
            code: cleanedCode,
            errorContext: null
        });
    }
    catch (err) {
        console.error("Error in generateManimScript:", ((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
        res.status(500).json({
            error: "Failed to generate Manim script",
            details: ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.data) || err.message,
            errorContext: ((_c = err === null || err === void 0 ? void 0 : err.response) === null || _c === void 0 ? void 0 : _c.data) || err.message
        });
    }
});
router.post("/", generateManimScript);
exports.default = router;
