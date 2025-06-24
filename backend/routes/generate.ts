// import { Router } from "express";
// import axios from "axios"
// import fs from 'fs';
// import { exec } from 'child_process';
// import path from 'path';
// import util from "util";

// const router = Router();

// const execPromise = util.promisify(exec);

// const MANIM_SCRIPT_PATH = path.join(__dirname, "../../dist/manim/run.py");
// const OUTPUT_DIR = path.join(__dirname, "../../dist/videos");
// const OUTPUT_FILENAME = "output.mp4";

// // Helper to extract Python code block
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
// // POST /generate
// router.post("/", async (req, res) => {

  
//   // try {
//   //   const rawPrompt: string = req.body.prompt;
//   //   if (!rawPrompt) {
//   //     res.status(400).json({ error: "Prompt is required" });
//   //     return
//   //   }

//   //   const code = extractFirstPythonCodeBlock(rawPrompt);
//   //   if (!code) {
//   //     res.status(400).json({ error: "No valid Python code block found in prompt." });
//   //     return
//   //   }

//   //   const cleanedCode = cleanManimCode(code);
//   //   console.log("cleaned code", cleanedCode)
//   //   const sceneMatch = cleanedCode.match(/class\s+(\w+)\s*\(\s*Scene\s*\)/);
//   //   const sceneClass = sceneMatch ? sceneMatch[1] : null;

//   //   if (!sceneClass) {
//   //     res.status(400).json({ error: "No Scene class found in Manim script." });
//   //     return
//   //   }

//   //   // Ensure dist directories exist
//   //   fs.mkdirSync(path.dirname(MANIM_SCRIPT_PATH), { recursive: true });
//   //   fs.mkdirSync(OUTPUT_DIR, { recursive: true });

//   //   let maxRetries = 3;
//   //   let currentError = null;
//   //   // Write script to file
//   //   fs.writeFileSync(MANIM_SCRIPT_PATH, cleanedCode);

//   //   // Run manim
//   //   const command = `manim -pql ${MANIM_SCRIPT_PATH} ${sceneClass} -o ${OUTPUT_FILENAME}`;
//   //   const { stdout, stderr } = await execPromise(command);

//   //   console.log("Manim stdout:", stdout);
//   //   if (stderr) console.warn("Manim stderr:", stderr);

//   //    res.json({
//   //     message: "Video generated successfully.",
//   //     outputPath: `/videos/run/480p15/${OUTPUT_FILENAME}`,
//   //   });
//   // } catch (error: any) {
//   //   console.error("Video generation failed:", error.message);
//   //    res.status(500).json({ error: "Failed to generate video.", details: error.message });
//   //   return
//   //   }

//   try {
//     const rawPrompt: string = req.body.prompt;
//     if (!rawPrompt) {
//       res.status(400).json({ error: "Prompt is required" });
//       return;
//     }

//     let code = extractFirstPythonCodeBlock(rawPrompt);
//     if (!code) {
//       res.status(400).json({ error: "No valid Python code block found in prompt." });
//       return;
//     }

//     // Ensure dist directories exist
//     fs.mkdirSync(path.dirname(MANIM_SCRIPT_PATH), { recursive: true });
//     fs.mkdirSync(OUTPUT_DIR, { recursive: true });

//     // Retry logic
//     let maxRetries = 3;
//     let currentError = null;

//     while (maxRetries > 0) {
//       try {
//         // Clean and write code
//         if (!code) {
//           res.status(400).json({ error: "No valid Python code block found in prompt." });
//           return;
//         }
//         const cleanedCode = cleanManimCode(code);
        
//         console.log(`Attempt ${3 - maxRetries + 1} of 3`);
//         console.log("Attempting to run Manim with code:");
//         console.log(cleanedCode);
        
//         fs.writeFileSync(MANIM_SCRIPT_PATH, cleanedCode);

//         // Extract scene class
//         const sceneMatch = cleanedCode.match(/class\s+(\w+)\s*\(\s*Scene\s*\)/);
//         const sceneClass = sceneMatch ? sceneMatch[1] : null;

//         if (!sceneClass) {
//           throw new Error("No Scene class found in Manim script.");
//         }

//         // Run manim
//         const command = `manim -pql ${MANIM_SCRIPT_PATH} ${sceneClass} -o ${OUTPUT_FILENAME}`;
//         console.log("Executing command:", command);
//         const { stdout, stderr } = await execPromise(command);

//         console.log("Manim stdout:", stdout);
//         if (stderr) {
//           console.error("Manim stderr:", stderr);
//           currentError = stderr;
//           throw new Error("Manim execution failed");
//         }

