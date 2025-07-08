import { Snowflake } from "..";

export const APIVersion = '1';

export const Routes = {
    /**
	 * Route for:
	 * - GET    `/channels/{channel.id}`
	 * - PATCH  `/channels/{channel.id}`
	 * - DELETE `/channels/{channel.id}`
	 */
	channel(channelId: Snowflake) {
		return `/channels/${channelId}` as const;
	},

	/**
	 * Route for:
	 * - GET  `/channels/{channel.id}/messages`
	 * - POST `/channels/{channel.id}/messages`
	 */
	channelMessages(channelId: Snowflake) {
		return `/channels/${channelId}/messages` as const;
	},

	/**
	 * Route for:
	 * - GET    `/channels/{channel.id}/messages/{message.id}`
	 * - PATCH  `/channels/{channel.id}/messages/{message.id}`
	 * - DELETE `/channels/{channel.id}/messages/{message.id}`
	 */
	channelMessage(channelId: Snowflake, messageId: Snowflake) {
		return `/channels/${channelId}/messages/${messageId}` as const;
	},
}