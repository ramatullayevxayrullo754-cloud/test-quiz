// Savollarni Gemini API orqali yaratish skripti.
//
// MUHIM: bu fayl www/ papkasidan tashqarida, shuning uchun APK ichiga kirmaydi.
// Ishga tushirish (kompyuterda, Node.js 18+ bilan):
//   Windows PowerShell:  $env:GEMINI_API_KEY="kalitingiz"; node tools/generate-questions.js
//   yoki pastdagi (api keyingiz) joyiga to'g'ridan-to'g'ri yozing (faqat lokal ishlatganda).

const fs = require("fs");
const path = require("path");

// === SOZLAMALAR ===
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "(api keyingiz)";
const MODEL = "gemini-2.5-flash";
const SUBJECTS = ["Matematika", "Fizika", "Tarix", "Ingliz tili", "Dasturlash"];
const QUESTIONS_PER_SUBJECT = 10;
const OUTPUT_FILE = path.join(__dirname, "..", "www", "questions.js");
// ==================

async function askGemini(subject, count) {
  const prompt = `${subject} fani bo'yicha ${count} ta test savoli tuz. O'zbek tilida yoz.
Har bir savolda aynan 4 ta variant bo'lsin va faqat bitta to'g'ri javob bo'lsin.
Javobni faqat JSON massiv ko'rinishida qaytar, boshqa matn yozma:
[{"question": "savol matni", "options": ["a", "b", "c", "d"], "answer": 0}]
"answer" - to'g'ri javob indeksi (0 dan 3 gacha).`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    }
  );

  if (!res.ok) {
    throw new Error(`${subject}: HTTP ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const text = data.candidates[0].content.parts[0].text;
  return JSON.parse(text);
}

function isValid(q) {
  return (
    q &&
    typeof q.question === "string" &&
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    Number.isInteger(q.answer) &&
    q.answer >= 0 &&
    q.answer <= 3
  );
}

async function main() {
  if (GEMINI_API_KEY === "(api keyingiz)") {
    console.error("Avval GEMINI_API_KEY ni kiriting (yoki skriptdagi (api keyingiz) joyiga yozing).");
    process.exit(1);
  }

  const all = [];

  for (const subject of SUBJECTS) {
    console.log("Yaratilmoqda:", subject);
    const list = await askGemini(subject, QUESTIONS_PER_SUBJECT);
    const valid = list
      .filter(isValid)
      .map((q) => ({
        subject: subject,
        question: q.question,
        options: q.options,
        answer: q.answer
      }));
    console.log(`  ${valid.length} ta to'g'ri savol`);
    all.push(...valid);
  }

  const content =
    "// Avtomatik yaratilgan: tools/generate-questions.js\n" +
    "const QUESTIONS = " +
    JSON.stringify(all, null, 2) +
    ";\n";

  fs.writeFileSync(OUTPUT_FILE, content, "utf8");
  console.log(`Jami ${all.length} ta savol yozildi: ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error("Xato:", err.message);
  process.exit(1);
});
