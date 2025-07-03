import { GowtherError, GowtherErrorCodes } from "../errors";
import { AuthData, InternalRequest, IRestOptions, RequestData, RequestMethod, RouteLike } from "../utils/types";

export interface IRest {
    /**
     * Sets the authorization token to be used for requests.
     */
    set token(token: string | null);

    /**
     * Gets the current authorization token.
     */
    get token(): string | null;

    /**
     * Gets the JWT token.
     */
    get jwtToken(): string;

    /**
     * Sets the JWT token.
     */
    set jwtToken(jwt: string);

    /**
     * Clears tokens and options.
     */
    clear(): void;

    /**
     * Sends a GET request to the specified route.
     */
    get(route: RouteLike, options?: RequestData): Promise<Response>;

    /**
     * Sends a POST request to the specified route.
     */
    post(route: RouteLike, options?: RequestData): Promise<Response>;

    /**
     * Sends a PUT request to the specified route.
     */
    put(route: RouteLike, options?: RequestData): Promise<Response>;

    /**
     * Sends a DELETE request to the specified route.
     */
    delete(route: RouteLike, options?: RequestData): Promise<Response>;

    /**
     * Sends a PATCH request to the specified route.
     */
    patch(route: RouteLike, options?: RequestData): Promise<Response>;
}

/**
 * Handles REST-related configuration and token management.
 */
export class Rest implements IRest {
    /**
     * Stores REST configuration options such as base URL, API path, and authorization prefix.
     */
    protected _options: IRestOptions | null;

    /**
     * Stores the access token (e.g., Bearer or Bot token).
     */
    protected _token: string | null = null;

    /**
     * Stores the JWT token (used for session or secure identity exchange).
     */
    protected _jwt: string = '';

    /**
     * Initializes a new instance of the `Rest` class with the provided REST options.
     *
     * @param options - The REST configuration options.
     */
    constructor(options: IRestOptions) {
        this._options = { ...options };
    }

    /**
     * Sets the access token to be used for authorized requests.
     *
     * @param token - The access token (e.g., Bearer token).
     */
    set token(token: string) {
        this._token = token;
    }

    /**
     * Gets the current access token.
     *
     * @returns The currently stored access token, or `null` if none is set.
     */
    get token(): string | null {
        return this._token;
    }

    /**
     * Gets the current JWT token.
     *
     * @returns The stored JWT token.
     */
    get jwtToken(): string {
        return this._jwt;
    }

    /**
     * Sets the JWT token.
     *
     * @param jwt - The JWT token to store.
     */
    set jwtToken(jwt: string) {
        this._jwt = jwt;
    }

    /**
     * Clears the stored token, JWT, and REST configuration.
     * Useful for logging out or resetting the client.
     */
    clear(): void {
        this._token = null;
        this._options = null;
        this._jwt = '';
    }

    /**
     * Transforms various types of input data into a `Uint8Array`.
     *
     * Supports:
     * - Strings, booleans, and numbers (converted to string then encoded using UTF-8)
     * - `Uint8Array` instances (returned as-is)
     * - Typed array views (`Int8Array`, `Float32Array`, etc.) (converted to `Uint8Array`)
     * - Node.js `Buffer` (converted to `Uint8Array`)
     *
     * @param data - The data to convert. Can be a `Buffer`, `Uint8Array`, `ArrayBufferView`, `boolean`, `number`, or `string`.
     * @returns A `Uint8Array` containing the encoded data or data origin.
     */
    private toUint8Array(data: Buffer | Uint8Array | boolean | number | string): Uint8Array {
        if (typeof data === 'string' || typeof data === 'boolean' || typeof data === 'number') {
            return new TextEncoder().encode(String(data));
        }

        if (data instanceof Uint8Array) {
            return data;
        }

        if (ArrayBuffer.isView(data)) {
            const view = data as ArrayBufferView;
            return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
        }
        return data;
    }

