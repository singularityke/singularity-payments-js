import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	console.log('🧪 TEST ENDPOINT HIT!');
	const body = await request.json();
	console.log('Body:', body);
	return json({ success: true });
};

export const GET: RequestHandler = async () => {
	console.log('🧪 TEST GET HIT!');
	return json({ message: 'Test endpoint working' });
};
