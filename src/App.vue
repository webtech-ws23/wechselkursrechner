<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';

type Rate = { code: string; name: string; rate: number };

const API_URL = 'https://www.floatrates.com/daily/eur.json';
const FAV_CURRENCIES = ['eur', 'usd', 'gbp', 'chf', 'brl', 'cny', 'jpy', 'sgd'];
const INITIAL_CURRENCIES = {
  eur: {
    code: 'EUR',
    name: 'Euro',
    rate: 1,
  },
};
const size = (object: Record<any, any>) => Object.keys(object).length;

const fromValue = ref<number>(1000);
const toValue = ref<number>(0);
const fromCurrency = ref<string>('eur');
const toCurrency = ref<string>('usd');
const currencies = ref<Record<string, Rate>>(INITIAL_CURRENCIES);
const error = ref<boolean>(false);

const isLoading = computed(() => size(currencies.value) === size(INITIAL_CURRENCIES));
const currencyList = computed(() => Object.values(currencies.value));

function convert(amount: number, from_currency: string, to_currency: string) {
  const from = currencies.value[from_currency]?.rate ?? 0;
  const to = currencies.value[to_currency]?.rate ?? 1;
  const value = (amount / from) * to;
  return Math.round(value * 100) / 100;
}

function computeFromValue() {
  fromValue.value = convert(toValue.value, fromCurrency.value, toCurrency.value);
}

function computeToValue() {
  toValue.value = convert(fromValue.value, toCurrency.value, fromCurrency.value);
}

async function initialize() {
  try {
    const fetchedCurrencies = await fetch(API_URL).then((response) => response.json());
    currencies.value = { ...INITIAL_CURRENCIES, ...fetchedCurrencies };
    computeToValue();
  } catch {
    error.value = true;
  }
}

watch([toValue, toCurrency], computeFromValue);
watch([fromValue, fromCurrency], computeToValue);

onMounted(initialize);
</script>

<template>
  <h1>Währungsrechner</h1>

  <div class="container">
    <div class="error-msg" v-if="error">Ein unerwarteter Fehler ist aufgetreten.</div>

    <form class="amount">
      <input type="number" v-model="fromValue" />

      <select v-model="fromCurrency">
        <option
          v-for="currency in currencyList"
          :key="currency.code"
          :value="currency.code.toLowerCase()"
        >
          {{ currency.code.toUpperCase() }} – {{ currency.name }}
        </option>
      </select>

      <input type="number" v-model="toValue" />

      <select v-model="toCurrency">
        <option
          v-for="currency in currencyList"
          :key="currency.code"
          :value="currency.code.toLowerCase()"
        >
          {{ currency.code.toUpperCase() }} – {{ currency.name }}
        </option>
      </select>
    </form>

    <div class="overview">
      <span v-if="isLoading">Loading …</span>
      <ul v-else>
        <li v-for="currency in FAV_CURRENCIES" :key="currency">
          {{ currency.toUpperCase() }}: {{ convert(fromValue, fromCurrency, currency) }}
        </li>
      </ul>
    </div>
  </div>
</template>
