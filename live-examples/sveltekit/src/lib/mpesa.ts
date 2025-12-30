import { createMpesa } from '@singularity-payments/sveltekit';
import { env } from '$env/dynamic/private';

export const mpesa = createMpesa(
	{
		consumerKey: env.MPESA_CONSUMER_KEY,
		consumerSecret: env.MPESA_CONSUMER_SECRET,
		passkey: env.MPESA_PASSKEY,
		shortcode: env.MPESA_SHORTCODE,
		environment: (env.MPESA_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
		callbackUrl: env.MPESA_CALLBACK_URL,
		initiatorName: 'testapi',
		securityCredential: env.MPESA_SECURITY_CREDENTIAL,
		resultUrl: env.MPESA_RESULT_URL,
		timeoutUrl: env.MPESA_TIMEOUT_URL
	},
	{
		callbackOptions: {
			onSuccess: async (data) => {
				console.log('Payment successful:', {
					amount: data.amount,
					phone: data.phoneNumber,
					receipt: data.mpesaReceiptNumber,
					transactionDate: data.transactionDate
				});
				// TODO: Save to database
			},
			onFailure: async (data) => {
				console.log('Payment failed:', {
					resultCode: data.resultCode,
					resultDesc: data.resultDescription
				});
				// TODO: Update database
			}
		}
	}
);
