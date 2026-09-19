require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const commands = [];
const commandFolders = ['moderation', 'music'];
for (const folder of commandFolders) {
  const dir = path.join(__dirname, 'commands', folder);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const command = require(path.join(dir, file));
    commands.push(command.data.toJSON());
  }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Déploiement de ${commands.length} commande(s)...`);
    // Déploiement sur un seul serveur (GUILD_ID) : instantané, idéal en dev.
    // Pour un déploiement global (tous les serveurs, ~1h de propagation),
    // remplace applicationGuildCommands par applicationCommands et enlève GUILD_ID.
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );
    console.log('Commandes déployées avec succès.');
  } catch (error) {
    console.error(error);
  }
})();
