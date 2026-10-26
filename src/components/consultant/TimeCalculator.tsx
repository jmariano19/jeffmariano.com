"use client";

import { useId, useState } from "react";

/**
 * "How much time does repetitive work cost your team?"
 * A rough, editable estimate. It shows time spent, not savings: some of it can be reduced, not all.
 */

const WEEKS_PER_MONTH = 52 / 12;

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[15px] text-[#555] md:text-[16px]">
          {label}
        </label>
        <p className="text-[22px] font-semibold tabular-nums tracking-[-0.03em] md:text-[26px]" aria-hidden="true">
          {value}
          <span className="ml-1 text-[14px] font-medium text-[#9a9a9a] md:text-[15px]">{unit}</span>
        </p>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${value} ${unit}`}
        onChange={(e) => onChange(Number(e.target.value))}
        className="calc-range mt-3 w-full"
        style={{ "--fill": `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export default function TimeCalculator() {
  const [people, setPeople] = useState(6);
  const [minutes, setMinutes] = useState(30);
  const [days, setDays] = useState(5);
  const [showCost, setShowCost] = useState(false);
  const [rate, setRate] = useState(25);
  const rateId = useId();

  const weekly = (people * minutes * days) / 60;
  const monthly = weekly * WEEKS_PER_MONTH;
  const cost = monthly * rate;

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-4">
      {/* Inputs */}
      <div className="rounded-[22px] bg-white p-5 md:rounded-[32px] md:p-8">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#999]">Your team</p>
        <div className="mt-6 space-y-7">
          <Slider label="People doing repetitive tasks" value={people} min={1} max={50} step={1} unit={people === 1 ? "person" : "people"} onChange={setPeople} />
          <Slider label="Time each spends on them, per day" value={minutes} min={5} max={180} step={5} unit="min" onChange={setMinutes} />
          <Slider label="Working days per week" value={days} min={1} max={7} step={1} unit="days" onChange={setDays} />
        </div>

        <div className="mt-8 border-t border-[#ececec] pt-5">
          <label className="flex cursor-pointer items-center gap-3 text-[15px] text-[#333]">
            <input
              type="checkbox"
              checked={showCost}
              onChange={(e) => setShowCost(e.target.checked)}
              className="h-5 w-5 accent-[#111]"
            />
            Also estimate labor cost
          </label>
          {showCost && (
            <div className="mt-4 flex items-center gap-3">
              <label htmlFor={rateId} className="text-[15px] text-[#555]">
                Average hourly cost per person
              </label>
              <div className="flex items-center rounded-[10px] bg-[#f2f2f2] px-3 focus-within:ring-2 focus-within:ring-[#111]">
                <span className="text-[15px] text-[#777]" aria-hidden="true">$</span>
                <input
                  id={rateId}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={500}
                  value={rate}
                  onChange={(e) => setRate(Math.max(0, Math.min(500, Number(e.target.value) || 0)))}
                  className="h-10 w-20 bg-transparent px-1 text-[16px] font-medium tabular-nums outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Result */}
      <div className="flex flex-col justify-between rounded-[22px] bg-[#161616] p-5 text-white md:rounded-[32px] md:p-8" aria-live="polite">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/45">Estimated time on repetitive work</p>
          <p className="mt-4 text-[64px] font-bold leading-none tracking-[-0.05em] tabular-nums md:text-[88px]">
            {fmt(weekly)}
            <span className="ml-2 text-[20px] font-semibold tracking-[-0.02em] text-white/50 md:text-[24px]">hours / week</span>
          </p>
          <p className="mt-4 text-[18px] text-white/75 md:text-[20px]">
            About <span className="font-semibold text-white tabular-nums">{fmt(monthly)} hours</span> a month
            {showCost && (
              <>
                , roughly <span className="font-semibold text-white tabular-nums">${fmt(cost)}</span> of paid time
              </>
            )}
            .
          </p>
          <p className="mt-5 text-[14px] leading-[1.5] text-white/45">
            {people} {people === 1 ? "person" : "people"} × {minutes} min × {days} days ÷ 60
            {showCost ? ` · × $${rate}/hour` : ""} · a month is about {WEEKS_PER_MONTH.toFixed(2)} weeks
          </p>
        </div>
        <p className="mt-8 border-t border-white/15 pt-4 text-[13px] leading-[1.5] text-white/50">
          A rough estimate, not a promise of savings. Some of this time can usually be reduced, not all of it, and labor cost
          isn&apos;t the same as cash saved. Finding out which part is worth changing is the first step.
        </p>
      </div>
    </div>
  );
}
