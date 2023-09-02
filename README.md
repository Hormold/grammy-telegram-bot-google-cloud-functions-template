# Typescript Telegram bot template for deploying to Google Cloud Functions
This is my own template for deploying a simple Telegram bot using grammY on the Google Cloud Platform (GCP) via Cloud Functions. This bot also includes a simple express server to add additional routes to your bot.

*You are free to use this template for your own projects, whether they are commercial or not.
Just let me know if you are building something cool with this template. I would love to see it!*


## What is included?
- [grammY](https://grammy.dev/) as the Telegram bot framework
- Google Cloud Functions as the serverless platform 
- Redis as an in-memory database for session management
- Google OAuth2 for authentication via Google (You can remove this if you don't need it)
- Express server to add additional routes to your bot and handle webhooks from Telegram


## Requirements
- You must have a GCP account with enabled billing and a created project.
- You must have a Telegram bot token. You can obtain one by talking to [@BotFather](https://t.me/BotFather).


## How to prepare it for your own bot
1. Clone this repository.
2. Install the dependencies with `npm install`.
3. Rename `.env.yaml.sample` to `.env.yaml` and add your own values.
4. Run `npm run generate-env` to generate the .env file from the .env.yaml file. (You need to do this every time you change the .env.yaml file)
5. Add your own bot logic to the `bot.ts` file.
6. If you want to add additional routes to your bot, add your own logic to the `index.ts` file. Do not touch the `/bot` route and Google Cloud Functions related code.
7. Run `npm run webhook` to set the webhook for your bot.
8. Run `npm run deploy` to deploy the bot to GCP. This will create a new Cloud Function.


## How to run locally
Use npm run start to run the bot locally. This will run the bot (polling) and the express server.
Personal recommendation: Use a separate `BOT_TOKEN` for local development. Using the same `BOT_TOKEN` for local development and production is not recommended, as you can't use the same webhook for local development and production or run polling and webhooks at the same time.

## Project structure
- `src/index.ts`: Entry point of the bot for Google Cloud Functions.
- `src/bot.ts`: General bot logic.
- `src/index.ts`: Additional routes for the bot + bot endpoint.
- `src/dev.ts`: Entry point of the bot for local development. 

## Cron?
If you want to add cron jobs to your bot, you can use [Google Cloud Scheduler](https://cloud.google.com/scheduler) to trigger your additional routes.
Just create a new job and set the URL to your additional route from `index.ts`. You can also add authentication to your route if you wish.

## Ideas
- Add a simple database like MongoDB or PostgreSQL to store data instead of Redis.
- Add a rate-limiter, sessions to grammy.

## Slow API calls
If you are running the OpenAI API or another slow API, you may encounter the timeout limits of the Telegram API. (Telegram has a limit on open connections to one webhook)
Because Telegram doesn't want to wait for your API to finish and close the connection, it can run retries.
To solve this problem, you can use Google Cloud Pub/Sub to run your API in the background in another Google Cloud Function.
You need to create a new topic in Google Cloud Pub/Sub and another Cloud Function to process the messages from the topic. (Also, you need to disable retries for this function)
The flow will be like this:
1. Telegram calls the webhook into the main bot function.
2. The main bot function sends a Google Cloud Pub/Sub message to another function for processing (now Telegram has received a response and closes the connection) and responds to Telegram with "200 OK".
3. Another Google Cloud Function processes the user request, which can be a long-running task.
4. Send a response to the user via Telegram API calls from another function.
This way, you can run long-running tasks without blocking the Telegram API.


## Real-world example
- [GPTask.io](https://gptask.io) - A Telegram bot that helps you to communicate with OpenAI's GPT API (I'm the creator of this bot) with a lot of features.