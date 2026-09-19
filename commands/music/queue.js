const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Afficher la file d\'attente musicale'),

  async execute(interaction, client) {
    const queue = client.musicQueues.get(interaction.guild.id);
    if (!queue || queue.songs.length === 0) {
      return interaction.reply({ content: '📭 La file est vide.', ephemeral: true });
    }
    const list = queue.songs
      .map((s, i) => `${i === 0 ? '▶️' : `${i}.`} ${s.title}`)
      .join('\n');
    await interaction.reply(`🎶 **File d'attente :**\n${list}`);
  },
};
