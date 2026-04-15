// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="
let alertsDisplay
let errorMessage
let loadingSpinner

const showError = (message) => {
  errorMessage.textContent = message
  errorMessage.classList.add("error-active")
  errorMessage.classList.remove("hidden")
}

const clearError = () => {
  errorMessage.textContent = ""
  errorMessage.classList.remove("error-active")
  errorMessage.classList.add("hidden")
}

const showLoading = () => {
  loadingSpinner.classList.remove("hidden")
}

const hideLoading = () => {
  loadingSpinner.classList.add("hidden")
}

const displayAlerts = (data) => {
  const alerts = data.features || []
  const headlines = alerts
    .map((alert) => `<li>${alert.properties.headline}</li>`)
    .join("")

  alertsDisplay.innerHTML = `
    <h2>${data.title}: ${alerts.length}</h2>
    <ul>${headlines}</ul>
  `
}

const fetchWeatherAlerts = async (state) => {
  try {
    showLoading()
    const response = await fetch(`${weatherApi}${state}`)

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const data = await response.json()
    clearError()
    console.log(data)
    displayAlerts(data)
  } catch (error) {
    console.log(error.message)
    showError(error.message)
  } finally {
    hideLoading()
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const stateInput = document.getElementById("state-input")
  const fetchButton = document.getElementById("fetch-alerts")
  alertsDisplay = document.getElementById("alerts-display")
  errorMessage = document.getElementById("error-message")
  loadingSpinner = document.getElementById("loading-spinner")

  fetchButton.addEventListener("click", () => {
    const state = stateInput.value.trim().toUpperCase()
    stateInput.value = ""
    alertsDisplay.innerHTML = ""

    if (!state) {
      showError("Please enter a state abbreviation.")
      return
    }

    if (!/^[A-Z]{2}$/.test(state)) {
      showError("Please enter a valid two-letter state abbreviation.")
      return
    }

    fetchWeatherAlerts(state)
  })
})
