type ATSScoreCardProps = {
  score: number;
};

export default function ATSScoreCard({ score }: ATSScoreCardProps) {
  // Determine rating color
  const ratingColor =
    score >= 80
      ? "text-emerald-400 stroke-emerald-500"
      : score >= 50
      ? "text-amber-400 stroke-amber-500"
      : "text-red-400 stroke-red-500";

  // Circle path math
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-lg flex flex-col items-center justify-center text-center">
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
        Overall Match Score
      </p>

      {/* SVG Circular Progress Meter */}
      <div className="relative w-36 h-36 flex items-center justify-center mb-6">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="stroke-zinc-800"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            className={`transition-all duration-500 ${ratingColor}`}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-extrabold text-white">{score}%</span>
          <span className="text-[10px] text-zinc-500 font-medium">ATS Match</span>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-sm text-white">
          {score >= 80 ? "Highly Compatible" : score >= 50 ? "Moderate Match" : "Needs Optimization"}
        </h4>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-[200px] mx-auto">
          {score >= 80
            ? "Your resume is highly optimized for applicant tracking systems."
            : score >= 50
            ? "Good foundation, but has critical optimization opportunities."
            : "Significant formatting or keyword gaps detected. See tips."}
        </p>
      </div>
    </div>
  );
}
