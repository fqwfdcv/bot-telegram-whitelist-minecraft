const TelegramBot = require('node-telegram-bot-api');
const { Rcon } = require('rcon-client');

// Configuration // Конфигурация
const TELEGRAM_BOT_TOKEN = 'token'; //Bot Token //Токен Бота
const RCON_CONFIG = {
    host: 'host-ip',
    port: 0123,
    password: 'password-rcon'
};


const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Функция для отправки команд в RCON
// Function for sending commands to RCON
async function sendRconCommand(command) {
    try {
        const rcon = await Rcon.connect(RCON_CONFIG);
        const response = await rcon.send(command);
        await rcon.end();
        return response.replace(/§./g, ''); // Removing the color codes // Убираем цветовые коды
    } catch (error) {
        return `Ошибка: ${error.message}`;
    }
}

// Command handler /swl | // Обработчик команд /swl
bot.onText(/^\/(swl_add|swl_remove)\s+(\S+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const action = match[1];
    const playerName = match[2];

    const command = `swl ${action.replace('swl_', '')} ${playerName}`;
    const response = await sendRconCommand(command);
    bot.sendMessage(chatId, response);
});

bot.onText(/^\/swl_list$/, async (msg) => {
    const chatId = msg.chat.id;
    const response = await sendRconCommand('swl list');
    bot.sendMessage(chatId, `Белый список:
${response}`);
});

// Team /online | // Команда /online
bot.onText(/^\/online$/, async (msg) => {
    const chatId = msg.chat.id;
    const response = await sendRconCommand('list');
    bot.sendMessage(chatId, `Игроки онлайн:
${response}`);
});

// Command /plugins | // Команда /plugins
bot.onText(/^\/plugins$/, async (msg) => {
    const chatId = msg.chat.id;
    const response = await sendRconCommand('plugins');
    bot.sendMessage(chatId, `Установленные плагины:
${response}`);
});

// Commands /help | // Команды / помощь
bot.onText(/\/help/, (msg) => {
    const helpText = `Список доступных команд:\n\n` +
        `/help - Показать это сообщение.\n/online - Показать список игроков.\n/plugins - Показать список плагинов.\n\n` +
        '/swl_add <player_name> - Добавить игрока\n/swl_remove <player_name> — Удалить игрока\n/swl_list — Показать всех';
    bot.sendMessage(msg.chat.id, helpText);
});

console.log('Бот запущен!');
