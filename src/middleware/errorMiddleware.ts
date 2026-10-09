import type { Context } from "hono";

import { HTTPException } from "hono/http-exception";
import mongoose from "mongoose";
import process from "node:process";
import { ZodError } from "zod";

const isProduction = process.env.NODE_ENV === "production";

export function errorHandler(err: Error, c: Context) {
  if (err instanceof ZodError) {
    const message = err.issues
      .map(issue => (issue.path.length ? `${issue.path.join(".")}: ${issue.message}` : issue.message))
      .join("; ");
    return c.json({ success: false, message }, 400);
  }

  if (err instanceof mongoose.Error.CastError) {
    return c.json({ success: false, message: `Invalid ${err.path}` }, 400);
  }

  if (err instanceof HTTPException) {
    return c.json({ success: false, message: err.message }, err.status);
  }

  console.error(err);
  return c.json(
    {
      success: false,
      message: isProduction ? "Internal Server Error" : err.message,
      stack: isProduction ? undefined : err.stack,
    },
    500,
  );
}

export function notFound(c: Context) {
  return c.json({ success: false, message: `Not Found - [${c.req.method}] ${c.req.url}` }, 404);
}
