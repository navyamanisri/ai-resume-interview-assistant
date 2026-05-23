type Analysis = {
  id: string;
  file_name: string;
  ats_score: number;
  summary: string;
  created_at: string;
};

type HistoryCardProps = {
  analyses: Analysis[];
};

export default function HistoryCard({ analyses }: HistoryCardProps) {
  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-[32px] p-8 shadow-2xl mt-10">
      <div className="mb-8">
        <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm mb-3">
          Previous Analyses
        </p>

        <h2 className="text-3xl font-bold">Resume History</h2>
      </div>

      {analyses.length === 0 ? (
        <div className="text-zinc-500">No resume analyses yet.</div>
      ) : (
        <div className="space-y-5">
          {analyses.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{item.file_name}</h3>

                <div className="bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold">
                  {item.ats_score}%
                </div>
              </div>

              <p className="text-zinc-400 leading-7">{item.summary}</p>

              <p className="text-zinc-600 text-sm mt-4">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
