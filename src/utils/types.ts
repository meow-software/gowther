const apiUrl = 'https://tellme.com/api';
const baseUrl = 'https://tellme.com';
const wsGatewayUrl = apiUrl;

/**
 * Configuration options for the REST API.
 */
export interface IRestOptions {
	/**
	 * The base URL to use for the frontend or root domain.
	 *
	 * @defaultValue `https://tellme.com`
	 */
	baseURL: string;

	/**
	 * The base URL to use for API calls.
	 *
	 * @defaultValue `https://tellme.com/api`
	 */
	api: string;

	/**
	 * The authorization prefix to use for requests (e.g., for bearer tokens or bot tokens).
	 *
	 * @defaultValue `'Bearer'`
	 */
	authPrefix: 'Bearer' | 'Bot';
}

/**
 * Default configuration for REST API interactions.
 */
export const DefaultRestOptions: IRestOptions = {
	baseURL: baseUrl,
	api: apiUrl,
	authPrefix: 'Bearer',
};

/**
 * Configuration options for sharding behavior.
 */
export interface IShardOptions {
	/**
	 * The strategy used for sharding:
	 * - `process`: Uses Node.js child processes.
	 * - `webclient`: Uses a web-based client-side strategy.
	 */
	shardStrategy: 'process' | 'webclient';
}

/**
 * Configuration options for the WebSocket gateway.
 */
export interface IOptionWsGateway {
	/**
	 * The WebSocket URL for connecting to the gateway.
	 */
	url: string;

	/**
	 * The number of times to attempt reconnection on failure.
	 *
	 * @defaultValue `5`
	 */
	reconnectAttempts?: number;

	/**
	 * The delay (in milliseconds) between reconnection attempts.
	 *
	 * @defaultValue `1000`
	 */
	reconnectDelay?: number;
}

/**
 * Default configuration for the WebSocket gateway connection.
 */
export const DefaultWsGatewayOptions: IOptionWsGateway = {
	url: wsGatewayUrl,
	reconnectAttempts: 5,
	reconnectDelay: 1000,
};

/**
 * Overall client configuration, combining REST, WebSocket, and sharding options.
 */
export interface IClientOptions {
	/**
	 * Sharding options to control how the client handles shards.
	 */
	shardOption: IShardOptions;

	/**
	 * REST API configuration.
	 */
	restOptions: IRestOptions;

	/**
	 * WebSocket gateway configuration.
	 */
	WsGatewayOptions: IOptionWsGateway;
}

/**
 * Options for launching shards, including the total number and the entry file.
 */
export interface IShardingOptions {
	/**
	 * Authentication token to use with the gateway and API.
	 */
	token: string;

	/**
	 * Total number of shards to spawn.
	 */
	totalShards: number;

	/**
	 * Path to the file that will be executed for each shard.
	 */
	botFile: string;
}

/**
 * Default configuration for the entire client, including REST, WebSocket, and sharding options.
 */
export const DefaultClientOptions: IClientOptions = {
	shardOption: {
		shardStrategy: 'process',
	},
	restOptions: DefaultRestOptions,
	WsGatewayOptions: DefaultWsGatewayOptions,
};

/**
 * HTTP methods supported by the REST client.
 */
export enum RequestMethod {
	/** DELETE HTTP method */
	Delete = 'DELETE',
	/** GET HTTP method */
	Get = 'GET',
	/** PATCH HTTP method */
	Patch = 'PATCH',
	/** POST HTTP method */
	Post = 'POST',
	/** PUT HTTP method */
	Put = 'PUT',
}

/**
 * Represents a valid route string starting with a slash.
 * Examples: "/users", "/api/v1/resource"
 */
export type RouteLike = `/${string}`;

/**
 * Authentication data used for authorization in requests.
 */
export interface AuthData {
	/**
	 * The authorization prefix to use for this request, useful for bearer tokens or bot tokens.
	 * 
	 * @defaultValue `Rest.options.authPrefix`
	 */
	prefix?: 'Bearer' | 'Bot';

	/**
	 * The authorization token to be sent in the request header.
	 */
	token: string;
}

export interface RawFile {
	/**
	 * The MIME type of the file, e.g., "image/png" or "application/pdf".
	 * Optional but recommended for correct file handling on the server.
	 */
	contentType?: string;

	/**
	 * The actual file data.
	 * Can be a Buffer, Uint8Array, boolean, number, or string.
	 * Various types are supported for flexibility in file input formats.
	 */
	data: Buffer | Uint8Array | boolean | number | string;

	/**
	 * Optional key name for the file when sending as form data.
	 * If omitted, a default key will be generated when appending to form data.
	 */
	key?: string;

	/**
	 * The name of the file, including extension (e.g., "photo.png").
	 * Used to specify the filename when uploading.
	 */
	name: string;
}

export interface RequestData {
	/**
	 * Whether to append JSON data as individual form-data fields instead of as a single `payload_json` field
	 * when sending files. Useful for APIs expecting separate fields instead of a JSON payload.
	 */
	appendToFormData?: boolean;

	/**
	 * Alternate authorization data to use for this specific request.
	 * Set to `false` to disable the Authorization header.
	 * 
	 * @defaultValue `true` (uses the default authorization)
	 */
	auth?: AuthData | boolean | undefined;

	/**
	 * Additional HTTP headers to include in this request.
	 * Keys are header names, values are header values.
	 */
	headers?: Record<string, string>;

	/**
	 * Whether to pass the `body` property directly to `fetch()` without processing.
	 * <warn>This option only applies when there are no files attached.</warn>
	 */
	passThroughBody?: boolean;

	/**
	 * Query parameters to append to the URL as part of the request.
	 */
	query?: URLSearchParams;

	/**
	 * The request body to send.
	 * Can be a string, FormData, Blob, etc., as accepted by the Fetch API.
	 */
	body?: BodyInit | undefined;

	/**
	 * Files to be attached to the request.
	 * When present, the request will be sent as multipart/form-data.
	 */
	files?: RawFile[] | undefined;
}

/**
 * Internal request type used by the REST client for performing HTTP requests.
 * Extends `RequestData` with mandatory route and HTTP method.
 */
export interface InternalRequest extends RequestData {
	/**
	 * The full API route to request, starting with a slash.
	 */
	fullRoute: RouteLike;

	/**
	 * The HTTP method for the request (GET, POST, PUT, DELETE, PATCH).
	 */
	method: RequestMethod;
}

export enum ChannelType {
	DM,
	GroupDM,
	GuildText,
	GuildCategory,
	GuildVoice
}
