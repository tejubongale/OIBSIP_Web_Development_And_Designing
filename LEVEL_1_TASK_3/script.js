function convertTemperature() {
    const tempInput = document.getElementById("tempInput").value;
    const unitSelect = document.getElementById("unitSelect").value;
    const output = document.getElementById("output");
    const thermoFill = document.getElementById("thermoFill");
    const thermoBubble = document.getElementById("thermoBubble");

    if (tempInput === "" || isNaN(tempInput)) {
        alert("Please enter a valid number!");
        return;
    }

    let temp = parseFloat(tempInput);
    let celsius;

    // Convert input to Celsius first
    if (unitSelect === "C") {
        celsius = temp;
    } else if (unitSelect === "F") {
        celsius = (temp - 32) * 5 / 9;
    } else if (unitSelect === "K") {
        celsius = temp - 273.15;
    }

    // Convert to all units
    const fahrenheit = (celsius * 9/5 + 32).toFixed(2);
    const kelvin = (celsius + 273.15).toFixed(2);
    const c = celsius.toFixed(2);

    output.innerHTML = `🌡️ ${c} °C | ${fahrenheit} °F | ${kelvin} K`;

    // Thermometer fill
    let tempPercent = ((celsius + 10) / 60) * 100;
    if (tempPercent < 0) tempPercent = 0;
    if (tempPercent > 100) tempPercent = 100;

    thermoFill.style.width = tempPercent + "%";

    // Color based on temperature
    if (celsius <= 0) {
        thermoFill.style.background = "#00f"; // blue
    } else if (celsius > 0 && celsius <= 20) {
        thermoFill.style.background = "#0f0"; // green
    } else if (celsius > 20 && celsius <= 35) {
        thermoFill.style.background = "#ff0"; // yellow
    } else {
        thermoFill.style.background = "#f00"; // red
    }

    // Move thermometer bubble
    thermoBubble.style.left = tempPercent + "%";
    thermoBubble.innerText = `${c}°C`;
}
