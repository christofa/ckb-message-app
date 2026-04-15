import MessageForm from "@/components/MessageForm"
import MessageList from "@/components/MessageList"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">

        {/* App header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            CKB Message App 💬
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Store messages permanently on the CKB blockchain
          </p>
        </div>

        {/* Form to store new messages */}
        <MessageForm />

        {/* List of all stored messages */}
        <MessageList />

      </div>
    </main>
  )
}