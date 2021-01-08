// Generates random string of 21 numeric characters
module.exports = function () {
  function inner(count = 3, acc = "") {
    return count
      ? String(Math.trunc(Math.random() * 10000000)) + inner(count - 1, acc)
      : "";
  }

  return inner();
};
