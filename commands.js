/**
 * Check if inserted commands are installed
 *
 * @param appId
 * @param guildId
 * @param commands
 * @returns {Promise<void>}
 */
export async function hasGuildCommands (appId, guildId, commands) {
    if (appId === '' || guildId === '') {
        return;
    } else {
        commands.forEach((command) => getGuildCommand(appId, guildId, command));
    }
}

/**
 *
 * @param appId
 * @param guildId
 * @param command
 * @returns {Promise<void>}
 */
async function getGuildCommand(appId, guildId, command) {
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

    try {
        //something
    } catch (e) {
        //something
    }
}
