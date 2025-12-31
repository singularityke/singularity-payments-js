<template>
  <div class="container">
    <h1>M-Pesa Payment</h1>

    <form @submit.prevent="pay">
      <div class="form-group">
        <label for="phone">Phone Number</label>
        <input
          id="phone"
          v-model="phoneNumber"
          type="tel"
          placeholder="254712345678"
          required
        />
      </div>

      <div class="form-group">
        <label for="amount">Amount (KES)</label>
        <input id="amount" v-model="amount" type="number" min="1" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Processing..." : "Pay Now" }}
      </button>
    </form>

    <div v-if="response" class="success">
      Payment request sent successfully! Check your phone.
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMpesa } from "../composables/useMpesa";

const { mpesaClient } = useMpesa();

const amount = ref(1);
const phoneNumber = ref("254712345678");
const loading = ref(false);
const response = ref(null);
const error = ref(null);

async function pay() {
  loading.value = true;
  error.value = null;
  response.value = null;

  try {
    const result = await mpesaClient.stkPush({
      amount: amount.value,
      phoneNumber: phoneNumber.value,
      accountReference: "Singularity",
      transactionDesc: "Singularity Payments",
    });
    response.value = result;
    console.log(result);
  } catch (err: any) {
    error.value = err.message || "Payment failed";
    console.error(err);
  } finally {
    loading.value = false;
  }
}
</script>
