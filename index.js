(async function () {
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
