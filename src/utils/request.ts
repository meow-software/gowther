import { RequestData } from "@tellme/shared-types";

/**
 * Utility function to create a JSON-compatible request body and headers
 * for REST API calls. It automatically stringifies the body and sets
 * the `Content-Type` header to `application/json`.
 *
 * @param body - The request body to be sent. It will be converted to a JSON string.
 * @param headers - Optional additional headers. These will be merged with the default headers.
 *                  If a header already exists, the provided one will overwrite the default.
 * @returns An object containing the stringified body and the merged headers.
 *
 * @example
 * // Basic usage
 * const response = await client.rest.post("/guilds", jsonRestRequest({ name: "MyGuild" }));
 *
 */
export function jsonRestRequest(
  body: any,
  headers: Record<string, string> = {}
) : RequestData {
  return {
    options: {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    },
  };
}