const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Passer à la musique suivante'),

  async execute(interaction, client) {
    const queue = client.musicQueues.get(interaction.guild.id);
    if (!queue || queue.songs.length === 0) {
      return interaction.reply({ content: '❌ Rien n\'est en cours de lecture.', ephemeral: true });
    }
    queue.player.stop(); // déclenche AudioPlayerStatus.Idle -> passe à la suivante
    await interaction.reply('⏭️ Musique suivante.');
  },
};
