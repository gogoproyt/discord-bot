// Anti-spam simple : X messages en moins de Y secondes -> mute temporaire + suppression
const userMessageLog = new Map(); // userId -> [timestamps]

const MAX_MESSAGES = 5;      // nb de messages
const TIME_WINDOW_MS = 5000; // fenêtre de temps (5s)
const TIMEOUT_MS = 60 * 1000; // durée du timeout (1 min)

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const now = Date.now();
    const timestamps = (userMessageLog.get(message.author.id) || []).filter(
      t => now - t < TIME_WINDOW_MS,
    );
    timestamps.push(now);
    userMessageLog.set(message.author.id, timestamps);

    if (timestamps.length > MAX_MESSAGES) {
      userMessageLog.set(message.author.id, []); // reset pour éviter le spam de sanctions

      const member = message.member;
      if (member && member.moderatable) {
        try {
          await member.timeout(TIMEOUT_MS, 'Anti-spam automatique');
          await message.channel.send(
            `⏱️ ${member} a été mis en pause 1 minute pour spam.`,
          );
        } catch (err) {
          console.error('Erreur anti-spam :', err.message);
        }
      }
    }
  },
};