    /**
     * Resolves and executes an HTTP request based on the given `InternalRequest` object.
     *
     * This method performs the following steps:
     * 1. Prepares the full request URL, including query parameters.
     * 2. Sets up request headers.
     * 3. Handles authentication headers if required.
     * 4. Prepares the request body, supporting JSON, FormData, and file uploads.
     * 5. Executes the HTTP request using `fetch` and handles errors.
     *
     * @param request - The internal request object containing all necessary details.
     * @returns A Promise resolving to the Fetch API `Response` object.
     *
     * @throws {GowtherError} Throws an error if the REST client is not initialized or if the HTTP response is not successful.
     */
    private async resolveRequest(request: InternalRequest): Promise<Response> {
        if (!this._options) {
            // Ensure the REST client is properly initialized before proceeding
            throw new GowtherError(GowtherErrorCodes.RestClientNotInitialized);
        }

        // 1. Prepare URL with query parameters if any
        const url = new URL(request.fullRoute, this._options.baseURL);
        if (request.query) {
            request.query.forEach((value, key) => url.searchParams.append(key, value));
        }

        // 2. Prepare headers by cloning existing ones from the request
        const headers = new Headers(request.headers);

        // 3. Handle authentication unless explicitly disabled
        if (request.auth !== false) {
            // Use default auth if request.auth is true, or use provided auth object
            const auth = request.auth === true ? this.getDefaultAuth() : request.auth;
            if (auth) {
                // Determine prefix (Bearer/Bot/other) with fallback
                const prefix = auth.prefix || this._options.authPrefix || 'Bearer';
                headers.set('Authorization', `${prefix} ${auth.token}`);
            }
        }

        // 4. Prepare request body
        let body: BodyInit | undefined;
        if (request.body) {
            if (request.passThroughBody && !request.files) {
                // Pass body as-is if passthrough enabled and no files
                body = request.body;
            } else if (request.files?.length) {
                // If files are present, construct FormData payload
                const formData = new FormData();

                // Append JSON payload depending on flag
                if (!request.appendToFormData && request.body) {
                    formData.append('payload_json', JSON.stringify(request.body));
                } else if (request.body) {
                    for (const [key, value] of Object.entries(request.body)) {
                        formData.append(key, JSON.stringify(value));
                    }
                }

                // Append each file as a Blob with proper content type and filename
                for (let i = 0; i < request.files.length; i++) {
                    const file = request.files[i];
                    const fileKey = file.key ?? `files[${i}]`;
                    const fileData = this.toUint8Array(file.data);

                    const blobOptions: BlobPropertyBag = {};
                    if (file.contentType) {
                        blobOptions.type = file.contentType;
                    }

                    formData.append(
                        fileKey,
                        new Blob([fileData], blobOptions),
                        file.name
                    );
                }

                body = formData;
            } else {
                // Default: send body as JSON with appropriate header
                headers.set('Content-Type', 'application/json');
                body = JSON.stringify(request.body);
            }
        }

        // 5. Execute the HTTP request using fetch
        const response = await fetch(url.toString(), {
            method: request.method,
            headers,
            body,
        });

        // Check if response is OK (status in the range 200-299)
        if (!response.ok) {
            // Throw error with HTTP status code if request failed
            throw new GowtherError(GowtherErrorCodes.HttpError, String(response.status));
        }

        // Return the successful response
        return response;
    }
    
    /**
     * Retrieves the default authorization data if a token is set.
     * 
     * @returns An AuthData object containing the token and prefix, or undefined if no token or options are set.
     */
    private getDefaultAuth(): AuthData | undefined {
        if (!this._token) return undefined;
        if (!this._options) return undefined;
        return {
            token: this._token,
            prefix: this._options.authPrefix,
        };
    }

    /**
     * Sends a GET request to the specified API route.
     *
     * @param route - The full API route to query.
     * @param options - Optional request options such as headers, query params, body, etc.
     * @returns A Promise resolving to the Fetch API Response.
     */
    public async get(route: RouteLike, options?: RequestData): Promise<Response> {
        return this.resolveRequest({
            fullRoute: route,
            method: RequestMethod.Get,
            ...options,
        });
    }

    /**
     * Sends a POST request to the specified API route.
     *
     * @param route - The full API route to query.
     * @param options - Optional request options such as headers, query params, body, etc.
     * @returns A Promise resolving to the Fetch API Response.
     */
    public async post(route: RouteLike, options?: RequestData): Promise<Response> {
        return this.resolveRequest({
            fullRoute: route,
            method: RequestMethod.Post,
            ...options,
        });
    }

    /**
     * Sends a PUT request to the specified API route.
     *
     * @param route - The full API route to query.
     * @param options - Optional request options such as headers, query params, body, etc.
     * @returns A Promise resolving to the Fetch API Response.
     */
    public async put(route: RouteLike, options?: RequestData): Promise<Response> {
        return this.resolveRequest({
            fullRoute: route,
            method: RequestMethod.Put,
            ...options,
        });
    }

    /**
     * Sends a DELETE request to the specified API route.
     *
     * @param route - The full API route to query.
     * @param options - Optional request options such as headers, query params, body, etc.
     * @returns A Promise resolving to the Fetch API Response.
     */
    public async delete(route: RouteLike, options?: RequestData): Promise<Response> {
        return this.resolveRequest({
            fullRoute: route,
            method: RequestMethod.Delete,
            ...options,
        });
    }

    /**
     * Sends a PATCH request to the specified API route.
     *
     * @param route - The full API route to query.
     * @param options - Optional request options such as headers, query params, body, etc.
     * @returns A Promise resolving to the Fetch API Response.
     */
    public async patch(route: RouteLike, options?: RequestData): Promise<Response> {
        return this.resolveRequest({
            fullRoute: route,
            method: RequestMethod.Patch,
            ...options,
        });
    }
}