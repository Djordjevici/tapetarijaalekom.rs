"use client";

import Image from "next/image";
import { useState } from "react";

import PrePosle from "./PrePosle";
import { img } from "@/data/images";
import type { Project } from "@/types";

/**
 * Prelazak između projekata. Namerno nije generički carousel — prelaz je
 * maskirani fade sa blagim pomerajem, bez strelica koje vire kao plugin.
 */
export default function IzborProjekta({
  projekti,
}: {
  projekti: readonly Project[];
}) {
  const [aktivan, setAktivan] = useState(0);
  const p = projekti[aktivan];
  if (!p) return null;

  const demo = p.isPlaceholder;

  return (
    <div className="grid gap-9 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-8">
        <div key={p.slug} className="animate-[fadeUp_0.6s_cubic-bezier(0.22,1,0.36,1)]">
          <PrePosle pre={p.beforeImage} posle={p.afterImage} />
        </div>

        {demo && (
          <p className="mt-3 inline-block border border-bakar/60 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-bakar-svetli">
            Demonstracioni sadržaj
          </p>
        )}
      </div>

      <div className="lg:col-span-4">
        <h3 className="text-h3">{p.title}</h3>
        <p className="mt-1.5 text-malo text-mist-3">{p.category}</p>
        <p className="mt-5 text-body text-mist-2">{p.summary}</p>

        <dl className="mt-7 grid gap-5 border-t border-linija-tamna pt-6">
          <div>
            <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-mist-3">
              Materijal
            </dt>
            <dd className="mt-1.5 text-malo text-mist-1">
              {p.materials.join(" · ")}
            </dd>
          </div>
          <div>
            <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-mist-3">
              Izvedeni radovi
            </dt>
            <dd className="mt-1.5">
              <ul className="grid gap-1.5 text-malo text-mist-1">
                {p.workPerformed.map((w) => (
                  <li key={w} className="flex gap-2.5">
                    <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-bakar" />
                    {w}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          {p.duration && (
            <div>
              <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-mist-3">
                Vreme izrade
              </dt>
              <dd className="mt-1.5 text-malo text-mist-1">{p.duration}</dd>
            </div>
          )}
        </dl>

        {projekti.length > 1 && (
          <div
            role="tablist"
            aria-label="Izbor projekta"
            className="mt-8 grid grid-cols-3 gap-2.5"
          >
            {projekti.map((proj, i) => {
              const minijatura = img(proj.afterImage);
              const aktivna = i === aktivan;
              return (
                <button
                  key={proj.slug}
                  type="button"
                  role="tab"
                  aria-selected={aktivna}
                  onClick={() => setAktivan(i)}
                  className={`group relative overflow-hidden rounded-slika border transition-colors duration-300 ${
                    aktivna
                      ? "border-bakar"
                      : "border-linija-tamna hover:border-mist-3"
                  }`}
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={minijatura.src}
                      alt=""
                      width={minijatura.width}
                      height={minijatura.height}
                      sizes="140px"
                      className="h-full w-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 transition-colors duration-300 ${
                        aktivna
                          ? "bg-ugljen/0"
                          : "bg-ugljen/45 group-hover:bg-ugljen/20"
                      }`}
                    />
                  </div>
                  <span className="absolute inset-x-0 bottom-0 bg-ugljen/80 px-2 py-1.5 text-left text-[0.72rem] font-semibold text-platno">
                    {proj.shortTitle}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
