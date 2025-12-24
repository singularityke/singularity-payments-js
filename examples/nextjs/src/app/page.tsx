import { PaymentForm } from "~/app/components/payment-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-center text-4xl font-bold">
          M-Pesa Payment Example
        </h1>
        <PaymentForm />
      </div>
    </main>
  );
}
