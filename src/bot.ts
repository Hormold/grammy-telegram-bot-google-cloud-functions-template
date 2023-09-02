import { Bot } from "grammy";
import User from "./utils/user-manager.js";
import { googleLogin } from "./utils/google.js";

const bot = new Bot(process.env.BOT_TOKEN!);

const commands = {
  login: "👤 Login to Google Account",
  test: "🧪 Test bot",
};

bot.command(["help", "start"], async (ctx) => {
  const user = new User(ctx.from!);
  const userSettings = await user.get();
  let personalData = [] as string[];

  if(userSettings.googleAccessToken) {
    personalData = [
      `👤 Logged in as ${userSettings.googleUserInfo?.name} (${userSettings.googleUserInfo?.email})`,
      ]
  } else {
    personalData = [
      `👤 Not logged in`,
    ]
  }

  const header = `[Developer Preview] This is bot example`
  const commandstr = Object.entries(commands).map(([command, description]) => `/${command} - ${description}`).join("\n");

  ctx.reply(`${header}\n${personalData.join("\n")}\n\n${commandstr}`);
});

bot.command('reset', async (ctx) => {
  const user = new User(ctx.from!);
  await user.set({
    googleAccessToken: "",
    googleRefreshToken: "",
    googleExpiresAt: null,
    googleUserInfo: {},
  });

  await ctx.reply("Google Account reseted, please login again using /login");
});

bot.command("login", async (ctx) => {
  const authUrl = await googleLogin(ctx.from!.id);
  await ctx.reply(`Please login to your Google Account. If you want to change account, please use /reset before`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Login via Google",
            url: authUrl,
          },
        ],
      ],
    }
  });
});

bot.command('test', async (ctx) => {
  const user = new User(ctx.from!);
  const userSettings = await user.get();

  if(!userSettings.googleAccessToken) {
    await ctx.reply("You need to login first using /login");
    return;
  }

  await ctx.reply("Random number: " + Math.random());
});

bot.on("message", async (ctx) => {
  // Return formatted JSON
  await ctx.reply(JSON.stringify(ctx.message, null, 2), {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: "HTML",
  });
});

export default bot;