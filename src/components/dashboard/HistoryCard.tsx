import { AnalysisRecord } from "@/lib/types";

type HistoryCardProps = {
  analyses: AnalysisRecord[];
  onSelectAnalysis: (record: AnalysisRecord) => void;
  activeId: string | null;
};

export default function HistoryCard({
  analyses,
  onSelectAnalysis,
  activeId,
}: HistoryCardProps) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Analysis History</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Select any past resume analysis to load its reports and interview preparation.
        </p>
      </div>

      {analyses.length === 0 ? (
        <div className="text-zinc-600 text-sm py-4">
          No previous analyses found. Upload your first resume to get started!
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {analyses.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectAnalysis(item)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-950/10 border-indigo-500/80 shadow-md shadow-indigo-500/5"
                    : "bg-zinc-950/40 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-sm text-white truncate max-w-[200px]" title={item.file_name}>
                    {item.file_name}
                  </h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                    item.ats_score >= 80
                      ? "bg-emerald-500/10 text-emerald-400"
                      : item.ats_score >= 50
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-red-500/10 text-red-400"
                  }`}>
                    {item.ats_score}% Match
                  </span>
                </div>

                <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">
                  {/* Attempt to display summary snippet */}
                  {(() => {
                    try {
                      const parsed = JSON.parse(item.summary);
                      return parsed.summary || item.summary;
                    } catch {
                      return item.summary;
                    }
                  })()}
                </p>

                <div className="text-[10px] text-zinc-600 mt-3">
                  {new Date(item.created_at).toLocaleDateString()} at{" "}
                  {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