//         // Success! Return video URL
//         const videoUrl = `http://localhost:3000/videos/${OUTPUT_FILENAME}`;
//         res.json({ videoUrl });
//         return;
        
//       } catch (error: any) {
//         console.error(`Attempt ${3 - maxRetries + 1} failed with error:`, error);
        
//         // If we have retries left, ask LLM to fix the error
//         if (maxRetries > 1) {
//           // Call chat endpoint with error context
//           const response = await axios.post(
//             "http://localhost:3000/chat",
//             {
//               message: rawPrompt,
//               errorContext: currentError
//             }
//           );

//           // Get new code and try again
//           code = response.data.code;
//           maxRetries--;
//         } else {
//           // No retries left, return final error
//           res.status(500).json({ 
//             error: "Failed to generate video after multiple attempts",
//             details: {
//               lastError: currentError,
//               errorMessage: error.message
//             }
//           });
//           return;
//         }
//       }
//     }
//   } catch (error: any) {
//     console.error('Error:', error);
//     res.status(500).json({ 
//       error: "Failed to generate video",
//       details: {
//         errorType: error.name,
//         errorMessage: error.message,
//         stack: error.stack
//       }
//     });
//   }
// });


//   function generateManimScript(prompt: string): string {
//     // For now: return a dummy script or call your LLM backend
//     return `
// from manim import *

// class MyScene(Scene):
//     def construct(self):
//         text = Text("${prompt}")
//         self.play(Write(text))
//         self.wait(1)
//     `;
//   }

// export default router

import { Router } from "express";
import axios from "axios";
import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import util from "util";

const router = Router();
const execPromise = util.promisify(exec);

const MANIM_SCRIPT_PATH = path.join(__dirname, "../../dist/manim/run.py");
const OUTPUT_DIR = path.join(__dirname, "../../dist/videos");
const OUTPUT_FILENAME = "output.mp4";

function extractFirstPythonCodeBlock(text: string): string | null {
  const match = text.match(/```(?:python)?\s*([\s\S]*?)```/i);
  return match ? match[1].trim() : null;
}

function cleanManimCode(code: string): string {
  // Remove problematic parameters
  code = code.replace(/outer_radius\s*=\s*[^,)]+,?/g, '');
  code = code.replace(/inner_radius\s*=\s*[^,)]+,?/g, '');
  
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

function parseManimeError(error: string): string {
  // Extract meaningful error information from Manim error output
  const errorLines = error.split('\n');
  
  // Look for common error patterns
  const importantLines = errorLines.filter(line => 
    line.includes('Error:') ||
    line.includes('TypeError:') ||
    line.includes('AttributeError:') ||
    line.includes('NameError:') ||
    line.includes('ValueError:') ||
    line.includes('SyntaxError:')
  );
  
  if (importantLines.length > 0) {
    return importantLines.join('\n');
  }
  
  // If no specific error found, return last few lines
  return errorLines.slice(-5).join('\n');
}

function generateFallbackCode(originalPrompt: string): string {
  return `from manim import *

class FallbackScene(Scene):
    def construct(self):
        # Simple fallback animation
        title = Text("${originalPrompt.slice(0, 50)}...")
        title.scale(0.8)
        
        self.play(Write(title))
        self.wait(1)
        
        # Simple shape animation
        circle = Circle(radius=1, color=BLUE, fill_opacity=0.3)
        circle.move_to(DOWN * 1)
        
        self.play(Create(circle))
        self.play(circle.animate.scale(1.5))
        self.play(circle.animate.shift(UP * 2))
        self.wait(1)
`;
}

