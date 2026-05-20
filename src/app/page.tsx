export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">
        AI Resume & Interview Assistant
      </h1>

      <p className="text-gray-300 text-xl max-w-2xl text-center px-4">
        Build smarter resumes. Prepare better interviews.
      </p>
      <button className="mt-8 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
        Get Started
      </button>
    </main>
  );
}
