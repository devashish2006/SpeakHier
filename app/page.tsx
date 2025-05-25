import InterviewAgent from "./InterviewAgent/page";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-purple-400 mb-4">SpeakHier</h1>
      <InterviewAgent />
    </main>
  );
}
