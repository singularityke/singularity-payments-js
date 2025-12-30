import { createMpesaClient } from "@singularity-payments/vue";

export const useMpesa = () => {
  const mpesaClient = createMpesaClient({
    baseUrl: "",
  });

  return {
    mpesaClient,
  };
};
