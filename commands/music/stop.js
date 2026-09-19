const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Arrêter la musique et vider la file'),

  async execute(interaction, client) {
    const queue = client.musicQueues.get(interaction.guild.id);
    if (!queue) {
      return interaction.reply({ content: '❌ Rien n\'est en cours.', ephemeral: true });
    }
    queue.songs = [];
    queue.player.stop();
    queue.connection?.destroy();
    client.musicQueues.delete(interaction.guild.id);
    await interaction.reply('⏹️ Musique arrêtée, déconnecté du vocal.');
  },
};
