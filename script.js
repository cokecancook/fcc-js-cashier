const ticket = document.getElementById("ticket");

const inputHeader = document.getElementById("input-header");
const userInput = document.getElementById("cash");
const resultsWrapper = document.getElementById("results-wrapper");
const result = document.getElementById("results-div");

const onBtn = document.getElementById("on-btn");
const deleteBtn = document.getElementById("arrow-left");
const clearBtn = document.getElementById("clear-btn");
const equalsBtn = document.getElementById("purchase-btn");

const changeDue = document.getElementById("change-due");
const penny = document.getElementById("penny");
const nickel = document.getElementById("nickel");
const dime = document.getElementById("dime");
const quarter = document.getElementById("quarter");
const one = document.getElementById("one");
const five = document.getElementById("five");
const ten = document.getElementById("ten");
const twenty = document.getElementById("twenty");
const oneHundred = document.getElementById("one-hundred");
let changeArr = [
  { name: "penny", value: 0 },
  { name: "nickel", value: 0 },
  { name: "dime", value: 0 },
  { name: "quarter", value: 0 },
  { name: "one", value: 0 },
  { name: "five", value: 0 },
  { name: "ten", value: 0 },
  { name: "twenty", value: 0 },
  { name: "oneHundred", value: 0 },
];

let deviceState = false;
let firstTime = true;
let buffer = ""; // what's on display

let cid = [
  ["PENNY", changeArr.penny.toFixed(2)],
  ["NICKEL", changeArr.nickel.toFixed(2)],
  ["DIME", changeArr.dime.toFixed(2)],
  ["QUARTER", changeArr.quarter.toFixed(2)],
  ["ONE", changeArr.one.toFixed(2)],
  ["FIVE", changeArr.five.toFixed(2)],
  ["TEN", changeArr.ten.toFixed(2)],
  ["TWENTY", changeArr.twenty.toFixed(2)],
  ["ONE HUNDRED", changeArr.oneHundred.toFixed(2)],
];

const coinValues = [
  { name: "penny", value: 0.01, max: 0.5 },
  { name: "nickel", value: 0.05, max: 2 },
  { name: "dime", value: 0.1, max: 3 },
  { name: "quarter", value: 0.25, max: 10 },
  { name: "one", value: 1, max: 20 },
  { name: "five", value: 5, max: 50 },
  { name: "ten", value: 10, max: 90 },
  { name: "twenty", value: 20, max: 140 },
  { name: "oneHundred", value: 100, max: 300 },
];

////////////
////////////
////////////
/// START //
////////////
////////////
////////////

const turnOnOff = () => {
  if (deviceState && firstTime) {
    startProcess();
  }
  switchState();
};

const startProcess = () => {
  /*rerenderScreen();*/
  initializeChangeArr();
  console.log("Change Values initial:", JSON.stringify(changeArr));
  updateCoinValuesStart();
  printTicket();
};

////////////
////////////
////////////
// DEVICE //
////////////
////////////
////////////

// -------------------------
// SWITCH STATE: Turn on and off the device
// -------------------------
const switchState = () => {
  deviceState = !deviceState;
  inputHeader.style.display = deviceState ? "block" : "none";
  userInput.style.display = deviceState ? "inline" : "none";
  resultsWrapper.style.display = deviceState ? "block" : "none";
  changeDue.style.display = deviceState ? "flex" : "none";
};

// -------------------------
// CLEAR NUM: Clear the number input, result and reset buffer
// -------------------------
const clearNum = () => {
  userInput.value = "";
  buffer = "";
  result.textContent = "";
  userInput.focus();
  rerenderScreen();
};

// -------------------------
// RERENDER SCREEN: Re-render the screen display
// -------------------------
function rerenderScreen() {
  userInput.value = buffer;
}

////////////
////////////
////////////
// TICKET //
////////////
////////////
////////////

// -------------------------
// GET RANDOM PRICE: Generate a random price for the ticket
// -------------------------
function getRandomPrice() {
  function skewedRandom(min, max, skewFactor) {
    let rand = Math.pow(Math.random(), skewFactor);
    return min + (max - min) * rand;
  }

  let price =
    Math.random() < 0.8 ? skewedRandom(4.99, 50, 3) : skewedRandom(50, 200, 1);
  const commonDecimals = [0.0, 0.49, 0.5, 0.99];
  const randomDecimal =
    commonDecimals[Math.floor(Math.random() * commonDecimals.length)];
  return (Math.floor(price) + randomDecimal).toFixed(2);
}

// -------------------------
// NEW PRICE: Print the random price in the ticket
// -------------------------
const newPrice = () => {
  let randomPrice = getRandomPrice();
  priceElement.textContent = randomPrice;
  let price = parseFloat(priceElement.textContent);
  console.log("Initial price = " + price);
};

