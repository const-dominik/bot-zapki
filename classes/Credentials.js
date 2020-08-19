class Credentials {
    constructor(login, password) {
        this.login = login;
        this.password = password;
    }

    get toString() {
        return `l=${this.login}&p=${this.password}&h2=&security=true`;
    }
}

module.exports = Credentials;