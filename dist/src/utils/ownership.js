import { HTTPException } from "hono/http-exception";
export function assertOwner(doc, userId) {
    if (doc.user?.toString() !== userId) {
        throw new HTTPException(403, { message: "Not authorized to modify this resource" });
    }
}
