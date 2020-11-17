const axios = require("axios");

const Config = require("./Config");

class Account {
  constructor(credentials, client) {
    this.credentials = credentials;
    this.cookies = {};
    this.config = new Config();
    this.client = client;
    this.LOGIN_URL = "https://new.margonem.pl/ajax/login";
    this.INV_URL = "https://www.margonem.pl/ajax/forum.php";
    this.TABLES_URL = "http://serwery.margonem.pl/ajax_tables.php";
  }

  async sign_in(author_id) {
    this.cookies = {};
    try {
      const response = await axios(this.LOGIN_URL, {
        method: "POST",
        data: this.credentials.toString,
        headers: {
          "User-Agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36",
        },
      });
      const data = response.data;
      await this.send_message(
        author_id,
        " ```js\n" + JSON.stringify(data, null, 2) + "\n``` "
      );

      if (data.ok !== 1) {
        return false;
      }

      const getCookieValue = (name, string) => {
        const regExp = new RegExp(String.raw `${name}=([\w\d]+);`);
        const [, value] = string.match(regExp);
        return value;
      };

      const getCookies = () => {
        const [, chash, hs3, user_id] = response.headers["set-cookie"];
        const cookies = {
          chash: getCookieValue("chash", chash),
          hs3: getCookieValue("hs3", hs3),
          user_id: getCookieValue("user_id", user_id),
        };
        console.log(cookies);
        return cookies;
      };

      this.cookies = getCookies();
      return true;
    } catch {
      return false;
    }
  }
  async send_invite(id = 0, author_id) {
    if (
      ![
        "363038285020266496",
        "349836529616814091",
        "450686367312248833",
      ].includes(author_id)
    ) {
      await this.send_message(author_id, "brak praw dostępu");
      return false;
    }

    if (Object.values(this.cookies).length === 0) {
      await this.send_message(author_id, "najpierw się zaloguj..");
      return false;
    }

    try {
      const response = await axios(this.INV_URL, {
        method: "POST",
        data: `t=sendinvite&w=${this.config.world}&id=${id}&h2=${this.cookies.hs3}&security=true`,
        headers: {
          "User-Agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36",
          Cookie: `user_id=${this.cookies.user_id}; chash=${this.cookies.chash}; hs3=${this.cookies.hs3};`,
          referer: `https://www.margonem.pl/?task=profile&id=${id}`,
        },
      });
      const data = response.data.err;
      await this.send_message(author_id, `\n${id}: ${JSON.stringify(data)}`);
      if (data.err !== "Wysłano zaproszenie na świat nyras") {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  async get_timer(author_id, mob, channel) {
    if (Object.values(this.cookies).length === 0) {
      await this.send_message(author_id, "najpierw się zaloguj..", channel);
      return false;
    }

    const response = await axios(this.TABLES_URL, {
      method: "POST",
      data: `task=battle&world=nyras&filter_int=0&filter_str=${encodeURI(mob)}&filter_date=&from=0&limit=1&hs3=${this.cookies.hs3}`,
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36",
        Cookie: `user_id=${this.cookies.user_id}; chash=${this.cookies.chash}; hs3=${this.cookies.hs3};`,
        referer: `http://serwery.margonem.pl/`,
      },
    });
    let data = response.data;
    if (data === "Not authorized!")
      return this.send_message(author_id, "najpierw się zaloguj..", channel);

    if (data.rows.length) {
      data = data.rows[0];
      const date = new Date(data.tss * 1000).toLocaleString();
      const map = data.town;
      let winner = data[`team${data.winner}`];
      winner = winner.replace(/<PID>\d+<\/PID>/g, "");
      await this.send_message(
        author_id,
        `Ostatni ${mob} był ${date}, na mapie ${map}, zwyciężył ${winner}.`,
        channel
      );
    } else {
      await this.send_message(author_id, "Brak danych nt. " + mob, channel);
    }
  }

  async send_message(author_id, data, channel_id = false) {
    const message = `<@${author_id}> ${data}`;
    const channel = this.client.channels.cache.get(
      channel_id || this.config.channelID
    );
    await channel.send(message);
  }
}

module.exports = Account;