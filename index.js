(async function () {
  let DELAY = 0;
  const DISTR = 0.33;

  class User {
    constructor(name) {
      this.userWindow = document.querySelector(`#demo .user.${name}`);
      this.terminal = this.userWindow.querySelector(`.terminal`);
      this.input = this.terminal.querySelector(".input");
      this.demoInput = this.terminal.querySelector("input");
      this.resetInput();
      this.setupDemo();
      this.group = [];
      this.display = this.terminal.querySelector(".display");
      this.setupMoveWindow();
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

    tryDemo() {
      this.reset();
      const names = this.group.map((u) => `@${u.name}`).join(", ");
      show(this.demoInput);
    }

    async send(to, message, typeTo, paste) {
      await this._sendMsg(`@${to.name}`, message, typeTo, paste);
      await to.receive(this, message);
      await delay(20);
    }

    async sendGroup(message, typeTo, paste) {
      await this._sendMsg(`#${this.groupName}`, message, typeTo, paste);
      await this.receiveGroup(message);
      await delay(10);
    }

    async _sendMsg(toStr, message, typeTo, paste) {
      await this.type(`${toStr} `, !typeTo);
      await this.type(message, paste);
      await delay(10);
      this.resetInput();
      this.show("sent", `${toStr} ${message}`);
    }

    async type(str, paste) {
      if (paste) {
        await delay(10);
        this.input.insertAdjacentHTML("beforeend", str);
      } else {
        for (const char of str) {
          await delay(isAlpha(char) ? 1 : 2);
          this.input.insertAdjacentHTML("beforeend", char);
        }
      }
      await delay(2);
    }

    resetInput() {
      this.input.innerHTML = "> ";
      show(this.demoInput, false);
    }

    async receive(from, message, group) {
      await delay(10);
      let g = group ? `#${this.groupName} ` : "";
      this.show("received", `${g}@${from.name}: ${message}`);
    }

    async receiveGroup(message) {
      await Promise.all(this.group.map((u) => u.receive(this, message, true)));
    }

    show(mode, str) {
      this.display.insertAdjacentHTML(
        "beforeend",
        `<div class="${mode}">${highlight(str)}</div>`
      );
    }

    setupDemo() {
      if (!this.demoInput) return;
      on("keypress", this.demoInput, async ({ keyCode, key }) => {
        if (keyCode === 13) {
          const [to, ...words] = this.demoInput.value.split(" ");
          const message = words.join(" ");
          switch (to[0]) {
            case undefined:
              break;
            case "@":
              await this.sendInput(to.slice(1), message);
              break;
            case "#":
              await this.sendInputGroup(to.slice(1), message);
              break;
            default:
              this.show("error", "Message should start with @user or #group");
          }
        } else if (this.demoInput.value === "" && key !== "@" && key !== "#") {
          const channel = this.currentChannel();
          if (channel) this.demoInput.value = channel + " ";
        }
      });
    }

    async sendInput(name, message) {
      if (name === this.name) {
        this.show("error", "Can't send message to yourself");
        return;
      }
      const recipient = this.group.find((u) => u.name === name);
      if (recipient === undefined) {
        this.show("error", `Unknown recipient @${name}`);
        return;
      }
      this.show("sent", `@${name} ${message}`);
      this.demoInput.value = "";
      await recipient.receive(this, message);
    }

    async sendInputGroup(name, message) {
      if (name !== this.groupName) {
        this.show("error", `Unknown group #${name}`);
        return;
      }
      this.show("sent", `#${name} ${message}`);
      this.demoInput.value = "";
      await this.receiveGroup(message);
    }

    currentChannel() {
      return lastChild(this.display).childNodes[0].innerHTML;
    }

    setupMoveWindow() {
      let moving = false;
      let startX, startY;
      const user = this.userWindow;
      const parent = user.parentNode;

      on("mousedown", this.terminal, (e) => {
        moving = true;
        startX = user.offsetLeft - e.clientX;
        startY = user.offsetTop - e.clientY;
        parent.removeChild(user);
        parent.appendChild(user);
      });
      on("mouseup", this.terminal, () => (moving = false));
      on("mouseleave", this.terminal, () => (moving = false));
      on("mousemove", this.terminal, (e) => {
        if (!moving) return;
        user.style.left = e.clientX + startX + "px";
        user.style.top = e.clientY + startY + "px";
      });
    }
  }

  function setGroup(groupName, users) {
    users.forEach((u) => u.setGroup(groupName, users));
  }

  const alice = new User("alice");
  const bob = new User("bob");
  const tom = new User("tom");
  const team = [alice, bob, tom];
  setGroup("team", team);

  async function chatDemo() {
    team.forEach((u) => u.reset());
    await alice.sendGroup("please review my PR project/site#72", true);
    await tom.sendGroup("anybody got application key 🔑?");
    await bob.sendGroup("looking at it now @alice 👀");
    await alice.sendGroup("thanks @bob!");
    await alice.sendGroup("will DM @tom");
    await alice.send(tom, "w3@o6CewoZx#%$SQETXbWnus", true, true);
    await tom.send(alice, "you're the savior 🙏!");
    await alice.send(bob, "please check the tests too", true);
    await bob.send(alice, "all looks good 👍");
    await alice.send(bob, "thank you!");
    DELAY = 80;
  }

  await chatDemo();
  const RUN_DEMO = "#demo .run-demo";
  const RUN_FASTER = "#demo .run-faster";
  const TRY_IT = "#demo .try-it";
  onClick(RUN_DEMO, runChatDemo);
  onClick(RUN_FASTER, () => (DELAY /= 2));
  onClick(TRY_IT, tryChatDemo);

  async function runChatDemo() {
    show(RUN_DEMO, false);
    show(RUN_FASTER);
    enable(TRY_IT, false);
    await chatDemo();
    show(RUN_DEMO);
    show(RUN_FASTER, false);
    enable(TRY_IT);
  }

  function tryChatDemo() {
    team.forEach((u) => u.tryDemo());
    alice.demoInput.focus();
  }

  async function delay(units) {
    // delay is random with `1 +/- DISTR` range
    const ms = units * DELAY * (1 - DISTR + 2 * DISTR * Math.random());
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function highlight(str) {
    return str
      .replace(/(@[a-z]+)([^0-9]|$)/gi, `<span class="user">$1</span>$2`)
      .replace(/(#[a-z]+)([^0-9]|$)/gi, `<span class="group">$1</span>$2`);
  }

  function isAlpha(c) {
    c = c.toUpperCase();
    return c >= "A" && c <= "Z";
  }

  function lastChild(el) {
    return el.childNodes[el.childNodes.length - 1];
  }

  let flipper = setInterval(flipProblem, 5000);

  onClick("#problem .pagination", () => {
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

  function onClick(selector, handler, enable = true) {
    const el = document.querySelector(selector);
    if (el) on("click", el, handler, enable);
  }

  function on(event, el, handler, enable = true) {
    const method = enable ? "addEventListener" : "removeEventListener";
    el[method](event, handler);
  }

  function show(selector, visible = true) {
    const el =
      typeof selector === "string"
        ? document.querySelector(selector)
        : selector;
    if (el) el.style.display = visible ? "block" : "none";
  }

  function enable(selector, enabled = true) {
    const el = document.querySelector(selector);
    el.disabled = enabled ? "" : "true";
  }
})();
