(async function () {
  class User {
    constructor(name) {
      const term = document.querySelector(`#example .user.${name} .terminal`);
      this.input = term.querySelector(".input");
      this.display = term.querySelector(".display");
      this.name = name;
    }

    setGroup(groupName, users) {
      this.group = users.filter((u) => u !== this);
      this.groupName = groupName;
      this.display.innerHTML = this.group.map((u) => u.name).join(",");
    }

    async send(to, message) {
      await this.type(`@${to.name} ${message}`);
      await this.transmit();
      await to.receive(this, message);
    }

    async sendGroup(message) {
      await this.type(`#${this.groupName} ${message}`);
      await this.transmit();
      await Promise.all(this.group.map((u) => u.receive(this, message, true)));
    }

    async type(str) {
      await delay(1000); // add some randomness
      this.input.innerHTML = str;
    }

    async transmit() {
      await delay(1000);
      this.display.innerHTML = this.input.innerHTML;
      this.input.innerHTML = "";
    }

    async receive(from, message, group) {
      await delay(1000); // add some randomness
      let msg = group ? `<span class="group">#${this.groupName}</span> ` : "";
      msg += `<span class="from">@${from.name}</span>: ${message}`;
      this.display.innerHTML = msg;
    }
  }

  const alice = new User("alice");
  const bob = new User("bob");
  const tom = new User("tom");
  [alice, bob, tom].forEach((u) => u.setGroup("team", [alice, bob, tom]));

  await alice.sendGroup("please review my PR company/project#72");
  await tom.sendGroup("anybody got application key 🔑 ?");
  await bob.sendGroup("looking at it now @alice 👀");
  await alice.sendGroup("thanks @bob!");
  await alice.sendGroup("will DM @tom!");
  await alice.send(tom, "w3@o6CewoZx#%$SQETXbWnus");
  await tom.send(alice, "you're the savior 🙏 !");
  await alice.send(bob, "please check the tests too");
  await bob.send(alice, "all looks good 👍");
  await alice.send(bob, "thank you!");

  async function delay(ms) {
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
})();
