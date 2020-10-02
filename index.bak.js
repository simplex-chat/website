(async function () {
  const group = ["alice", "bob", "tom"];
  await init(group);
  await send("alice", ["bob"], "@bob", "hello");
  await send("bob", ["alice"], "@alice", "hello there too");
  await send("alice", group, "#school", "what is the homework?");
  await send("tom", group, "#school", "I have it here!");

  async function init(participants) {
    participants.forEach((who) => (getArea(who).textContent = "> "));
    await delay(1000);
  }

  function getArea(name) {
    return window.document.getElementById(name);
  }

  async function typeByChar(who, line) {
    const area = getArea(who);
    for (const char of line) {
      await delay(150);
      area.textContent += char;
    }
    delay(100);
    area.textContent += "> ";
  }

  function addLine(who, line) {
    const area = getArea(who);
    area.textContent = area.textContent.slice(0, -2) + line + "\n> ";
  }

  async function send(sender, recipients, toString, msg) {
    await delay(1000);
    await typeByChar(sender, `${toString} ${msg}\n`);
    await delay(500);
    recipients
      .filter((who) => who !== sender)
      .forEach((who) =>
        addLine(
          who,
          `${toString[0] === "#" ? toString + " " : ""}@${sender}: ${msg}`
        )
      );
  }

  async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
})();
