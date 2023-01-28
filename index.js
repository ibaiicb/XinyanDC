require("dotenv").config();

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Intents, Collection } = require("discord.js");
const { Player } = require("discord-player");

const fs = require("node:fs");
const path = require("node:path");

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILDS_MESSAGES, Intents.FLAGS.GUILDS_VOICE_STATES]
});

//Load all the commands
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command);
}

//Create player
client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
    }
});

//Register commands
client.on('ready', () => {
    const guildIds = client.guilds.cache.map(guild => guild.id);
    const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN);

    for (const guildId of guildIds) {
        rest.put(Routes.applicationGuildCommands(process.env.GUILD_ID, guildId), {
            body: commands,
        })
            .then(() => console.log(`Added commands to ${guildId}`))
            .catch(console.error);
    }
});

//Execute commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute({client, interaction});
    } catch (e) {
        console.error(e);
        await interaction.reply('Ha ocurrido un error');
    }
});

client.login(process.env.DISCORD_TOKEN);
