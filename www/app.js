(function () {
  "use strict";

  // Ekranlar
  const screens = {
    start: document.getElementById("start-screen"),
    quiz: document.getElementById("quiz-screen"),
    result: document.getElementById("result-screen")
  };

  // Elementlar
  const questionCountEl = document.getElementById("question-count");
  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");
  const restartBtn = document.getElementById("restart-btn");
  const progressBar = document.getElementById("progress-bar");
  const qIndexEl = document.getElementById("q-index");
  const scoreLiveEl = document.getElementById("score-live");
  const questionTextEl = document.getElementById("question-text");
  const optionsEl = document.getElementById("options");
  const resultTextEl = document.getElementById("result-text");
  const resultMessageEl = document.getElementById("result-message");

  // Holat
  let currentIndex = 0;
  let score = 0;
  let answered = false;

  function showScreen(name) {
    Object.values(screens).forEach(function (s) {
      s.classList.remove("active");
    });
    screens[name].classList.add("active");
  }

  function startQuiz() {
    currentIndex = 0;
    score = 0;
    showScreen("quiz");
    renderQuestion();
  }

  function renderQuestion() {
    const q = QUESTIONS[currentIndex];
    answered = false;

    nextBtn.disabled = true;
    nextBtn.textContent = "Keyingi";
    progressBar.style.width = (currentIndex / QUESTIONS.length) * 100 + "%";
    qIndexEl.textContent = "Savol " + (currentIndex + 1) + " / " + QUESTIONS.length;
    scoreLiveEl.textContent = "Ball: " + score;
    questionTextEl.textContent = q.question;

    optionsEl.innerHTML = "";
    q.options.forEach(function (text, i) {
      const btn = document.createElement("button");
      btn.className = "option";
      btn.textContent = text;
      btn.addEventListener("click", function () {
        selectOption(i);
      });
      optionsEl.appendChild(btn);
    });
  }

  function selectOption(index) {
    if (answered) return;
    answered = true;

    const q = QUESTIONS[currentIndex];
    const buttons = optionsEl.querySelectorAll(".option");

    buttons.forEach(function (btn, i) {
      btn.disabled = true;
      if (i === q.answer) btn.classList.add("correct");
    });

    if (index === q.answer) {
      score++;
    } else {
      buttons[index].classList.add("wrong");
    }

    scoreLiveEl.textContent = "Ball: " + score;
    nextBtn.disabled = false;
    nextBtn.textContent = currentIndex === QUESTIONS.length - 1 ? "Yakunlash" : "Keyingi";
  }

  function nextQuestion() {
    currentIndex++;
    if (currentIndex < QUESTIONS.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    const total = QUESTIONS.length;
    const percent = Math.round((score / total) * 100);

    progressBar.style.width = "100%";
    resultTextEl.textContent = score + " / " + total + " (" + percent + "%)";
    resultMessageEl.textContent = getMessage(percent);
    showScreen("result");
  }

  function getMessage(percent) {
    if (percent === 100) return "Ajoyib! Hammasi to'g'ri.";
    if (percent >= 70) return "Yaxshi natija!";
    if (percent >= 50) return "Yomon emas, yana bir bor urinib ko'ring.";
    return "Mavzuni yana bir bor takrorlang.";
  }

  // Hodisalar
  startBtn.addEventListener("click", startQuiz);
  nextBtn.addEventListener("click", nextQuestion);
  restartBtn.addEventListener("click", startQuiz);

  // Boshlang'ich holat
  questionCountEl.textContent = "Savollar soni: " + QUESTIONS.length;
})();
