// ===== YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== MOBILE NAV =====
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ===== NAV BACKGROUND ON SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 40 ? '0 8px 30px rgba(0,0,0,.4)' : 'none';
});

// ===== TYPEWRITER (hero readout) =====
function typewrite(el){
  const text = el.dataset.typewriter;
  let i = 0;
  el.textContent = '';
  const cursor = setInterval(() => {
    el.textContent = text.slice(0, i) + (i % 2 === 0 ? '▌' : '');
    i++;
    if(i > text.length){
      clearInterval(cursor);
      el.textContent = text;
    }
  }, 70);
}
document.querySelectorAll('[data-typewriter]').forEach(el => {
  setTimeout(() => typewrite(el), 1300);
});

// ===== SCROLL REVEAL =====
const revealTargets = document.querySelectorAll(
  '.section-head, .file-card, .test-card, .video-card, .social-card, .id-card, .quiz-panel, .sub-cta'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => io.observe(el));

// fill progress bars once visible
const bars = document.querySelectorAll('.test-bar span');
const barIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const fill = entry.target.dataset.fill;
      entry.target.style.width = fill + '%';
      barIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
bars.forEach(b => barIO.observe(b));

// ===== CARD SPOTLIGHT (follows cursor) =====
document.querySelectorAll('.file-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

// ===== MOCK TEST DEMO ENGINE =====
const sampleQuestions = {
  intelligence: {
    title: 'INTELLIGENCE TEST — SAMPLE',
    q: 'Find the next number: 2, 6, 12, 20, 30, ?',
    options: ['36', '40', '42', '38'],
    correct: 2
  },
  pma: {
    title: 'PMA ACADEMIC — SAMPLE',
    q: 'Synonym of "Eloquent" is:',
    options: ['Silent', 'Articulate', 'Confused', 'Hesitant'],
    correct: 1
  },
  issb: {
    title: 'ISSB SCREENING — SAMPLE',
    q: 'In a group task, you should primarily aim to:',
    options: ['Dominate the discussion', 'Contribute and cooperate', 'Stay silent', 'Criticise others'],
    correct: 1
  },
  gk: {
    title: 'GENERAL KNOWLEDGE — SAMPLE',
    q: 'The currency of Pakistan is called:',
    options: ['Rupee', 'Taka', 'Dinar', 'Riyal'],
    correct: 0
  }
};

const quizTitle = document.getElementById('quizTitle');
const quizBody = document.getElementById('quizBody');
const quizTimerEl = document.getElementById('quizTimer');
const quizPanel = document.getElementById('quizPanel');
let timerInterval = null;

function startTimer(seconds){
  clearInterval(timerInterval);
  let remaining = seconds;
  updateTimerDisplay(remaining);
  timerInterval = setInterval(() => {
    remaining--;
    updateTimerDisplay(remaining);
    if(remaining <= 0){
      clearInterval(timerInterval);
      quizTimerEl.textContent = "TIME'S UP";
    }
  }, 1000);
}
function updateTimerDisplay(s){
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  quizTimerEl.textContent = `${m}:${sec}`;
}

function loadTest(key){
  const data = sampleQuestions[key];
  if(!data) return;
  quizTitle.textContent = data.title;
  startTimer(60);

  quizBody.innerHTML = `
    <p class="quiz-question">${data.q}</p>
    <div class="quiz-options">
      ${data.options.map((opt, idx) => `<button class="quiz-option" data-idx="${idx}">${String.fromCharCode(65+idx)}. ${opt}</button>`).join('')}
    </div>
  `;

  quizBody.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      const allOptions = quizBody.querySelectorAll('.quiz-option');
      allOptions.forEach(o => o.disabled = true);

      if(idx === data.correct){
        btn.classList.add('correct');
      } else {
        btn.classList.add('wrong');
        allOptions[data.correct].classList.add('correct');
      }

      clearInterval(timerInterval);
      setTimeout(() => {
        quizBody.innerHTML = `
          <div class="quiz-result">
            <strong>${idx === data.correct ? 'CORRECT' : 'NOT QUITE'}</strong>
            <p>This was a single-question preview. The full ${data.title.split(' —')[0]} contains ${ {intelligence:40,pma:50,issb:35,gk:30}[key] } timed questions.</p>
          </div>
        `;
      }, 700);
    });
  });
}

document.querySelectorAll('[data-test]').forEach(btn => {
  btn.addEventListener('click', () => {
    loadTest(btn.dataset.test);
    quizPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});