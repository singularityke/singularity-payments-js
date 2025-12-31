import { createMpesaClient } from '@singularity-payments/svelte';

export const mpesaClient = createMpesaClient({
	baseUrl: 'http://localhost:3001' //If they are running on different ports you can include eg("http://localhost:3000").
});
