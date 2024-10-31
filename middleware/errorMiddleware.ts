// middleware/errorMiddleware.ts
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

// Define the error structure
interface ErrorDetails {
  error: string;
  stack?: string;
  location: string;
  context: string;
  userId?: string | null;
}

// Function to log the error to the database
async function logErrorToDatabase(
  req: NextApiRequest,
  errorDetails: ErrorDetails
): Promise<void> {
  try {
    // Get base URL from the request headers
    const baseUrl = req.headers.origin || `http://${req.headers.host}`;
    await fetch(`${baseUrl}/api/logError`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(errorDetails),
    });
  } catch (err) {
    console.error("Failed to log error:", err);
  }
}

// Middleware to wrap API handlers and handle errors
export function withErrorHandling(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("Here");
    try {
      // Execute the original handler
      return await handler(req, res);
    } catch (error) {
      // Log the error
      console.log("There");
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const errorStack = error instanceof Error ? error.stack : undefined;

      await logErrorToDatabase(req, {
        error: errorMessage,
        stack: errorStack,
        location: req?.url || "unknown",
        context: "API Route",
        userId: req.headers?.["user-id"]?.toString() || null, // Example of getting user ID if passed in headers
      });

      // Return a standard error response
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
