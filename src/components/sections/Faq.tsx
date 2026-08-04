"use client";

import { useState } from "react";

import { activeFaq } from "@/data/content";

/** Pristupačan akordeon. Prikazuje samo pitanja sa potvrđenim odgovorom. */
export default function Faq() {
  const [otvoreno, setOtvoreno] = useState<number | null>(0);
  if (!activeFaq.length) return null;

  return (
    <ul className="border-t border-linija-svetla">
      {activeFaq.map((f, i) => {
        const aktivno = otvoreno === i;
        return (
          <li key={f.question} className="border-b border-linija-svetla">
            <h3>
              <button
                type="button"
                onClick={() => setOtvoreno(aktivno ? null : i)}
                aria-expanded={aktivno}
                aria-controls={`faq-${i}`}
                className="flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span className="font-display text-[1.08rem] sm:text-[1.18rem]">
                  {f.question}
                </span>
                <span
                  aria-hidden
                  className={`mt-2 grid h-5 w-5 shrink-0 place-items-center text-bakar-tekst transition-transform duration-400 ease-meko ${
                    aktivno ? "rotate-45" : ""
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <path
                      d="M7 1v12M1 7h12"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={`faq-${i}`}
              hidden={!aktivno}
              className="pb-7 pr-10 text-body text-ink-2"
            >
              {f.answer}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
