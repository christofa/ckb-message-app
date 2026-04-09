"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    console.log("Message:", message);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>CKB Message App</h1>

      <input
        type="text"
        placeholder="Enter message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />

      <br /><br />

      <button onClick={handleSubmit}>
        Store Message
      </button>
    </div>
  );
}