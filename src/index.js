const { Client, IntentsBitField, REST, Routes } = require('discord.js');
const loginToken = require('./loginToken.json');

//Remember to add the intents you need!!!!!!!!!!!!
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,

    ]
});

const commands = [
    {
        name: 'getEvents',
        description: '(Un)enrolls you in receiving event notifs from the bot'
    }
]

//When the bot is online, it'll log this message
client.on('ready', (c) => {
    console.log(`Logged in as ${c.user.tag}!`);
} );

/*
When the bot sees a message in any of the servers that it is in (that it has access to), 
it'll log the username of the author of the message (as of right now - might change later if needed) */
client.on('messageCreate', (msg) => {
    console.log(msg.author.username);
});

//When the user types in a command, bot will take appropriate action
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'getEvents') {
        await interaction.reply('Pong!');
    }
});

//Logs bot in using token from loginToken.json (which is gitignored)
client.login(loginToken.TOKEN);