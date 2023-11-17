const API_URL = 'https://www.floatrates.com/daily/eur.json';
const FAV_CURRENCIES = ['eur', 'usd', 'gbp', 'chf', 'brl', 'cny', 'jpy', 'sgd'];
const overview = document.querySelector('.overview');
const input_from = document.querySelector('input[name="from-value"]');
const input_to = document.querySelector('input[name="to-value"]');
const select_from = document.querySelector('select[name="from-currency"]');
const select_to = document.querySelector('select[name="to-currency"]');

let rates = {
  eur: {
    code: 'EUR',
    name: 'Euro',
    rate: 1,
  },
};

document.querySelectorAll('input').forEach((input) => {
  input.addEventListener('input', (event) => {
    const target = event.target;
    const amount = target.value;
    const currency = (target === input_from ? select_from : select_to).value;
    updateInputFields(target);
    updateOverview(amount, currency);
  });
});

document.querySelectorAll('select').forEach((select) => {
  select.addEventListener('change', (event) => {
    updateInputFields(event.target === select_from ? input_to : input_from);
  });
});

async function initialize() {
  try {
    const newRates = await fetch(API_URL).then((response) => response.json());

    rates = { ...rates, ...newRates };

    renderCurrencyDropdowns();
    select_from.querySelector('option[value="eur"]').selected = true;
    select_to.querySelector('option[value="usd"]').selected = true;
    updateInputFields(input_from);
    updateOverview(input_from.value, select_from.value);
  } catch {
    document.querySelector('.error-msg').style.display = 'flex';
  }
}

function updateInputFields(originInputElement) {
  if (originInputElement === input_from) {
    input_to.value = getChangedValue(originInputElement.value, select_from.value, select_to.value);
  } else {
    input_from.value = getChangedValue(originInputElement.value, select_to.value, select_from.value);
  }
}

function renderCurrencyDropdowns() {
  const fragment = document.createDocumentFragment();

  Object.values(rates).forEach((entry) => {
    const element = document.createElement('option');
    element.textContent = `${entry.code} – ${entry.name}`;
    element.value = entry.code.toLowerCase();
    fragment.appendChild(element);
  });

  select_from.appendChild(fragment.cloneNode(true));
  select_to.appendChild(fragment);
}

function updateOverview(amount, currency) {
  const list = document.createElement('ul');

  FAV_CURRENCIES.forEach((favCurrency) => {
    const element = document.createElement('li');
    element.textContent = `${favCurrency.toUpperCase()}: ${getChangedValue(amount, currency, favCurrency)}`;
    element.title = rates[favCurrency].name;
    list.appendChild(element);
  });

  overview.innerHTML = '';
  overview.appendChild(list);
}

function getChangedValue(amount, from_currency, to_currency) {
  const from = rates[from_currency].rate;
  const to = rates[to_currency].rate;
  const value = (amount / from) * to;
  // use this for correct currency formatting
  // return new Intl.NumberFormat(navigator.language, { style: 'currency', currency: to_currency }).format(value);
  return Math.round(value * 100) / 100;
}

// letsa go
initialize();
