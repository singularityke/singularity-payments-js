<script>
	import { mpesaClient } from '$lib/mpesa-client';

	let amount = 1;
	let phoneNumber = '254708374149';
	let loading = false;
	let response = null;
	let error = null;

	async function pay() {
		loading = true;
		error = null;
		response = null;

		try {
			const result = await mpesaClient.stkPush({
				amount,
				phoneNumber,
				accountReference: 'Singularity',
				transactionDesc: 'Singularity Payments'
			});
			response = result;
			console.log(result);
		} catch (err) {
			error = err.message || 'Payment failed';
			console.error(err);
		} finally {
			loading = false;
		}
	}
</script>

<div class="container">
	<h1>M-Pesa Payment</h1>

	<form on:submit|preventDefault={pay}>
		<div class="form-group">
			<label for="phone">Phone Number</label>
			<input id="phone" type="tel" bind:value={phoneNumber} placeholder="254708374149" required />
		</div>

		<div class="form-group">
			<label for="amount">Amount (KES)</label>
			<input id="amount" type="number" bind:value={amount} min="1" required />
		</div>

		<button type="submit" disabled={loading}>
			{loading ? 'Processing...' : 'Pay Now'}
		</button>
	</form>

	{#if response}
		<div class="success">Payment request sent successfully! Check your phone.</div>
	{/if}

	{#if error}
		<div class="error">
			{error}
		</div>
	{/if}
</div>
