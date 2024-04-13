<template>
  <v-container class="d-flex flex-column">
    <!-- title -->
    <div class="d-flex align-center mb-3">
      <v-icon class="mr-2">mdi-currency-usd</v-icon>
      <h1 class="text-h5">Payment</h1>
    </div>

    <!-- Only mount when clientSecret is available -->
    <div id="payment-element" v-if="clientSecret"></div>
    <v-btn
      class="mt-2 ml-auto"
      color="success"
      @click="handlePayment"
      v-if="clientSecret"
    >
      Pay ${{ parseFloat(amount).toFixed(2) }}
    </v-btn>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { post } from "@/net/index.js";
import { ElMessage } from "element-plus";
import { loadStripe } from "@stripe/stripe-js";

const route = useRoute();
const router = useRouter();
const store = useStore();
const userData = computed(() => store.state.user || {});
const fundraisingProjectId = computed(
  () => store.state.fundraisingProjectId || {}
); // Get the current fundraisingProjectId from the store
const amount = ref("");

const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(publishableKey);

const clientSecret = ref("");
const elements = ref(null);

const appearance = {
  theme: "flat",
  variables: { colorPrimaryText: "#262626" },
};

const options = {
  layout: {
    type: "accordion",
    defaultCollapsed: false,
    radios: false,
    spacedAccordionItems: true,
  },
};

// Update the payment element when the clientSecret changes
watch(clientSecret, async (newSecret) => {
  if (newSecret) {
    const stripe = await stripePromise;
    elements.value = stripe.elements({ clientSecret: newSecret, appearance });
    const paymentElement = elements.value.create("payment", options);
    paymentElement.mount("#payment-element");
  }
});

// Initiate the payment
const initiatePayment = async () => {
  const data = {
    amount: amount.value,
    userId: userData.value.id,
    fundraisingProjectId: fundraisingProjectId.value,
  };

  post(
    "/api/payment/create-payment-intent",
    data,
    (response) => {
      const parsedResponse = JSON.parse(response);
      clientSecret.value = parsedResponse.clientSecret;
    },
    (message) => {
      ElMessage.warning(message);
    }
  );
};

// Handle payment and return url
const handlePayment = async () => {
  if (!clientSecret.value) {
    ElMessage.error("No payment intent has been initialized.");
    return;
  }

  const stripe = await stripePromise;
  // Resolve the named route to a full URL
  const returnUrlObject = router.resolve({ name: "fundraising-project" });
  const fullReturnUrl = window.location.origin + returnUrlObject.href;

  const result = await stripe
    .confirmPayment({
      elements: elements.value,
      confirmParams: {
        // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
        return_url: fullReturnUrl,
      },
    })
    .then(function (result) {
      // This callback function doesn't work!
      if (result.error) {
        ElMessage.error(result.error.message);
      } else {
        if (
          result.paymentIntent &&
          result.paymentIntent.status === "succeeded"
        ) {
          ElMessage.success("Payment successful!");
        }
      }
    });
};

onMounted(() => {
  amount.value = route.query.amount;
  initiatePayment();
});
</script>
