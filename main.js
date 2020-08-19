const Discord = require("discord.js");
const Account = require("./classes/Account");
const Credentials = require("./classes/Credentials");

const client = new Discord.Client();

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
const sleep = () => new Promise(resolve => setTimeout(resolve, random(5, 15) * 1000));

client.on("message", async msg => {
    const [, command] = msg.content.match(/!(\w+)/) || [];

    if (msg.channel.id !== "743604681716269079") return;
    if (msg.author.bot) return;
    if (!["zap", "login"].includes(command)) return;

    if (command === "login") {
        await user.sign_in(msg.author.id);
    }
    
    if (command === "zap") {
        const ids = msg.content.match(/(\d+)/g) || [];
        for (const id of ids) {
            const zap = await user.send_invite(id, msg.author.id);
            if (!zap) return;
            await sleep();
        }
    }
    return;
})

const userCredentials = new Credentials("wwebpx4ore", "9yl9w1l525c")
const user = new Account(userCredentials, client);
client.login(TOKEN);