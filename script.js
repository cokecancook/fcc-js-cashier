// DOM Elements
const ticket = document.getElementById("ticket");
const priceElement = document.getElementById("price");
const inputHeader = document.getElementById("input-header");
const userInput = document.getElementById("cash");
const resultsWrapper = document.getElementById("results-wrapper");
const result = document.getElementById("results-div");
const onBtn = document.getElementById("on-btn");
const deleteBtn = document.getElementById("arrow-left");
const clearBtn = document.getElementById("clear-btn");
const equalsBtn = document.getElementById("purchase-btn");
const changeDue = document.getElementById("change-due");

// Coin display elements
const penny = document.getElementById("penny");
const nickel = document.getElementById("nickel");
const dime = document.getElementById("dime");
const quarter = document.getElementById("quarter");
const one = document.getElementById("one");
const five = document.getElementById("five");
const ten = document.getElementById("ten");
const twenty = document.getElementById("twenty");
const oneHundred = document.getElementById("one-hundred");

// Device state
let deviceState = false;
let currentPrice = 0;
let inputBuffer = "";

// Coin values and available amounts
const coinValues = [
  { name: "penny", value: 0.01, max: 0.5 },
  { name: "nickel", value: 0.05, max: 2 },
  { name: "dime", value: 0.1, max: 3 },
  { name: "quarter", value: 0.25, max: 10 },
  { name: "one", value: 1, max: 20 },
  { name: "five", value: 5, max: 50 },
  { name: "ten", value: 10, max: 90 },
  { name: "twenty", value: 20, max: 140 },
  { name: "one-hundred", value: 100, max: 300 },
];

let availableCoins = {
  penny: 0,
  nickel: 0,
  dime: 0,
  quarter: 0,
  one: 0,
  five: 0,
  ten: 0,
  twenty: 0,
  "one-hundred": 0,
};

// Initialize the device
function initializeDevice() {
  // Generate random coin amounts
  generateRandomCoins();
  
  // Start with device off
  setDeviceState(false);
  
  console.log("Device initialized with coins:", availableCoins);
}

// Generate random amounts for each coin type
function generateRandomCoins() {
  coinValues.forEach(coin => {
    const maxMultiple = Math.floor(coin.max / coin.value);
    const randomMultiple = Math.floor(Math.random() * (maxMultiple + 1));
    availableCoins[coin.name] = parseFloat((randomMultiple * coin.value).toFixed(2));
  });
}

// Set device on/off state
function setDeviceState(isOn) {
  deviceState = isOn;
  
  if (isOn) {
    // Turn on display elements
    inputHeader.style.display = "block";
    userInput.style.display = "inline";
    resultsWrapper.style.display = "block";
    changeDue.style.display = "flex";
    ticket.style.display = "block";
    
    // Update power button appearance
    onBtn.classList.add("on");
    
    // Generate and display new price
    generateNewPrice();
    
    // Display available coins
    updateCoinDisplay();
    
    // Focus on input
    userInput.focus();
  } else {
    // Turn off display elements
    inputHeader.style.display = "none";
    userInput.style.display = "none";
    resultsWrapper.style.display = "none";
    changeDue.style.display = "none";
    ticket.style.display = "none";
    
    // Update power button appearance
    onBtn.classList.remove("on");
    
    // Clear input and results
    clearInput();
  }
}

// Generate a random price
function generateNewPrice() {
  function skewedRandom(min, max, skewFactor) {
    let rand = Math.pow(Math.random(), skewFactor);
    return min + (max - min) * rand;
  }

  let price = Math.random() < 0.8 ? 
    skewedRandom(4.99, 50, 3) : 
    skewedRandom(50, 200, 1);
    
  const commonDecimals = [0.0, 0.49, 0.5, 0.99];
  const randomDecimal = commonDecimals[Math.floor(Math.random() * commonDecimals.length)];
  
  currentPrice = parseFloat((Math.floor(price) + randomDecimal).toFixed(2));
  priceElement.textContent = currentPrice.toFixed(2);
  
  console.log("New price generated:", currentPrice);
}

