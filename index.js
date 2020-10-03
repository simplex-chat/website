(async function () {
  const DELAY = 80;
  const RANGE = 0.33;

  class User {
    constructor(name) {
      const term = document.querySelector(`#example .user.${name} .terminal`);
      this.input = term.querySelector(".input");
      this.resetInput();
      this.display = term.querySelector(".display");
      this.name = name;
    }

    reset() {
      this.resetInput();
      this.display.innerHTML = "";
    }

    setGroup(groupName, users) {
      this.group = users.filter((u) => u !== this);
      this.groupName = groupName;
    }

    async send(to, message, paste) {
      await this.type(`@${to.name} `);
      await this.type(message, paste);
      this.resetInput();
      this.show(
        "sent",
        `<span class="user">@${to.name} </span><span>${message}</span>`
      );
      await to.receive(this, message);
      await delay(20);
    }

    async sendGroup(message) {
      await this.type(`#${this.groupName} ${message}`);
      this.resetInput();
      this.show(
        "sent",
        `<span class="group">#${this.groupName} </span><span>${message}</span>`
      );
      await Promise.all(this.group.map((u) => u.receive(this, message, true)));
      await delay(10);
    }

    async type(str, paste) {
      if (paste) {
        await delay(10);
        this.input.innerHTML += str;
      } else {
        for (const char of str) {
          await delay(isAlpha(char) ? 1 : 2);
          this.input.innerHTML += char;
        }
      }
      await delay(10);
    }

    resetInput() {
      this.input.innerHTML = ">&nbsp;";
    }

    async receive(from, message, group) {
      await delay(10); // add some randomness
      let msg = group ? `<span class="group">#${this.groupName} </span>` : "";
      this.show(
        "received",
        msg + `<span class="user">@${from.name}: </span><span>${message}</span>`
      );
    }

    show(mode, str) {
      this.display.innerHTML += `<div class="${mode}">${str}</div>`;
    }
  }

  const alice = new User("alice");
  const bob = new User("bob");
  const tom = new User("tom");
  [alice, bob, tom].forEach((u) => u.setGroup("team", [alice, bob, tom]));

  async function chatExample() {
    while (true) {
      [alice, bob, tom].forEach((u) => u.reset());
      await alice.sendGroup("please review my PR project/site#72");
      await tom.sendGroup("anybody got application key 🔑 ?");
      await bob.sendGroup("looking at it now @alice 👀");
      await alice.sendGroup("thanks @bob!");
      await alice.sendGroup("will DM @tom!");
      await alice.send(tom, "w3@o6CewoZx#%$SQETXbWnus", true);
      await tom.send(alice, "you're the savior 🙏 !");
      await alice.send(bob, "please check the tests too");
      await bob.send(alice, "all looks good 👍");
      await alice.send(bob, "thank you!");
      await delay(100);
    }
  }

  const startChat = setInterval(() => {
    if (isElementInViewport(document.querySelector("#example .user.tom"))) {
      clearInterval(startChat);
      chatExample();
    }
  }, 500);

  async function delay(units) {
    const ms = units * DELAY * (1 - RANGE + 2 * RANGE * Math.random());
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let flipper = setInterval(flipProblem, 5000);

  document
    .querySelector("#problem .pagination")
    .addEventListener("click", () => {
      clearInterval(flipper);
      flipper = setInterval(flipProblem, 10000);
    });

  function flipProblem() {
    if (isElementInViewport(document.getElementById("problem"))) {
      window.location.hash =
        window.location.hash === "#problem-explained"
          ? "#problem-intro"
          : "#problem-explained";
    }
  }

  function isElementInViewport(el) {
    const r = el.getBoundingClientRect();
    return r.bottom >= 0 && r.top <= window.innerHeight;
  }

  function isAlpha(c) {
    c = c.toUpperCase();
    return c >= "A" && c <= "Z";
  }
})();
