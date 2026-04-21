// src/utils/workoutAi.js

export function generateWorkoutTips({ tableData, selectedTable, currentType, monthlyProgress }) {
  if (!tableData || tableData.length < 2) return [];

  const tips = [];
  const last = tableData[tableData.length - 1];
  const prev = tableData[tableData.length - 2];
  const count = tableData.length;

  if (currentType === "runtime") {
    if (monthlyProgress < -2) {
      tips.push("🔥 Izcils temps! Tu kļūsti ievērojami ātrāks katru mēnesi — tas ir augstākā līmeņa progress.");
    } else if (monthlyProgress < -1) {
      tips.push("📈 Lielisks tempa uzlabojums! Turpini regulāri skriet un optimizē elpošanas tehnika.");
    } else if (monthlyProgress < 0) {
      tips.push("✅ Neliels uzlabojums tempā — konsekvence atmaksājas. Pievieno intervālu treniņus ātrākai izaugsmei.");
    } else if (monthlyProgress > 1) {
      tips.push("⚠️ Tavs temps ir palēninājies. Apsver vieglākus atjaunošanās skrējienus un pārbaudi miegu un uzturu.");
    } else {
      tips.push("➡️ Temps ir stabils. Izmēģini Fartlek vai tempa skrējienus, lai izlauztos cauri plato.");
    }

    if (count >= 10) {
      tips.push(`🗓️ Izcila konsekvence — ${count} sesijas reģistrētas! Regulāra izsekošana ir viens no svarīgākajiem progresa faktoriem.`);
    } else if (count >= 5) {
      tips.push(`📋 Laba sākuma bāze ar ${count} sesijām. Turpini reģistrēt katru skrējienu precīzākai analīzei.`);
    }

    if (last && prev && last.runtime && prev.runtime) {
      const delta = last.runtime - prev.runtime;
      if (delta < -1) {
        tips.push("⚡ Pēdējais skrājiens bija tavs labākais pēdējā laikā — lieliski!");
      } else if (delta > 1) {
        tips.push("😓 Pēdējais skrājiens bija lēnāks — tas ir normāli. Atpūties un nāk nākamreiz ar svaigām kājām.");
      }
    }

  } else if (currentType === "1rm") {
    if (monthlyProgress > 5) {
      tips.push("💪 Izcili spēka pieaugumi! Pārliecinies, ka uzņem pietiekami daudz olbaltumvielu (1.6–2.2g/kg ķermeņa svara).");
    } else if (monthlyProgress > 2) {
      tips.push("📊 Stabils mēneša spēka progress. Progresīvā pārslodze darbojas — turpini palielināt svaru pakāpeniski.");
    } else if (monthlyProgress > 0) {
      tips.push("🔄 Lēns, bet stabils progress. Apsver periodizāciju — mainot intensitāti un apjomu ik pēc 4-6 nedēļām.");
    } else if (monthlyProgress < -2) {
      tips.push("🚨 1RM ir ievērojami samazinājies. Pārbaudi atveseļošanos, miegu (7–9h), kaloriju uzņemšanu un stresa līmeni.");
    } else if (monthlyProgress < 0) {
      tips.push("😓 Neliels 1RM kritums — apsver atslodzes nedēļu, pēc tam turpini ar jaunu intensitāti.");
    }

    if (count >= 8) {
      tips.push(`📈 ${count} reģistrētas 1RM sesijas — lielisks datu kopums precīzai spēka analīzei!`);
    }

  } else if (currentType === "reps") {
    if (monthlyProgress > 5) {
      tips.push("🚀 Atkārtojumu skaits strauji aug! Lai palielinātu izaicinājumu, apsver svara pievienošanu (jostas ar atsvaru).");
    } else if (monthlyProgress > 2) {
      tips.push("✅ Labs atkārtojumu progress. Kad sasniegs mērķi, sāc strādāt pie lēnākiem, kontrolētākiem kustību tempiem.");
    } else if (monthlyProgress > 0) {
      tips.push("📌 Lēns progress ar atkārtojumiem. Izmēģini 'grease the groove' metodi — bieži, bet ne līdz atteicei.");
    } else if (monthlyProgress < -2) {
      tips.push("⚠️ Atkārtojumu skaits krītas. Iespējama pārtrenēšanās — ļauj muskuļiem atpūsties un palielini olbaltumvielu uzņemšanu.");
    } else if (monthlyProgress < 0) {
      tips.push("🔍 Neliels atkārtojumu kritums. Pārbaudi, vai pietiekami atpūties starp sesijām.");
    }
  }

  return tips;
}

