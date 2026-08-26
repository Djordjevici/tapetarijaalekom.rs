import IzborProjekta from "@/components/before-after/IzborProjekta";
import Otkrij from "@/components/ui/Otkrij";
import Sekcija, { Zaglavlje } from "@/components/ui/Sekcija";
import { flags } from "@/data/site";
import { visibleProjects } from "@/data/projects";

/**
 * Pre i posle.
 *
 * Sekcija se renderuje kada je flags.beforeAfter uključen i postoje vidljivi
 * projekti (pravi ili demonstracioni preko showPlaceholderProjects).
 * Link u navigaciji: „Pre i posle" → /#radovi.
 */
export default function PreIPosle() {
  const projekti = visibleProjects(flags.showPlaceholderProjects);
  if (!projekti.length || !flags.beforeAfter) return null;

  return (
    <Sekcija id="radovi" podloga="ugljen">
      <div className="sadrzaj">
        <Zaglavlje
          nadnaslov="Pre i posle"
          naslov="Razlika se najbolje vidi na istom komadu."
          uvod="Povucite klizač i uporedite stanje komada pre i nakon radova."
          prigusen="text-mist-2"
        />

        {projekti.every((p) => p.isPlaceholder) && (
          <p className="mt-7 max-w-2xl border-l-2 border-bakar pl-4 text-malo text-mist-2">
            Demonstracioni prikaz slidera — fotografije nisu radovi Tapetarije
            Alekom. Originalni pre/posle parovi mogu se zameniti kroz centralne
            podatke bez izmene komponente.
          </p>
        )}

        <Otkrij className="mt-14">
          <IzborProjekta projekti={projekti} />
        </Otkrij>

        <Otkrij>
          <p className="mt-12 max-w-tekst border-l-2 border-bakar pl-4 text-malo text-mist-2">
            Imate komad koji razmišljate da obnovite? Pošaljite nekoliko
            fotografija i kratak opis — javićemo vam se da zajedno prođemo kroz
            mogućnosti.{" "}
            <a
              href="#procena"
              className="font-semibold text-platno underline decoration-bakar decoration-1 underline-offset-4"
            >
              Pošaljite fotografiju
            </a>
          </p>
        </Otkrij>
      </div>
    </Sekcija>
  );
}
