const config = require('./config.json');
const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'getevents',
        description: '(Un)enrolls you in receiving event notifs from the bot',
    },
];

const rest = new REST({ version: '10' }).setToken(config.TOKEN);

(async () => {
    try {
        console.log('Registering application (/) commands.');

        await rest.put (
            Routes.applicationGuildCommands(config.BOT_ID, config.BOT_TEST_GUILD_ID),
            { body: commands}
        );

        await rest.put (
            Routes.applicationGuildCommands(config.BOT_ID, config.AG_GUILD_ID),
            { body: commands}
        );

        await rest.put (
            Routes.applicationGuildCommands(config.BOT_ID, config.QB_GUILD_ID),
            { body: commands}
        );

        console.log('Successfully registered application (/) commands.');
    }
    catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();