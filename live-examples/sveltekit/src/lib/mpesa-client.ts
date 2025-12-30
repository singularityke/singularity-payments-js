import { createMpesaClient } from '@singularity-payments/svelte';

export const mpesaClient = createMpesaClient({
	baseUrl: '' //If they are running on different ports you can include eg("http://localhost:3000").
});
