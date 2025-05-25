
const base_url = "https://v6.exchangerate-api.com/v6/2563c093799627ea3a64637b/pair/"; // Replace YOUR_API_KEY here

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromcurr = document.querySelector(".from select");
const tocurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector("form input");
for (let select of dropdowns) {
  for (const currcode in countryList) {
    let newopt = document.createElement("option");
    newopt.innerText = currcode;
    newopt.value = currcode;

    if (select.name === "from" && currcode === "USD") {
      newopt.selected = true;
    } else if (select.name === "to" && currcode === "INR") {
      newopt.selected = true;
    }

    select.append(newopt);
  }

  select.addEventListener("change", (evt) => {
    updateflag(evt.target);
  });

  
  updateflag(select);
}

function updateflag(element) {
  let currcode = element.value;
  let countrycode = countryList[currcode];
  let newsrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newsrc;
}

btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  let amtval = amountInput.value.trim();

  if (!amtval || isNaN(amtval) || Number(amtval) < 1) {
    amtval = 1;
    amountInput.value = "1";
  }

  const url = `${base_url}${fromcurr.value}/${tocurr.value}/${amtval}`;

  msg.innerText = "Loading...";

  try {
    const response = await fetch(url);

    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();

    if (data.result !== "success") throw new Error("Conversion failed");

    
    const converted = data.conversion_result;

    msg.innerText = `${amtval} ${fromcurr.value} = ${converted.toFixed(2)} ${tocurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching conversion rate. Please try again.";
    console.error(error);
  }
});
