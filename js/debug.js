const debugButton = document.getElementById("debug-button")
const debugStyles = document.getElementById("debug-styles")

debugButton.addEventListener("click", () => {
    console.log(debugStyles.disabled);
    console.log(document.documentElement.getAttribute("data-theme"));
    debugStyles.disabled = !debugStyles.disabled;
    debugButton.textContent = debugStyles.disabled
        ? "Enable Debug"
        : "Disable Debug";
})