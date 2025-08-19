import { Snowflake } from "@tellme/shared-types";

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
    /**
	 * Route for:
	 * - POST `/guilds/${guildId}` When guildId is undefined
	 * - GET    `/guilds/${guildId}`
	 * - PATCH  `/guilds/${guildId}`
	 * - DELETE `/guilds/${guildId}`
	 */
	guild(guildId?: Snowflake) {
		if (!guildId)	return `/guilds` as const; // For creating a new guild
		return `/guilds/${guildId}` as const;
	},

    /**
	 * Route for:
	 * - POST `/user/${userId}` When user is undefined
	 * - GET    `/user/${userId}`
	 * - PATCH  `/user/${userId}`
	 * - DELETE `/user/${userId}`
	 */
	user(userId?: Snowflake) {
		if (!userId)	return `/user` as const; // For creating a new user
		return `/user/${userId}` as const;
	},
}