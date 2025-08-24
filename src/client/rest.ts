import { GowtherError, GowtherErrorCodes } from "../errors";
import { AuthData, InternalRequest, RequestData, IRestOptions, RequestMethod, RouteLike } from "@tellme/shared-types";

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



    private async request(req: InternalRequest): Promise<Response> {
        if (!this._options) {
            throw new GowtherError(GowtherErrorCodes.RestClientNotInitialized);
        }

        const url = new URL(req.fullRoute, this._options.baseURL);
        const headers = new Headers(req.options?.headers);

        // Auth automatique
        if (req.auth !== false) {
            const auth = req.auth === true ? this.getDefaultAuth() : req.auth;
            if (auth) {
                headers.set("Authorization", `${auth.prefix || this._options.authPrefix || "Bearer"} ${auth.token}`);
            }
        }

        const res = await fetch(url.toString(), {
            ...req.options,
            method: req.method,
            headers,
        });

        if (!res.ok) {
            throw new GowtherError(GowtherErrorCodes.HttpError, String(res.status));
        }

        return res;
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
        return this.request({
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
        return this.request({
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
        return this.request({
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
        return this.request({
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
        return this.request({
            fullRoute: route,
            method: RequestMethod.Patch,
            ...options,
        });
    }
}