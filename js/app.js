const form = document.querySelector(".form");
const emailInput = document.querySelector("#email");
const numberSelect = document.querySelector("#number");
const numberListInput = document.querySelector("#number-list");
const emailError = document.querySelector(".email-error");
const numberError = document.querySelector(".number-list__error");
const formButton = document.querySelector(".form-button");
const showEmail = document.querySelector(".email");
const showNumber = document.querySelector(".number");
const numbersList = document.querySelector(".numbers-list");
const emailUsername = document.querySelector(".email-username");
const emailDomain = document.querySelector(".email-domain");
const emailProvider = document.querySelector(".email-provider");
const emailExtension = document.querySelector(".email-extension");

let emailErrorState = true;
let numberErrorState = false;
formButton.disabled = emailErrorState;

// Email
emailInput.addEventListener("input", emailHandler);
function emailHandler() {
  const email = emailInput.value.trim();
  if (email === "") {
    showEmailError("Email is required.");
    emailErrorState = true;
  } else if (!isValidEmail(email)) {
    showEmailError("Please enter a valid email.");
    emailErrorState = true;
  } else {
    clearEmailError();
    emailErrorState = false;
  }
  formButton.disabled = emailErrorState;
}

// Number List
numberListInput.addEventListener("input", numberListHandler);
function numberListHandler() {
  const value = numberListInput.value.trim();
  const error = validateNumberList(value);
  if (error) {
    showNumberError(error);
    numberErrorState = true;
    updateFormButtonState();
    return;
  }
  clearNumberError();
  numberErrorState = false;
  updateFormButtonState();
}

// Select / Input
numberListInput.addEventListener("input", () => {
  numberSelect.disabled = numberListInput.value.trim() !== "";
});

// Submit
form.addEventListener("submit", submitHandler);
function submitHandler(event) {
  event.preventDefault();
  if (emailErrorState || numberErrorState) {
    return;
  }
  const email = emailInput.value.trim();
  const numberList = numberListInput.value.trim();
  const selectedNumber = numberSelect.value;
  let numbersArray = [];
  let generateNumber = 0;
  if (numberList !== "") {
    numbersArray = numberList
      .split(",")
      .map((number) => normalizeDigits(number.trim()))
      .filter(Boolean);
  } else {
    generateNumber = Number(selectedNumber);
  }

  if (generateNumber !== 0) {
    for (let i = 0; i < generateNumber; i++) {
      numbersArray.push(generateIranianNumber());
    }
  }
  showResult(email, numbersArray);
  console.log("Email:", email);
  console.log("Numbers:", numbersArray);
  emailInput.value = "";
  numberListInput.value = "";
  numberSelect.value = "3";
  emailErrorState = true;
  numberErrorState = false;
  updateFormButtonState();
}

// Number Validation
function validateNumberList(value) {
  if (value === "") {
    return "";
  }
  value = normalizeDigits(value);
  if (/[a-zA-Z]/.test(value)) {
    return "You must use numbers.";
  }
  if (/[^0-9+,\s]/.test(value)) {
    return "You can only use comma (,) to separate numbers.";
  }
  const numbers = value.split(",").map((number) => number.trim());
  const lastItemIsComma = value.endsWith(",");
  if (lastItemIsComma) {
    numbers.pop();
  }
  if (numbers.some((number) => number === "")) {
    return "Please enter a valid number.";
  }
  if (numbers.some((number) => !/^\+?\d+$/.test(number))) {
    return "Each item must contain only numbers.";
  }
  if (numbers.some((number) => !isIranianPhoneNumber(number))) {
    return "Enter valid Iranian mobile numbers (for example: 09112223344).";
  }
  return "";
}

function isIranianPhoneNumber(number) {
  return /^(?:09\d{9}|\+989\d{9}|00989\d{9}|989\d{9})$/.test(number);
}

function normalizeDigits(value) {
  return value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632));
}

// Email Validation
function isValidEmail(email) {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email);
}

// Errors
function showEmailError(message) {
  emailError.textContent = message;
  emailError.style.color = "red";
}

function clearEmailError() {
  emailError.textContent = "";
}

function showNumberError(message) {
  numberError.textContent = message;
  numberError.style.color = "red";
}

function clearNumberError() {
  numberError.textContent = "";
}

function updateFormButtonState() {
  formButton.disabled = emailErrorState || numberErrorState;
}

// generateIranianNumber
function generateIranianNumber() {
  const prefixes = [
    "910",
    "911",
    "912",
    "913",
    "914",
    "915",
    "916",
    "917",
    "918",
    "919",
    "930",
    "931",
    "932",
    "933",
    "934",
    "935",
    "936",
    "937",
    "938",
    "939",
    "990",
    "991",
    "992",
    "993",
    "994",
    "995",
    "996",
    "997",
    "998",
    "999",
  ];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  let number = "+98" + prefix;
  for (let i = 0; i < 7; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return number;
}

// showResult
function showResult(email, numbersArray) {
  // email
  showEmail.innerHTML = `Your Email : <span>${email}</span>`;
  const [username, domain] = email.split("@");
  const [provider, extension] = domain.split(".");
  emailUsername.textContent = `Username: ${username}`;
  emailDomain.textContent = `Domain: ${domain}`;
  emailProvider.textContent = `Provider: ${provider}`;
  emailExtension.textContent = `Extension: ${extension}`;

  // number
  let middleNumber = numbersArray[Math.floor(numbersArray.length / 2)];
  if (middleNumber.startsWith("+98")) {
    middleNumber = middleNumber.replace("+98", "09");
  } else if (middleNumber.startsWith("0098")) {
    middleNumber = middleNumber.replace("0098", "09");
  } else if (middleNumber.startsWith("98")) {
    middleNumber = middleNumber.replace("98", "09");
  }
  console.log(middleNumber);
  showNumber.innerHTML = `Your Middle Number: <span>${middleNumber.slice(0, 4)}-${middleNumber.slice(4, 7)}-${middleNumber.slice(7, 11)}</span>`;
  numbersList.innerHTML = "";
  numbersArray.forEach((number) => {
    const li = document.createElement("li");
    li.classList.add("numbers");
    li.textContent = number;
    numbersList.appendChild(li);
  });
}
