import { google } from "googleapis";
import { GoogleUserinfo } from "../types";

const SCOPES = [
	'https://www.googleapis.com/auth/userinfo.profile',
	'https://www.googleapis.com/auth/userinfo.email',
	// Add more scopes here
];


// Generate google login link
const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/google/callback",
);

export const getGoogleId = async (accessToken: string): Promise<GoogleUserinfo> => {
	oauth2Client.setCredentials({ access_token: accessToken });
	const oauth2 = google.oauth2({
		auth: oauth2Client,
		version: 'v2',
	});

	const res = await oauth2.userinfo.get();
	return res.data;
}

export const googleLogin = (userId: number): string => {
	const authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		prompt: 'consent',
		scope: SCOPES,
		state: JSON.stringify({ userId }), // It's not secure. You should use something like JWT
	});
	return authUrl;
}

// Also you can use this function to refresh access token
export const getAccessToken = async (code: string) => {
	const { tokens } = await oauth2Client.getToken(code);
	return tokens;
}
