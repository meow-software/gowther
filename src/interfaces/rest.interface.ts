import { RequestData, RouteLike } from "../utils";

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