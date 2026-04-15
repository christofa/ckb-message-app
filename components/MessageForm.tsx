"use client";

import { useState } from "react";
import { storeMessage } from "@/lib/store-message";

export default function MessageForm() {
  const [message, setMessage] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Reset previous results and show loading
    setLoading(true);
    setError("");
    setTxHash("");

    try {
      // Call our function from store-message.ts
      const hash = await storeMessage(message);

      setTxHash(hash);
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Store a Message on CKB
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Text area where user types their message */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
        />

        {/* Submit button — disabled while loading or empty */}
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="bg-teal-500 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Storing on chain..." : "Store Message"}
          {/* Shows different text depending on loading state */}
        </button>
      </form>

      {/* Only show this box if we have a txHash */}
      {txHash && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm">
          <p className="font-bold text-green-700 mb-1">
            ✅ Message stored on chain!
          </p>
          <p className="text-green-600 break-all text-xs">TX: {txHash}</p>
        </div>
      )}

      {/* Only show this box if there's an error */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          ❌ {error}
        </div>
      )}
    </div>
  );
}
