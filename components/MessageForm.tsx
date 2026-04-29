"use client"
// "use client" means this component runs in the browser
// (not on the server) because it uses useState and events

import { useState } from "react"
import { storeMessage } from "@/lib/store-message"

export default function MessageForm() {

  // These are like little boxes that hold values
  // When a box changes, the UI automatically updates
  const [message, setMessage] = useState("")
  // message = what the user typed

  const [txHash, setTxHash] = useState("")
  // txHash = the receipt from CKB after storing

  const [loading, setLoading] = useState(false)
  // loading = true while waiting for CKB to respond

  const [error, setError] = useState("")
  // error = any error message to show the user

  // This runs when the user clicks "Store Message"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // e.preventDefault() stops the page from refreshing
    // (default browser behaviour for forms)

    if (!message.trim()) return
    // trim() removes empty spaces
    // if message is empty, do nothing

    // Reset previous results and show loading
    setLoading(true)
    setError("")
    setTxHash("")

    try {
      // Call our function from store-message.ts
      const hash = await storeMessage(message)
      // await means "wait for this to finish before continuing"

      setTxHash(hash)   // save the receipt
      setMessage("")    // clear the input box
    } catch (err: any) {
      // If anything goes wrong, show the error
      setError(err.message || "Something went wrong")
    } finally {
      // finally runs whether it succeeded or failed
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Store a Message on CKB
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Text area where user types their message */}
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          // onChange fires every time user types a character
          // setMessage updates the message box with new value
          placeholder="Type your message..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl p-3
                     text-sm text-gray-900 focus:outline-none
                     focus:ring-2 focus:ring-teal-400 resize-none"
        />

        {/* Submit button — disabled while loading or empty */}
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="bg-teal-500 text-white font-bold py-2.5 px-6
                     rounded-xl hover:bg-teal-600 transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Storing on chain..." : "Store Message"}
          {/* Shows different text depending on loading state */}
        </button>
      </form>

      {/* Only show this box if we have a txHash */}
      {txHash && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200
                        rounded-xl text-sm">
          <p className="font-bold text-green-700 mb-1">
            ✅ Message stored on chain!
          </p>
          <p className="text-green-600 break-all text-xs">
            TX: {txHash}
          </p>
        </div>
      )}

      {/* Only show this box if there's an error */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200
                        rounded-xl text-sm text-red-600">
          ❌ {error}
        </div>
      )}
    </div>
  )
}