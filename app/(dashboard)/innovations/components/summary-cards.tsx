"use client";

import { summaryCards, type SummaryKey } from "../page.config";

export default function SummaryCards({
  values,
}: {
  values: Record<SummaryKey, number>;
}) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      {summaryCards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.key}
            className={`${card.color} relative min-h-36 overflow-hidden rounded-xl p-5 text-white shadow-sm`}
          >
            <Icon className="absolute right-5 top-5 size-8" />
            <p className="text-[14px] font-semibold">{card.title}</p>
            <p className="mt-1 text-5xl font-semibold leading-none">
              {values[card.key]}
            </p>
            <p className="mt-2 text-[14px] text-white/90">Tahun 2026</p>
          </article>
        );
      })}
    </section>
  );
}
