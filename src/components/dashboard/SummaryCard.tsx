type SummaryCardProps = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
};

export default function SummaryCard({
  summary,
  strengths,
  weaknesses,
}: SummaryCardProps) {
  return (
    <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-lg space-y-6">
      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
          Resume Executive Report
        </p>
        <h3 className="text-xl font-bold text-white mb-3">Professional Profile Summary</h3>
        <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/20 border border-zinc-900 rounded-xl p-4">
          {summary || "No executive summary available."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 pt-2">
        {/* Strengths */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            Key Strengths
          </h4>
          {strengths.length === 0 ? (
            <p className="text-xs text-zinc-500">No strengths identified.</p>
          ) : (
            <ul className="space-y-2">
              {strengths.map((item, index) => (
                <li
                  key={index}
                  className="text-xs text-zinc-300 bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 leading-relaxed"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Weaknesses */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Areas for Growth
          </h4>
          {weaknesses.length === 0 ? (
            <p className="text-xs text-zinc-500">No core weaknesses identified.</p>
          ) : (
            <ul className="space-y-2">
              {weaknesses.map((item, index) => (
                <li
                  key={index}
                  className="text-xs text-zinc-300 bg-rose-500/5 border border-rose-500/10 rounded-lg p-3 leading-relaxed"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}