// -------------------------
// PRINT TICKET: Shows change due
// -------------------------
const printTicket = () => {
  newPrice();
  changeDue.innerHTML = changeDueTemp;

  // Update the UI with the new values
  updateCoinValues(changeArrArray);
  /*updateChangeDueUI(changeArrArray);/********************************/
  clearNum();
};

// -------------------------
// TICKET CUT ANIMATION: Cut Animation
// -------------------------
const ticketCutAnimation = () => {
  document.documentElement.style.setProperty("--shadow-color", "#00000000");
  ticket.classList.add("cut");
  console.log("Ticket cut");
  setTimeout(function () {
    ticket.classList.remove("cut");
  }, 2000);
  setTimeout(function () {
    document.documentElement.style.setProperty("--shadow-color", "#000000aa");
  }, 2000);
  setTimeout(printTicket, 2000);
};

////////////
////////////
////////////
/// CASH ///
////////////
////////////
////////////

// -------------------------
// IS NUM: Alerts if no cash value entered
// -------------------------
const isNum = (input) => {
  if (input === "") {
    result.classList.add("alert");
    result.textContent = "Please enter the cash received";
    result.style.display = "block";
    userInput.value = "";
    userInput.focus();
    return false;
  }
  return true;
};

// -------------------------
// CLEAN INPUT: Ensure it's a number without $
// -------------------------
const cleanInput = (value) => Number(value);

////////////
////////////
////////////
// CHANGE //
// IN CAB //
////////////
////////////
////////////

// -------------------------
// GET RANDOM COINS: Randomly generate the amount for one type of coin
// -------------------------
const getRandomCoins = (coinValue, maxValue) => {
  const maxMultiple = Math.floor(maxValue / coinValue);
  const randomMultiple = Math.floor(Math.random() * (maxMultiple + 1));
  return parseFloat((randomMultiple * coinValue).toFixed(2));
};

// -------------------------
// CHANGE ARR: Generate initial values for coins in the drawer
// -------------------------
const initializeChangeArr = () => {
  coinValues.forEach((coin) => {
    changeArr[coin.name] = getRandomCoins(coin.value, coin.max);
  });
};

// -------------------------
// CHANGE ARR ARRAY: Generate array from changeArr
// -------------------------
const changeArrArray = Object.keys(changeArr).map((key) => ({
  name: key,
  value: changeArr[key],
}));

// -------------------------
// UPDATE COIN VALUES START: Renders coin values in screen
// -------------------------
const updateCoinValuesStart = () => {
  penny.textContent = changeArr.penny.toFixed(2);
  nickel.textContent = changeArr.nickel.toFixed(2);
  dime.textContent = changeArr.dime.toFixed(2);
  quarter.textContent = changeArr.quarter.toFixed(2);
  one.textContent = changeArr.one.toFixed(2);
  five.textContent = changeArr.five.toFixed(2);
  ten.textContent = changeArr.ten.toFixed(2);
  twenty.textContent = changeArr.twenty.toFixed(2);
  oneHundred.textContent = changeArr.oneHundred.toFixed(2);
  penny.style.display = "inline";
  nickel.style.display = "inline";
  dime.style.display = "inline";
  quarter.style.display = "inline";
  one.style.display = "inline";
  five.style.display = "inline";
  ten.style.display = "inline";
  twenty.style.display = "inline";
  oneHundred.style.display = "inline";
};

// -------------------------
// UPDATE COIN VALUES: Updates changeArr and renders coin values in screen
// -------------------------
const updateCoinValues = (array) => {
  console.log("**updateCoinValues starts**");

  if (!Array.isArray(array)) {
    // Check if is an array
    console.error("Expected an array but got:", typeof array);
    return;
  }

  // Subtract the proposed change from the existing coin values in changeArr
  array.forEach((coin) => {
    if (coin.name in changeArr) {
      changeArr[coin.name] -= coin.amount * coin.value;
      changeArr[coin.name] = parseFloat(changeArr[coin.name].toFixed(2));
    } else {
      console.error(`Coin ${coin.name} does not exist in changeArr.`);
    }
  });

  // Now update the UI to reflect these new values
  updateCoinValuesStart(); // Reuse the function to update UI
};

////////////
////////////
////////////
// CHANGE //
// TO GIVE /
////////////
////////////
////////////

