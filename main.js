const Discord = require("discord.js");
const fs = require("fs");
const Account = require("./classes/Account");
const Credentials = require("./classes/Credentials");

const file = JSON.parse(fs.readFileSync("dates.json", "utf8"));
console.log(file);

const client = new Discord.Client();

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const sleep = () =>
  new Promise((resolve) => setTimeout(resolve, random(5, 15) * 1000));

client.on("message", async (msg) => {
  const [, command] = msg.content.match(/!(\w+)/) || [];

  if (msg.channel.id !== "743604681716269079") return;
  if (msg.author.bot) return;
  if (!["zap", "login", "probny"].includes(command)) return msg.delete();

  if (command === "login") {
    await user.sign_in(msg.author.id);
  }

  if (command === "zap") {
    const ids = msg.content.match(/(\d+)/g) || [];
    for (const id of ids) {
      const zap = await user.send_invite(id, msg.author.id);
      if (!zap) return;
      if (!file.hasOwnProperty(id)) file[id] = new Date().getTime();
      fs.writeFileSync("dates.json", JSON.stringify(file));
      await sleep();
    }
  }

  if (command === "probny") {
    const [, id] = msg.content.match(/(\d+)/);
    if (file.hasOwnProperty(id)) {
      const added = file[id];
      const current = new Date().getTime();
      const probationInMs = 90 * 24 * 60 * 60 * 1000;
      const isOnProbation = added + probationInMs > current;
      await user.send_message(
        msg.author.id,
        isOnProbation
          ? "gracz jest na okresie próbnym"
          : "gracz nie jest na okresie próbnym"
      );
    } else {
      await user.send_message(msg.author.id, "Brak danych.");
    }
  }
});

const userCredentials = new Credentials("kontonakolos1", "biologia123");
const user = new Account(userCredentials, client);
client.login("NzQzNTg5NTA4MTM3NjE1NDEx.XzW3sQ.J-CZg9HT_cGSDBtSEjno_2grf60");