router.post("/", async (req, res) => {
  try {
    const rawPrompt: string = req.body.prompt;
    if (!rawPrompt) {
       res.status(400).json({ error: "Prompt is required" });
    }

    let code = extractFirstPythonCodeBlock(rawPrompt);
    if (!code) {
       res.status(400).json({ error: "No valid Python code block found in prompt." });
    }

    // Ensure directories exist
    fs.mkdirSync(path.dirname(MANIM_SCRIPT_PATH), { recursive: true });
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    let maxRetries = 3;
    let attemptCount = 0;
    let lastError = '';

    while (attemptCount < maxRetries) {
      try {
        attemptCount++;
        console.log(`\n=== Attempt ${attemptCount} of ${maxRetries} ===`);
        
        if (!code) {
          throw new Error("No code available for processing");
        }

        const cleanedCode = cleanManimCode(code);
        console.log("Code to execute:");
        console.log(cleanedCode);
        
        // Write code to file
        fs.writeFileSync(MANIM_SCRIPT_PATH, cleanedCode);

        // Extract scene class name
        const sceneMatch = cleanedCode.match(/class\s+(\w+)\s*\(\s*Scene\s*\)/);
        const sceneClass = sceneMatch ? sceneMatch[1] : null;

        if (!sceneClass) {
          throw new Error("No Scene class found in Manim script");
        }

        // Execute Manim command
        const command = `cd "${path.dirname(MANIM_SCRIPT_PATH)}" && manim -pql run.py ${sceneClass} -o ${OUTPUT_FILENAME}`;
        console.log("Executing command:", command);
        
        const { stdout, stderr } = await execPromise(command, { 
          timeout: 60000, // 60 second timeout
          cwd: path.dirname(MANIM_SCRIPT_PATH)
        });

        console.log("Manim stdout:", stdout);
        
        if (stderr && stderr.includes('Error')) {
          console.error("Manim stderr:", stderr);
          lastError = parseManimeError(stderr);
          throw new Error(`Manim execution error: ${lastError}`);
        }

        // Success! Check if video file exists
        const expectedVideoPath = path.join(OUTPUT_DIR, OUTPUT_FILENAME);
        const mediaVideoPath = path.join(__dirname, `../../dist/manim/media/videos/run/480p15/${OUTPUT_FILENAME}`);
        
        let finalVideoPath = '';
        if (fs.existsSync(expectedVideoPath)) {
          finalVideoPath = `/videos/${OUTPUT_FILENAME}`;
        } else if (fs.existsSync(mediaVideoPath)) {
          finalVideoPath = `/manim/media/videos/run/480p15/${OUTPUT_FILENAME}`;
        } else {
          // Look for any mp4 file in the output directory
          const files = fs.readdirSync(path.join(__dirname, "../../dist/manim/media/videos/run/480p15/"));
          const mp4Files = files.filter(f => f.endsWith('.mp4'));
          if (mp4Files.length > 0) {
            finalVideoPath = `/manim/media/videos/run/480p15/${mp4Files[0]}`;
          } else {
            throw new Error("Video file not found after generation");
          }
        }

        console.log("Video generated successfully at:", finalVideoPath);
        res.json({
          success: true,
          videoUrl: `http://localhost:3000${finalVideoPath}`,
          outputPath: finalVideoPath,
          attempts: attemptCount
        });

      } catch (error: any) {
        console.error(`Attempt ${attemptCount} failed:`, error.message);
        lastError = error.message;

        // If we have retries left and this isn't the last attempt
        if (attemptCount < maxRetries) {
          console.log("Attempting to fix code with LLM...");
          
          try {
            // Get corrected code from chat endpoint
            const chatResponse = await axios.post(
              "http://localhost:3000/chat",
              {
                message: `Fix this Manim code that failed: ${rawPrompt}`,
                errorContext: lastError
              },
              { timeout: 30000 }
            );

            if (chatResponse.data && chatResponse.data.code) {
              code = chatResponse.data.code;
              console.log("Received corrected code from LLM");
            } else {
              throw new Error("No corrected code received from LLM");
            }
          } catch (chatError: any) {
            console.error("Failed to get corrected code:", chatError.message);
            // Continue to next attempt or fallback
          }
        }
      }
    }

    // All retries failed, try fallback
    console.log("All attempts failed, generating fallback video...");
    try {
      const fallbackCode = generateFallbackCode(rawPrompt);
      fs.writeFileSync(MANIM_SCRIPT_PATH, fallbackCode);
      
      const command = `cd "${path.dirname(MANIM_SCRIPT_PATH)}" && manim -pql run.py FallbackScene -o ${OUTPUT_FILENAME}`;
      await execPromise(command, { timeout: 30000 });
      
      res.json({
        success: true,
        videoUrl: `http://localhost:3000/media/videos/run/480p15/${OUTPUT_FILENAME}`,
        outputPath: `/media/videos/run/480p15/${OUTPUT_FILENAME}`,
        warning: "Generated fallback video due to script errors",
        attempts: maxRetries
      });
    } catch (fallbackError) {
      console.error("Even fallback failed:", fallbackError);
    }

    // Complete failure
    res.status(500).json({
      error: "Failed to generate video after multiple attempts",
      details: {
        attempts: maxRetries,
        lastError: lastError,
        suggestion: "Try simplifying your prompt or check Manim installation"
      }
    });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    res.status(500).json({
      error: "Unexpected error occurred",
      details: error.message
    });
  }
});

export default router;