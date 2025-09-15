let result = document.getElementById("result");
let historyList = document.getElementById("history-list");

function append(value) {
  result.value += value;
}

function clearDisplay() {
  result.value = "";
}

function deleteChar() {
  result.value = result.value.slice(0, -1);
}

function calculate() {
  try {
    let expression = result.value;
    let output = eval(expression);

    // Show result
    result.value = output;

    // Save to history
    addToHistory(expression + " = " + output);
  } catch {
    result.value = "Error";
  }
}

function addToHistory(entry) {
  let p = document.createElement("p");
  p.textContent = entry;
  historyList.prepend(p); // latest on top
}

function clearHistory() {
  historyList.innerHTML = "";
}
