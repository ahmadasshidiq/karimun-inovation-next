import { CircleDot, GitCommitHorizontal, Rocket, Star } from "lucide-react";

export default function IndicatorSummary({
  stage,
  score,
  completed,
  total,
}: {
  stage: string;
  score: number;
  completed: number;
  total: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex">
      <div className="col-span-2 rounded-xl bg-emerald-100 px-4 py-3 text-emerald-800 ring-1 ring-inset ring-emerald-200 sm:col-span-1 sm:min-w-36">
        <p className="text-xs text-emerald-700">Tahapan</p>
        <p className="mt-1 flex items-center gap-2 text-lg font-bold">
          <GitCommitHorizontal className="size-5" />
          {stage}
        </p>
      </div>
      <div className="rounded-xl bg-blue-600 px-4 py-3 text-white sm:min-w-36">
        <p className="text-xs text-blue-100">Skor</p>
        <p className="mt-1 flex items-center gap-2 text-xl font-bold">
          <Star className="size-5" />
          {score.toFixed(2)}
        </p>
      </div>
      <div className="rounded-xl bg-emerald-500 px-4 py-3 text-white sm:min-w-36">
        <p className="text-xs text-emerald-50">Progress</p>
        <p className="mt-1 flex items-center gap-2 text-xl font-bold">
          <Rocket className="size-5" />
          {completed}/{total}
        </p>
      </div>
    </div>
  );
}
