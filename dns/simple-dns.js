const dns = require("node:dns/promises");

(async () => {
    const res = await dns.lookup("google.com")
    console.log(res);
})();