// Clear input and results
function clearInput() {
  userInput.value = "";
  inputBuffer = "";
  result.textContent = "";
  result.style.display = "none";
  result.classList.remove("alert");
  
  // Reset change display back to "CHANGE LEFT" and show available coins
  const changeHeading = document.querySelector(".change-heading");
  if (changeHeading) {
    changeHeading.textContent = "CHANGE LEFT";
  }
  updateCoinDisplay();
}

// Handle number input
function handleNumberInput(value) {
  if (inputBuffer === "") {
    inputBuffer = value;
  } else {
    inputBuffer += value;
  }
  userInput.value = inputBuffer;
}

// Handle special input (dot, backspace)
function handleSpecialInput(value) {
  switch (value) {
    case "dot":
      if (!inputBuffer.includes(".")) {
        inputBuffer += ".";
      }
      break;
    case "backdelete":
      if (inputBuffer.length === 1) {
        inputBuffer = "";
      } else {
        inputBuffer = inputBuffer.substring(0, inputBuffer.length - 1);
      }
      break;
  }
  userInput.value = inputBuffer;
}

// Validate input
function validateInput() {
  if (inputBuffer === "") {
    result.classList.add("alert");
    result.textContent = "Please enter the cash received";
    result.style.display = "block";
    userInput.focus();
    return false;
  }
  
  const amount = parseFloat(inputBuffer);
  if (isNaN(amount) || amount <= 0) {
    result.classList.add("alert");
    result.textContent = "Please enter a valid amount";
    result.style.display = "block";
    userInput.focus();
    return false;
  }
  
  return true;
}

// Calculate change
function calculateChange(price, paid) {
  let changeAmount = Math.round((paid - price) * 100);
  const changeGiven = [];
  
  if (changeAmount < 0) {
    return null; // Not enough money
  }
  
  if (changeAmount === 0) {
    return []; // Exact payment
  }
  
  // Create a copy of available coins for calculation
  const tempCoins = { ...availableCoins };
  
  // Start with highest denomination
  for (let i = coinValues.length - 1; i >= 0; i--) {
    const coin = coinValues[i];
    const coinValueCents = Math.round(coin.value * 100);
    const availableCents = Math.round(tempCoins[coin.name] * 100);
    
    const coinAmount = Math.min(
      Math.floor(changeAmount / coinValueCents),
      Math.floor(availableCents / coinValueCents)
    );
    
    if (coinAmount > 0) {
      changeGiven.push({
        name: coin.name,
        value: coin.value,
        amount: coinAmount,
        total: coinAmount * coin.value
      });
      
      changeAmount -= coinAmount * coinValueCents;
      tempCoins[coin.name] -= coinAmount * coin.value;
    }
  }
  
  if (changeAmount > 0) {
    return null; // Can't make exact change
  }
  
  return changeGiven;
}

// Process payment
function processPayment() {
  if (!validateInput()) {
    return;
  }
  
  const paidAmount = parseFloat(inputBuffer);
  
  if (paidAmount === currentPrice) {
    // Exact payment
    result.textContent = "No change due - customer paid with exact cash";
    result.style.display = "block";
    result.classList.remove("alert");
    addToRegister(paidAmount);
    return;
  }
  
  if (paidAmount < currentPrice) {
    // Not enough money
    result.classList.add("alert");
    result.textContent = "Not enough cash to pay!";
    result.style.display = "block";
    return;
  }
  
  // Calculate change
  const change = calculateChange(currentPrice, paidAmount);
  
  if (change === null) {
    result.classList.add("alert");
    result.textContent = "Insufficient funds to provide change.";
    result.style.display = "block";
    return;
  }
  
  // Show success message
  result.textContent = "Change available!";
  result.style.display = "block";
  result.classList.remove("alert");
  
  // Display change due
  displayChangeDue(change);
  
  // Add payment to register
  addToRegister(paidAmount);
}

