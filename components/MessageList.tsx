"use client";

import { useState, useEffect } from "react";
import { fetchMessages } from "@/lib/store-message";

// Define what a message object looks like
type Message = {
  message: string;
  txHash: string;
};

export default function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await fetchMessages();
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Header with title and refresh button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Messages on Chain</h2>
        <button
          onClick={loadMessages}
          className="text-sm text-teal-500 font-semibold hover:underline"
        >
          Refresh ↻
        </button>
      </div>

      {/* Show loading state */}
      {loading && (
        <p className="text-gray-400 text-sm">
          Fetching messages from blockchain...
        </p>
      )}

      {/* Show empty state */}
      {!loading && messages.length === 0 && (
        <p className="text-gray-400 text-sm">
          No messages found. Store your first one above!
        </p>
      )}

      {/* Show messages */}
      {!loading && messages.length > 0 && (
        <div className="flex flex-col gap-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className="p-4 bg-gray-50 rounded-xl border border-gray-100"
            >
              {/* The actual message text */}
              <p className="text-gray-900 font-medium mb-2">💬 {m.message}</p>

              {/* The transaction hash proof */}
              <p className="text-xs text-gray-400 break-all">TX: {m.txHash}</p>
            </div>
          ))}
        </div>
      )}



      <p>Powered By Chris</p>
    </div>
  );
}
