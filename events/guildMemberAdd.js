const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    // Rôle automatique
    const roleId = process.env.AUTO_ROLE_ID;
    if (roleId) {
      const role = member.guild.roles.cache.get(roleId);
      if (role) {
        try {
          await member.roles.add(role);
        } catch (err) {
          console.error('Impossible d\'ajouter le rôle auto :', err.message);
        }
      }
    }

    // Message de bienvenue
    const channelId = process.env.WELCOME_CHANNEL_ID;
    if (!channelId) return;
    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle('Bienvenue ! 🎉')
      .setDescription(`${member} vient de rejoindre le serveur.`)
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: `Membre n°${member.guild.memberCount}` })
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(console.error);
  },
};
