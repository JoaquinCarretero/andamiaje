"use client"

import { useState } from "react"

export default function TestPage() {
  const [endpoint, setEndpoint] = useState("/auth/login")
  const [response, setResponse] = useState<any>(null)

  const testRequest = async () => {
    try {
      const res = await fetch(`https://andamiaje-api.onrender.com${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@test.com",
          password: "123456"
        })
      })

      const data = await res.json()
      setResponse(data)
    } catch (error) {
      setResponse({ error: String(error) })
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-lg font-bold">Probar endpoint</h1>

      <input
        type="text"
        value={endpoint}
        onChange={(e) => setEndpoint(e.target.value)}
        placeholder="/auth/login"
        className="border p-2 rounded w-full"
      />

      <button
        onClick={testRequest}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Probar
      </button>

      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
        {response ? JSON.stringify(response, null, 2) : "Sin respuesta todavía"}
      </pre>
    </div>
  )
}
