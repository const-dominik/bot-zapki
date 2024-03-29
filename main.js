const Discord = require("discord.js");
const fs = require("fs");
const Account = require("./classes/Account");
const Credentials = require("./classes/Credentials");

const client = new Discord.Client();

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const sleep = () =>
  new Promise((resolve) => setTimeout(resolve, random(5, 15) * 1000));

client.on("message", async (msg) => {
  const [, command] = msg.content.match(/!(\w+)/) || [];

  if (!["743604681716269079", "753280724911521954"].includes(msg.channel.id))
    return;
  if (msg.author.bot) return;
  if (!["zap", "login", "probny", "czasowka"].includes(command)) return;
  const file = JSON.parse(fs.readFileSync("dates.json", "utf8"));

  if (command === "login") {
    await user.sign_in(msg.author.id);
  }

  if (command === "zap") {
    const ids = msg.content.match(/(\d+)/g) || [];
    for (const id of ids) {
      const zap = await user.send_invite(id, msg.author.id);
      if (!zap) return;
      if (!file.hasOwnProperty(id)) file[id] = new Date().getTime();
      await sleep();
    }
    fs.writeFileSync("dates.json", JSON.stringify(file));
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
        isOnProbation ?
        "gracz jest na okresie próbnym" :
        "gracz nie jest na okresie próbnym"
      );
    } else {
      await user.send_message(msg.author.id, "Brak danych.");
    }
  }

  if (command === "czasowka") {
    const [, mob] = msg.content.split("!czasowka ");
    await user.get_timer(msg.author.id, mob, msg.channel.id);
  }
});

const userCredentials = new Credentials("", "");
const user = new Account(userCredentials, client);
client.login("");