// Display change due in the UI
function displayChangeDue(change) {
  // Change the heading to "CHANGE DUE"
  const changeHeading = document.querySelector(".change-heading");
  if (changeHeading) {
    changeHeading.textContent = "CHANGE DUE";
  }
  
  // Reset all coin displays to 0
  Object.keys(availableCoins).forEach(coinName => {
    const element = document.getElementById(coinName);
    if (element) {
      // Less than $1 - show 0.00, $1 and above - show 0
      if (coinName === 'penny' || coinName === 'nickel' || coinName === 'dime' || coinName === 'quarter') {
        element.textContent = "0.00";
      } else {
        element.textContent = "0";
      }
      element.style.color = "";
    }
  });
  
  // Show change amounts in green
  change.forEach(coin => {
    const element = document.getElementById(coin.name);
    if (element) {
      // Less than $1 - show 2 decimal places, $1 and above - show integers
      if (coin.name === 'penny' || coin.name === 'nickel' || coin.name === 'dime' || coin.name === 'quarter') {
        element.textContent = coin.total.toFixed(2);
      } else {
        element.textContent = Math.round(coin.total);
      }
      element.style.color = "#00ff00"; // Green color for change
    }
  });
}

// Update available coins after giving change
function updateAvailableCoins(change) {
  change.forEach(coin => {
    availableCoins[coin.name] -= coin.total;
    availableCoins[coin.name] = parseFloat(availableCoins[coin.name].toFixed(2));
  });
  
  // Update the display
  updateCoinDisplay();
}

// Update coin display
function updateCoinDisplay() {
  // Less than $1 - show 2 decimal places
  penny.textContent = availableCoins.penny.toFixed(2);
  nickel.textContent = availableCoins.nickel.toFixed(2);
  dime.textContent = availableCoins.dime.toFixed(2);
  quarter.textContent = availableCoins.quarter.toFixed(2);
  
  // $1 and above - show integers only
  one.textContent = Math.round(availableCoins.one);
  five.textContent = Math.round(availableCoins.five);
  ten.textContent = Math.round(availableCoins.ten);
  twenty.textContent = Math.round(availableCoins.twenty);
  oneHundred.textContent = Math.round(availableCoins["one-hundred"]);
  
  // Reset colors to default
  penny.style.color = "";
  nickel.style.color = "";
  dime.style.color = "";
  quarter.style.color = "";
  one.style.color = "";
  five.style.color = "";
  ten.style.color = "";
  twenty.style.color = "";
  oneHundred.style.color = "";
}

// Add payment to register
function addToRegister(amount) {
  console.log(`Added $${amount} to register`);
  // Additional register logic can be added here
}

// Ticket cut animation
function cutTicket() {
  document.documentElement.style.setProperty("--shadow-color", "#00000000");
  ticket.classList.add("cut");
  
  setTimeout(() => {
    ticket.classList.remove("cut");
  }, 2000);
  
  setTimeout(() => {
    document.documentElement.style.setProperty("--shadow-color", "#000000aa");
  }, 2000);
  
  setTimeout(() => {
    if (deviceState) {
      generateNewPrice();
      clearInput();
      
      // Reset change display back to "CHANGE LEFT" and show available coins
      const changeHeading = document.querySelector(".change-heading");
      if (changeHeading) {
        changeHeading.textContent = "CHANGE LEFT";
      }
      updateCoinDisplay();
    }
  }, 2000);
}

// Event Listeners
onBtn.addEventListener("click", () => {
  setDeviceState(!deviceState);
});

ticket.addEventListener("click", () => {
  if (deviceState) {
    cutTicket();
  }
});

// Button event handlers
document.querySelector("#btns-top").addEventListener("click", (event) => {
  if (!deviceState) return;
  
  const button = event.target.closest('button');
  if (button) {
    handleSpecialInput(button.value);
  }
});

document.querySelector("#btns-numbers").addEventListener("click", (event) => {
  if (!deviceState) return;
  
  const button = event.target.closest('button');
  if (button) {
    handleNumberInput(button.value);
  }
});

clearBtn.addEventListener("click", () => {
  if (deviceState) {
    clearInput();
  }
});

equalsBtn.addEventListener("click", () => {
  if (deviceState) {
    processPayment();
  }
});

// Enter key handler
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && deviceState) {
    processPayment();
  }
});

// Initialize the device when page loads
document.addEventListener("DOMContentLoaded", initializeDevice);


