# Bot Discord — Modération / Bienvenue / Musique

## 1. Créer l'application Discord
1. https://discord.com/developers/applications → **New Application**
2. Onglet **Bot** → **Reset Token** → copie le token
3. Active les **Privileged Gateway Intents** : `SERVER MEMBERS INTENT` et `MESSAGE CONTENT INTENT`
4. Onglet **OAuth2 → URL Generator** :
   - Scopes : `bot`, `applications.commands`
   - Permissions : `Administrator` (simple) ou au minimum `Ban Members`, `Kick Members`,
     `Moderate Members`, `Manage Messages`, `Connect`, `Speak`
   - Ouvre l'URL générée et invite le bot sur ton serveur

## 2. Installer
```bash
npm install
```
Nécessite [ffmpeg](https://ffmpeg.org/) — `ffmpeg-static` l'installe automatiquement, aucune action requise en général.

## 3. Configurer
Copie `.env.example` en `.env` et remplis :
- `DISCORD_TOKEN` : le token du bot
- `CLIENT_ID` : Application ID (page General Information)
- `GUILD_ID` : clic droit sur ton serveur (mode développeur activé) → Copier l'ID
- `WELCOME_CHANNEL_ID` / `AUTO_ROLE_ID` : optionnels

## 4. Déployer les commandes slash
```bash
npm run deploy
```
À refaire à chaque fois que tu ajoutes/modifies une commande.

## 5. Lancer le bot
```bash
npm start
```

## Commandes disponibles
**Modération** : `/ban`, `/kick`, `/mute`, `/warn`, `/clear`
**Musique** : `/play`, `/skip`, `/stop`, `/queue`
**Automatique** : message de bienvenue + rôle auto à l'arrivée, timeout anti-spam (5 msg/5s)

## Pour aller plus loin
- Anti-spam : seuils modifiables dans `events/messageCreate.js`
- YouTube peut casser `ytdl-core` de temps en temps (protections Google) : si `/play` échoue,
  mets à jour `@distube/ytdl-core` (`npm update @distube/ytdl-core`)
- Héberger 24/7 : Railway, Render, ou une VPS (le bot doit tourner en continu)
