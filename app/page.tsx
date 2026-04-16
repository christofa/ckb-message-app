import MessageForm from "@/components/MessageForm"
import MessageList from "@/components/MessageList"

export default function Home() {
  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="max-w-2xl mx-auto flex flex-col h-screen justify-center">

        {/* App header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white">
            CKB Message App 💬
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
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