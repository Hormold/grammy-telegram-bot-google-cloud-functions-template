import { oauth2_v2 } from "googleapis/build/src/apis/oauth2/v2";
import { User as TelegramUser } from 'grammy/types'

export type UserSettings = {
	googleAccessToken?: string,
	googleRefreshToken?: string,
	googleCalendarId?: string | null,
	googleExpiresAt?: number | null,
	googleUserInfo?: oauth2_v2.Schema$Userinfo | null,
	tg?: TelegramUser | null,
}

export type GoogleUserinfo = oauth2_v2.Schema$Userinfo;
export type TelegramUserinfo = TelegramUser;