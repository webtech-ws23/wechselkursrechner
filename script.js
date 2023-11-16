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

// TODO Event Handler für die Input-Felder

// TODO Event Handler für die Dropdown-Felder

// TODO Wechselkurse herunterladen

// TODO Umrechnungen anzeigen
