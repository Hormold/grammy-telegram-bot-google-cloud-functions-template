import express from 'express';
import { webhookCallback } from "grammy";
import functions from "@google-cloud/functions-framework";
import { getAccessToken, getGoogleId } from './utils/google.js';
import User from './utils/user-manager.js';
import bot from './bot.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/google/callback', async (req, res) => {
	try {
		const { code, state } = req.query;
		const userId = JSON.parse(state as string).userId;

		const user = new User({ id: userId });
		const accessToken = await getAccessToken(code as string);
		if(!accessToken.access_token) throw new Error("Invalid access token");
		// Get user id using API

		const userInfo = await getGoogleId(accessToken.access_token);
		if(!userInfo.id) throw new Error("Invalid user id");

		const settings = await user.get();

		if(settings.googleUserInfo?.id && userInfo.id !== settings.googleUserInfo?.id) throw new Error("Reset Google Account in telegram bot using command /reset");

		await user.set({
			googleUserInfo: userInfo,
			googleAccessToken: accessToken.access_token! as string,
			googleRefreshToken: accessToken.refresh_token!,
			googleExpiresAt: accessToken.expiry_date,
		});

		res.send('Done, you can close this tab now');

		bot.api.sendMessage(userId, `👋🏼 Successful! You are logged in as ${userInfo.name} (${userInfo.email})`);

	} catch(e: any) {
		res.send(`Error: ${e.message}`);
	}
});

app.all('/bot', webhookCallback(bot, "express", {
		secretToken: process.env.SECRET_TOKEN!,
		timeoutMilliseconds: 120_000, // I need it because I'm using OpenAI API and long chains of tasks
	})
);

functions.http(
	'handleTelegramWebhook',
	app,
)

export default app;