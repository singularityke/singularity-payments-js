"use client";

import { mpesaClient } from "@/lib/mpesa-client";
import { useState } from "react";

export default function PaymentTest() {
  const [amount, setAmount] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("254712345678"); // This is the test phone number replace with your phone number
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { data, error } = await mpesaClient.stkPush({
      amount,
      phoneNumber,

      accountReference: "Singularity",
      transactionDesc: "Singularity Payment",
    });
    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </label>
      <label>
        Phone Number:
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </label>
      <button type="submit">Pay</button>
    </form>
  );
}