// -------------------------
// CHECK CHANGE: Check and calculate change
// -------------------------
const checkChange = () => {
  const cleanedInput = cleanInput(userInput.value);

  if (cleanedInput === price) {
    changeDue.textContent = "No change due - customer paid with exact cash";
    addToRegister(cleanedInput);
    return; // Exit the function early
  }

  if (cleanedInput < price) {
    result.classList.add("alert");
    result.textContent = "Not enough cash to pay!";
    result.style.display = "block";
    alert("Customer does not have enough money to purchase the item");
    return; // Exit the function early
  }

  // Calculate and update change
  const changeArrayProposed = calculateChange(price, cleanedInput);

  if (changeArrayProposed.length === 0) {
    result.classList.add("alert");
    result.textContent = "Insufficient funds to provide change.";
  } else {
    // When giving change
    result.classList.remove("alert");
    result.textContent = "Change available!";
    updateChangeDueUI(changeArrayProposed);
    console.log("Proposed Change Values:", JSON.stringify(changeArrayProposed));
  }
};

// -------------------------
// CALCULATE CHANGE: Calculates the change to give back (if possible)
// -------------------------
const calculateChange = (price, paid) => {
  let change = Math.round((paid - price) * 100);
  const changeGiven = [];
  const coinChange = [...coinValues];

  if (change < 0) {
    // Not enough money
    alert("Insufficient funds to cover the price.");
    return [];
  }

  for (let i = coinChange.length - 1; i >= 0; i--) {
    let coinValue = Math.round(coinChange[i].value * 100);
    let coinName = coinChange[i].name;
    let coinAvailable = Math.round(changeArr[coinName] * 100);
    let coinAmount = Math.min(
      Math.floor(change / coinValue),
      Math.floor(coinAvailable / coinValue)
    );

    if (coinAmount > 0) {
      // Push amount for a coin
      changeGiven.push({
        name: coinName,
        value: coinValue / 100,
        amount: coinAmount,
      });
      change -= coinAmount * coinValue; // Remaining change to distribute
      changeArr[coinName] -= coinAmount * (coinValue / 100); // Subtract from coin
    }
  }

  if (change > 0) {
    // Not enough change
    alert("Insufficient funds to provide change.");
    return [];
  }

  return changeGiven;
};

// -------------------------
// UPDATE CHANGE DUE UI: Shows change due
// -------------------------
const updateChangeDueUI = (array) => {
  /*penny.style.display = "none";
  nickel.style.display = "none";
  dime.style.display = "none";
  quarter.style.display = "none";
  one.style.display = "none";
  five.style.display = "none";
  ten.style.display = "none";
  twenty.style.display = "none";
  oneHundred.style.display = "none";*/

  array.forEach((coin) => {
    const coinElement = document.getElementById(coin.name);
    coinElement.textContent = (coin.amount * coin.value).toFixed(2);
    /*coinElement.style.display = "inline";*/
  });
};

// Temp Change Due Text Content
const changeDueTemp = changeDue.innerHTML;

////////////
////////////
////////////
/// BTNS ///
////////////
////////////
////////////

// -------------------------
// BUTTONS CLICK: Dot and back delete
// -------------------------

function buttonClick(value) {
  if (isNaN(parseInt(value))) {
    handleSymbol(value);
  } else {
    handleNumber(value);
  }
  rerenderScreen();
}

function handleNumber(value) {
  if (buffer === "") {
    buffer = value;
  } else {
    buffer += value;
  }
}

function handleSymbol(value) {
  switch (value) {
    case "dot":
      if (!buffer.includes(".")) {
        buffer += ".";
      }
      break;
    case "backdelete":
      if (buffer.length === 1) {
        // If there's only one digit, reset to "0"
        buffer = "0";
      } else {
        // Remove the last character
        buffer = buffer.substring(0, buffer.length - 1);
      }
      break;
  }
}

////////////
////////////
////////////
// LISTEN //
////////////
////////////
////////////

// -------------------------
// ON CLICK: Switch State
// -------------------------
onBtn.addEventListener("click", turnOnOff);

// -------------------------
// TICKET CLICK: Animation
// -------------------------
ticket.addEventListener("click", ticketCutAnimation);

// -------------------------
// BUTTONS TOP CLICK: Value
// -------------------------
document.querySelector("#btns-top").addEventListener("click", function (event) {
  buttonClick(event.target.value);
});

// -------------------------
// CLEAR BTN CLICK: Clear Num
// -------------------------
clearBtn.addEventListener("click", clearNum);

// -------------------------
// BUTTONS NUMBERS CLICK: Value
// -------------------------
document
  .querySelector("#btns-numbers")
  .addEventListener("click", function (event) {
    buttonClick(event.target.value);
  });

// -------------------------
// EQUALS CLICK: Check change
// -------------------------
equalsBtn.addEventListener("click", checkChange);

// -------------------------
// KEYPRESS ENTER: Check change
// -------------------------
addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    checkChange();
  }
});
