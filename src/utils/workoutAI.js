export function generateWorkoutTips({ tableData, selectedTable, currentType, monthlyProgress }) {
  if (!tableData || tableData.length < 2) return [];

  const tips = [];
  const last = tableData[tableData.length - 1];
  const prev = tableData[tableData.length - 2];
  const first = tableData[0];

  const count = tableData.length;

  const firstVal = first.reps || first.oneRepMax || first.runtime || 0;
  const lastVal = last.reps || last.oneRepMax || last.runtime || 0;

  const progressTotal = lastVal - firstVal;

  // =========================
  // 🏃 RUNNING (runtime)
  // =========================
  if (currentType === "runtime") {

    // 📊 Progress analysis
    if (monthlyProgress < -2) {
      tips.push(`🔥 Ļoti straujš progress! Tavs temps uzlabojas par ~${Math.abs(monthlyProgress).toFixed(2)} min/mēnesī. Tas nozīmē, ka tavs VO2max un aerobā kapacitāte būtiski aug. Turpini ar 2-3 strukturētiem treniņiem nedēļā (intervāli + vieglie skrējieni).`);
    } else if (monthlyProgress < -0.5) {
      tips.push(`📈 Labs progress tempā (~${Math.abs(monthlyProgress).toFixed(2)} min/mēnesī). Lai paātrinātu uzlabojumus, pievieno 1 intervālu treniņu nedēļā (piem: 6x400m ātrāk par sacensību tempu).`);
    } else if (monthlyProgress > 0.5) {
      tips.push(`⚠️ Temps pasliktinās (~+${monthlyProgress.toFixed(2)} min/mēnesī). Iespējams pārtrenēšanās vai nepietiekama atjaunošanās. Ieteikums: 1 nedēļa ar 30-40% mazāku apjomu + 7–9h miega.`);
    } else {
      tips.push(`➡️ Progress stagnē. Lai izlauztos no plato:
1) 1x nedēļā tempo skrējiens (20 min pie ~85% piepūles)
2) 1x intervāli
3) pārējie skrējieni viegli`);
    }

    // 📊 Consistency
    if (count >= 12) {
      tips.push(`🧠 Tev ir ${count} skrējieni — tas ir lielisks datu apjoms. Tu vari sākt analizēt tendences (nogurums, labākās dienas, temps vs miegs).`);
    } else {
      tips.push(`📋 Datu vēl maz (${count} sesijas). Lai AI kļūtu precīzāks, mēģini reģistrēt vismaz 10–15 skrējienus.`);
    }

    // ⚡ Last performance
    if (last.runtime && prev.runtime) {
      const delta = last.runtime - prev.runtime;

      if (delta < -1) {
        tips.push(`⚡ Pēdējais skrējiens bija būtiski ātrāks (${delta.toFixed(2)} min). Tas var nozīmēt:
- superkompensāciju
- labu atjaunošanos
👉 Nākamajā treniņā nepārspīlē, saglabā progresu.`);
      } else if (delta > 1) {
        tips.push(`😓 Pēdējais skrējiens bija lēnāks (+${delta.toFixed(2)} min). Iespējamie iemesli:
- nogurums
- miega trūkums
- pārāk liels treniņu apjoms`);
      }
    }

  }

  // =========================
  // 🏋️ STRENGTH (1RM)
  // =========================
  else if (currentType === "1rm") {

    if (monthlyProgress > 5) {
      tips.push(`💪 Ļoti straujš spēka pieaugums (+${monthlyProgress.toFixed(2)} kg/mēn). Tas nozīmē, ka:
- nervu sistēma adaptējas
- progresīvā pārslodze strādā

👉 Uzmanies no pārslodzes:
- 1 deload nedēļa ik pēc 6–8 nedēļām
- proteīns: 1.6–2.2g/kg`);
    } else if (monthlyProgress > 2) {
      tips.push(`📈 Stabils spēka progress. Ideāls diapazons ilgtermiņam.
👉 Ieteikums:
- turpini +2.5kg pie lielajiem vingrinājumiem
- fokusējies uz tehniku`);
    } else if (monthlyProgress <= 0) {
      tips.push(`⚠️ Spēks neaug vai krītas.
Iespējamie iemesli:
1) kaloriju deficīts
2) miegs <7h
3) pārtrenēšanās

👉 Risinājums:
- 1 nedēļa ar -40% apjomu
- pārbaudi uzturu`);
    }

    if (count >= 8) {
      tips.push(`📊 ${count} spēka sesijas ļauj analizēt progresu. Vari sākt izmantot periodizāciju:
- 3 nedēļas slodze
- 1 nedēļa viegla`);
    }

    // Plateau detection
    if (Math.abs(progressTotal) < 2 && count > 6) {
      tips.push(`🧱 Tu esi plateau.
👉 Lai izlauztos:
- maini atkārtojumu diapazonu (5 → 8 vai 3 → 6)
- pievieno palīgvingrinājumus`);
    }

  }

  // =========================
  // 🔁 REPS (bodyweight)
  // =========================
  else if (currentType === "reps") {

    if (monthlyProgress > 5) {
      tips.push(`🚀 Ļoti ātrs progress atkārtojumos (+${monthlyProgress.toFixed(2)} mēn).
👉 Laiks palielināt grūtību:
- pievieno svaru
- vai palēnini tempu (3 sek lejā)`);
    } else if (monthlyProgress > 2) {
      tips.push(`✅ Labs progress. Tu esi pareizajā zonā.
👉 Vari pievienot:
- pause reps
- kontrolētu negatīvo fāzi`);
    } else if (monthlyProgress <= 0) {
      tips.push(`⚠️ Atkārtojumi neaug.
👉 Ieteikums:
- “grease the groove” (bieži, bet viegli)
- 4–5 sesijas nedēļā, ne līdz atteicei`);
    }

    if (count >= 10) {
      tips.push(`📊 ${count} sesijas — laba konsekvence. Vari sākt strukturēt programmu (push/pull split).`);
    }

    // Fatigue detection
    if (last.reps && prev.reps && last.reps < prev.reps) {
      tips.push(`😴 Pēdējais rezultāts sliktāks → iespējams nogurums.
👉 Paņem 1–2 atpūtas dienas.`);
    }
  }

  // =========================
  // 🧠 UNIVERSAL SMART TIP
  // =========================

  tips.push(`🧠 Universāls ieteikums:
- Miegs: 7–9h
- Proteīns: 1.6–2.2g/kg
- Progress = slodze + atjaunošanās

Bez atjaunošanās nebūs izaugsmes.`);

  return tips;
}