export async function answerWorkoutQuestion(question, context = {}) {
  if (!question || !question.trim()) return "";

  const { tableData = [], selectedTable = "", currentType = "", monthlyProgress = 0 } = context;

  const isLatvian = detectLatvian(question);
  const isGreeting = detectGreeting(question);

  // Build rich context string
  let contextString = "";
  if (selectedTable && tableData.length > 0) {
    const first = tableData[0];
    const last = tableData[tableData.length - 1];
    const firstVal = first.reps || first.oneRepMax || first.runtime || "?";
    const lastVal = last.reps || last.oneRepMax || last.runtime || "?";
    const firstDate = new Date(first.date).toLocaleDateString();
    const lastDate = new Date(last.date).toLocaleDateString();

    contextString = `
User's current tracked exercise: "${selectedTable}" (type: ${currentType}).
Monthly progress rate: ${monthlyProgress.toFixed(2)} ${currentType === "runtime" ? "min/month" : currentType === "1rm" ? "kg/month" : "reps/month"}.
Total logged sessions: ${tableData.length}.
First recorded value: ${firstVal} on ${firstDate}.
Most recent value: ${lastVal} on ${lastDate}.
    `.trim();
  } else {
    contextString = "The user has not selected a specific exercise yet.";
  }

  const systemPrompt = `
You are an expert, highly knowledgeable personal fitness coach and sports scientist named "FitCoach AI". 

LANGUAGE RULES (CRITICAL):
- If the user writes in Latvian, ALWAYS respond in Latvian. Never switch to English for a Latvian speaker.
- If the user writes in English, respond in English.
- If the user greets you (e.g. "hi", "hello", "sveiks", "čau", "labdien"), respond with a warm greeting in their language, introduce yourself briefly as FitCoach AI, and explain that if they mention a specific exercise or fitness topic, you can give them detailed, personalized advice. Mention that you have access to their workout data if they've selected a table.

PERSONALITY & STYLE:
- Be detailed, specific, and science-backed. Never give vague advice like "eat healthy" — give concrete numbers, methods, and reasoning.
- Be motivating but honest. If progress is poor, explain why it might be happening and what to do about it.
- When relevant, reference the user's actual data (progress rate, session count, first vs latest value).
- Use structured responses with short paragraphs or numbered steps when explaining methods.
- Keep responses focused — detailed but not overwhelming. Aim for 3–6 sentences for simple questions, up to 10–15 sentences for complex ones.

EXPERTISE AREAS:
- Strength training (progressive overload, periodization, 1RM testing, deload weeks)
- Bodyweight training (calisthenics, pull-up/dip progressions, grease-the-groove)
- Running (VO2max, tempo runs, interval training, base building, race pacing)
- Nutrition (protein intake, caloric surplus/deficit, meal timing, hydration)
- Recovery (sleep, active recovery, overtraining signs, mobility)
- Exercise form and technique
- Goal setting and program design

USER CONTEXT:
${contextString}
  `.trim();

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          { role: "user", content: question }
        ],
      }),
    });

    const data = await response.json();
    const text = data.content?.map(i => i.text || "").join("\n") || "";
    return text.trim() || (isLatvian
      ? "Atvainojiet, šobrīd nevaru saņemt atbildi. Lūdzu, mēģiniet vēlreiz."
      : "Sorry, I couldn't get a response right now. Please try again.");
  } catch (err) {
    console.error("AI error:", err);
    return isLatvian
      ? "Kļūda savienojumā ar AI treneri. Lūdzu, pārbaudi interneta savienojumu."
      : "Connection error with AI coach. Please check your internet connection.";
  }
}

function detectLatvian(text) {
  const latvianWords = [
    "sveiks", "sveiki", "labdien", "čau", "cau", "kā", "ka", "ir", "nav",
    "man", "es", "tu", "mēs", "viņš", "viņa", "kas", "ko", "kur", "kad",
    "labi", "slikti", "palīdzi", "palīdziet", "vēlos", "gribu", "treniņš",
    "skriešana", "spēks", "svars", "vingrinājums", "progress", "mērķis",
    "paldies", "lūdzu", "jā", "nē", "arī", "bet", "un", "vai", "cik",
    "daudz", "mazāk", "vairāk", "labāk", "sliktāk", "ātrāk", "lēnāk"
  ];
  const lower = text.toLowerCase();
  return latvianWords.some(word => lower.includes(word));
}

function detectGreeting(text) {
  const greetings = [
    "hi", "hello", "hey", "sveiks", "sveiki", "čau", "cau",
    "labdien", "labrīt", "labvakar", "yo", "sup", "howdy"
  ];
  const lower = text.toLowerCase().trim();
  return greetings.some(g => lower === g || lower.startsWith(g + " ") || lower.startsWith(g + "!"));
}