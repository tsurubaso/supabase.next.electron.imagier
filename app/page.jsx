export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Imagier</h1>
      <p className="mb-8 text-lg">Please log in or create an account</p>
      
      <div className="space-x-4">
        <a 
          href="/login" 
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Login
        </a>
        <a 
          href="/signup" 
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Sign Up
        </a>
      </div>
    </div>
  )
}