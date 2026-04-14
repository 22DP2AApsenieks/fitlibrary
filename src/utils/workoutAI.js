const PAIN_KEYWORDS = [
  "pain",
  "hurt",
  "sore",
  "injury",
  "strain",
  "twinge",
  "ache",
  "stiff",
  "weak"
];
const POSITIVE_KEYWORDS = [
  "good",
  "strong",
  "easy",
  "better",
  "pr",
  "progress",
  "solid",
  "smooth",
  "clean",
  "comfortable",
  "confident"
];
const NEGATIVE_KEYWORDS = [
  "hard",
  "tired",
  "fatigued",
  "slow",
  "bad",
  "weak",
  "struggle",
  "difficult",
  "failed",
  "pain",
  "ache"
];

function normalizeText(text = "") {
  return text.toLowerCase().trim();
}

function hasKeyword(text, keywords) {
  const normalized = normalizeText(text);
  return keywords.some((keyword) => normalized.includes(keyword));
}

function collectCommentSignals(tableData) {
  const comments = tableData.map((row) => row.comment || "").filter(Boolean);
  if (!comments.length) return { pain: false, positive: false, negative: false, notes: [] };

  let pain = false;
  let positive = false;
  let negative = false;
  const notes = [];

  comments.forEach((comment) => {
    if (hasKeyword(comment, PAIN_KEYWORDS)) {
      pain = true;
      notes.push(`Note: your comment mentioned possible discomfort, e.g. \"${comment}\".`);
    }
    if (hasKeyword(comment, POSITIVE_KEYWORDS)) {
      positive = true;
    }
    if (hasKeyword(comment, NEGATIVE_KEYWORDS)) {
      negative = true;
    }
  });

  return { pain, positive, negative, notes };
}

function formatTableName(table) {
  return table
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function trendTip(currentType, monthlyProgress) {
  if (currentType === 'runtime') {
    if (monthlyProgress < -0.5) {
      return 'Your run times are improving. Keep training consistently and let recovery support the progress.';
    }
    if (monthlyProgress <= 0.5) {
      return 'Your running times are mostly stable. Try introducing tempo or interval work to move forward.';
    }
    return 'Your run times are slowing. Make sure fatigue, sleep, or warm-up are not holding you back.';
  }

  if (currentType === '1rm') {
    if (monthlyProgress > 5) {
      return 'Your lifting numbers are moving up nicely. Keep the progress gradual and keep the reps clean.';
    }
    if (monthlyProgress >= 0) {
      return 'Your strength is steady. Consistency and good technique are the best path from here.';
    }
    return 'Your strength trend is dipping. Consider backing off volume and focusing on recovery for a few sessions.';
  }

  if (monthlyProgress > 3) {
    return 'Your reps are increasing at a good pace. Keep the momentum but avoid pushing too hard too soon.';
  }
  if (monthlyProgress >= 0) {
    return 'Your rep progress is stable. Small improvements in form and consistency can help you keep advancing.';
  }
  return 'Your rep trend is dropping. It may help to reduce load, rest more, and focus on quality over quantity.';
}

export function generateWorkoutTips({ tableData = [], selectedTable = "", currentType = "", monthlyProgress = 0 }) {
  if (!selectedTable || tableData.length === 0) {
    return [
      'Select a workout and add a few sessions. The assistant uses your logged results and comments to give better guidance.',
      'Write short comments after each session: how it felt, what was easy, and what was hard.'
    ];
  }

  const tableName = formatTableName(selectedTable);
  const tips = [];
  const signal = collectCommentSignals(tableData);
  const sessions = tableData.length;
  const firstDate = new Date(tableData[0].date).toLocaleDateString();
  const lastDate = new Date(tableData[tableData.length - 1].date).toLocaleDateString();

  tips.push(`This is ${sessions} ${tableName} sessions from ${firstDate} to ${lastDate}.`);

  if (sessions < 3) {
    tips.push('You only have a few sessions here, so the guidance is lighter. Keep logging to get better insight.');
  }

  if (signal.pain) {
    tips.push('Some comments suggest discomfort. Focus on technique, rest, and avoid increasing load too quickly.');
  }

  if (signal.negative && !signal.pain) {
    tips.push('Your notes show fatigue or struggle. It may help to lower intensity or prioritize recovery for a few workouts.');
  }

  if (signal.positive && !signal.negative) {
    tips.push('Your comments sound positive. Keep doing what feels smooth and stay consistent.');
  }

  if (!signal.positive && !signal.negative && !signal.pain) {
    tips.push('You haven’t added many comments yet. Short notes about effort and feel help the assistant give more useful feedback.');
  }

  tips.push(trendTip(currentType, monthlyProgress));

  if (signal.notes.length) {
    tips.push(...signal.notes);
  }

  return [...new Set(tips)].slice(0, 6);
}
