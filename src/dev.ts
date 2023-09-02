import bot from './bot.js';
import server from './index.js';
const port = process.env.PORT || 3000;

bot.catch((err) => {
	console.error('Bot error:', err);
});
bot.start();

server.listen(port, () => {
	console.log(`Additionall server listening at http://localhost:${port}`);
});