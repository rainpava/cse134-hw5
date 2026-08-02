const themePickerButtons = document.getElementById("theme-picker");
const darkModeButton = themePickerButtons.children[0];
const lightModeButton = themePickerButtons.children[1];
var theme = localStorage.getItem("theme");


document.addEventListener("DOMContentLoaded", () => {
    console.log("Theme picker enabled");
    themePickerButtons.classList.add("enabled");
    console.log(themePickerButtons.classList);
    console.log(getComputedStyle(themePickerButtons).display);

    if (theme == "light") {
        setLight();
    } else if (theme == "dark") {
        setDark();
    }
})

function setDark() {
    darkModeButton.textContent = "DARK MODE (ON)";
    lightModeButton.textContent = "LIGHT MODE (OFF)";

    darkModeButton.ariaPressed = "true";
    lightModeButton.ariaPressed = "false";
}

function setLight() {
    darkModeButton.textContent = "DARK MODE (OFF)";
    lightModeButton.textContent = "LIGHT MODE (ON)";

    darkModeButton.ariaPressed = "false";
    lightModeButton.ariaPressed = "true";
}

darkModeButton.addEventListener("click", () => {
    console.log("Dark mode enabled");
    document.documentElement.dataset.theme = "dark";
    localStorage.setItem("theme", "dark");

    setDark();
})

lightModeButton.addEventListener("click", () => {
    console.log("Light mode enabled");
    document.documentElement.dataset.theme = "light";
    localStorage.setItem("theme", "light");

    setLight();
})

class WeatherWidget extends HTMLElement {
    constructor() {
        super();
        console.log("Weather widget created");

        this.setAttribute("data-state", "idle");

        this.controller = null;

        this.textContent = "";

        const template = document.createElement("template");
        template.innerHTML = "<p id='widget-status'></p>";

        this.appendChild(template.content.cloneNode(true));

        this.text = this.querySelector("p");
    }

    connectedCallback() {
        console.log("Weather widget mounted");
        this.getWeather();
    }

    disconnectedCallback() {
        console.log("Weather widget dismounted");
        if (this.controller) {
            this.controller.abort();
        }
    }

    static get observedAttributes() {
        return [
            "data-longitude",
            "data-latitude"
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }

        if (this.isConnected) {
            this.getWeather();
        }
    }

    async getWeather() {
        const latitude = this.getAttribute("data-latitude");
        const longitude = this.getAttribute("data-longitude");
        this.controller = new AbortController();

        const url =
            `https://api.open-meteo.com/v1/forecast`
            + `?latitude=${latitude}`
            + `&longitude=${longitude}`
            + `&current=temperature_2m`
            + `&temperature_unit=fahrenheit`;

        console.log(url);

        this.text.textContent = "Loading La Jolla's weather...";
        this.setAttribute("data-state", "loading");

        try {
            const timeout = setTimeout(() => {
                this.controller.abort();
            }, 5000);

            const response = await fetch(url, {
                signal: this.controller.signal
            });
            clearTimeout(timeout);
            const data = await response.json();
            const temperature = data.current.temperature_2m;

            console.log(temperature);
            
            this.text.textContent = `Current Weather in La Jolla: ${temperature} degrees F`;
            this.setAttribute("data-state", "success");
        } catch (error) {
            console.log("Error fetching the weather");
            this.text.textContent = "Error fetching weather";
            this.setAttribute("data-state", "error");
        }
    }
}

customElements.define("weather-widget", WeatherWidget);