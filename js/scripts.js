/* ══════════════════════════════════════════════════════════
   ST BARNABAS HOSPICE — What is End of Life Palliative Care?
   js/scripts.js
══════════════════════════════════════════════════════════ */

/* ── PAGE NAVIGATION ────────────────────────────────── */

const visited    = new Set([1]);
const TOTAL_PAGES = 7;

function updateProgressBar(num) {
  const pct   = Math.round(((num - 1) / (TOTAL_PAGES - 1)) * 100);
  const fill  = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  if (fill)  fill.style.width = pct + '%';
  if (label) {
    label.textContent = pct + '% complete';
    label.closest('.module-progress-bar').setAttribute('aria-valuenow', pct);
  }
}

function goToPage(num) {
  visited.add(num);

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(`page-${num}`);
  if (page) page.classList.add('active');

  for (let i = 1; i <= TOTAL_PAGES; i++) {
    const step = document.getElementById(`nav-${i}`);
    if (!step) continue;
    step.classList.remove('current', 'done');
    step.removeAttribute('aria-current');
    if (i === num) {
      step.classList.add('current');
      step.setAttribute('aria-current', 'step');
      step.disabled = false;
    } else if (visited.has(i)) {
      step.classList.add('done');
      step.disabled = false;
    } else {
      step.disabled = true;
    }
  }

  updateProgressBar(num);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const heading = page && page.querySelector('h1, h2');
  if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus(); }
}

function navClick(num) {
  if (visited.has(num)) goToPage(num);
}


/* ── REFLECTIVE ACTIVITY ─────────────────────────────── */

// In-memory store for the saved response (sessionStorage-like behaviour without storage API)
let savedReflection = '';

function saveReflection() {
  const textarea = document.getElementById('reflect-input');
  if (!textarea) return;
  savedReflection = textarea.value.trim();
  const banner = document.getElementById('reflect-saved-banner');
  if (banner) banner.classList.add('show');
}

function downloadReflection() {
  const textarea = document.getElementById('reflect-input');
  const text     = textarea ? textarea.value.trim() : '';
  if (!text) {
    alert('Please type your reflection before downloading.');
    return;
  }
  const content = [
    'St Barnabas Hospice — E-Learning Platform',
    'Module: What is End of Life Palliative Care?',
    'Activity: Reflective Activity — Terminology & Its Impact',
    '',
    'Question:',
    'What challenges can arise from using the terms "palliative care" and "end of life care"?',
    'What impact might this have on patients, families, and professionals?',
    '',
    'My Response:',
    text,
    '',
    `Saved: ${new Date().toLocaleString('en-GB')}`,
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'palliative-care-reflection.txt';
  a.click();
  URL.revokeObjectURL(url);
}

function openModelAnswerModal() {
  const modal = document.getElementById('model-answer-modal');
  if (!modal) return;

  // Show saved response if available
  const panel = document.getElementById('user-answer-panel');
  const text  = document.getElementById('user-answer-text');
  const live  = document.getElementById('reflect-input');
  const liveVal = live ? live.value.trim() : '';
  const display = savedReflection || liveVal;

  if (panel && text) {
    if (display) {
      text.textContent = display;
      panel.style.display = 'block';
    } else {
      panel.style.display = 'none';
    }
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeModelAnswerModal() {
  const modal = document.getElementById('model-answer-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}


/* ── PHASES & LAYERS INTERACTIVE MODEL ──────────────── */

const PHASES_REQUIRED = 4; // minimum items to explore before unlocking continue
const phasesExplored  = new Set();

// Data for phases (Wong et al 2024)
const phaseData = {
  phase: {
    1: {
      icon: '🟢', tag: 'Phase 1', name: 'Stable',
      stripe: '#0197de', iconBg: 'rgba(1,151,222,0.14)', tagColor: '#7dd3fc',
      definition: 'The person has a life-limiting illness but their symptoms are adequately controlled and their condition is not actively changing. Care during this phase focuses on maintaining quality of life, monitoring, and early advance care planning.',
      listLabel: 'Clinical characteristics',
      items: [
        'Illness present and acknowledged',
        'Symptoms managed — person can engage in daily life',
        'Palliative care can begin here, well before end of life',
        'Good opportunity to introduce advance care planning',
        'Regular review and monitoring in primary care or community setting',
      ],
      source: 'Wong et al (2024) Phases and Layers of Palliative Care Framework'
    },
    2: {
      icon: '🟡', tag: 'Phase 2', name: 'Unstable',
      stripe: '#0d9488', iconBg: 'rgba(13,148,136,0.14)', tagColor: '#5eead4',
      definition: 'An acute change or deterioration has occurred that was not expected as part of the usual illness trajectory. This may require urgent assessment and often a change in the care plan. The person may recover to a stable state, deteriorate further, or die.',
      listLabel: 'Clinical characteristics',
      items: [
        'Unexpected acute deterioration or new clinical problem',
        'Requires urgent assessment — often results in care plan change',
        'Person and family may need additional emotional support',
        'Review of goals of care and treatment decisions is important',
        'Person may stabilise, deteriorate, or die — uncertainty is high',
      ],
      source: 'Wong et al (2024) Phases and Layers of Palliative Care Framework'
    },
    3: {
      icon: '🟠', tag: 'Phase 3', name: 'Deteriorating',
      stripe: '#fdca0f', iconBg: 'rgba(253,202,15,0.12)', tagColor: '#fdca0f',
      definition: 'The person\'s condition is worsening gradually over weeks or months as a result of their life-limiting illness. This is the expected trajectory of decline. Advance care planning should be well established, and the focus shifts more towards comfort and quality of life.',
      listLabel: 'Clinical characteristics',
      items: [
        'Progressive functional decline over weeks or months',
        'Expected as part of illness trajectory — not a sudden change',
        'Increasing symptom burden requiring proactive management',
        'Advance care planning should be complete or underway',
        'Key time to discuss preferred place of death and ReSPECT',
      ],
      source: 'Wong et al (2024) Phases and Layers of Palliative Care Framework'
    },
    4: {
      icon: '🔴', tag: 'Phase 4', name: 'Terminal',
      stripe: '#ef4444', iconBg: 'rgba(220,38,38,0.14)', tagColor: '#fca5a5',
      definition: 'The person is in the last hours or days of life. Death is expected imminently. The focus is entirely on comfort, dignity, and supporting the person and their loved ones through this final stage. Anticipatory prescribing and clear care plans are essential.',
      listLabel: 'Clinical characteristics',
      items: [
        'Death expected within hours or days',
        'Emphasis on comfort, dignity, and symptom control',
        'Anticipatory medicines should be in place',
        'Family and carers need clear information and support',
        'Preferred place of death should be honoured where possible',
      ],
      source: 'Wong et al (2024) Phases and Layers of Palliative Care Framework'
    },
    5: {
      icon: '💜', tag: 'Phase 5', name: 'Bereavement',
      stripe: '#7c6ef5', iconBg: 'rgba(124,110,245,0.14)', tagColor: '#c4b5fd',
      definition: 'Bereavement care begins at the time of death and continues for as long as families and carers need support. Grief is a normal response to loss, but some individuals experience complicated grief that requires specialist intervention. Palliative care extends through this phase.',
      listLabel: 'Key considerations',
      items: [
        'Care and support for family and carers after death',
        'Grief is individual — responses vary greatly',
        'Anticipatory grief may have begun long before death',
        'Consider referral to bereavement services where appropriate',
        'Children in the family require specific, age-appropriate support',
      ],
      source: 'Wong et al (2024) Phases and Layers of Palliative Care Framework'
    },
  },
  layer: {
    1: {
      icon: '🩺', tag: 'Layer', name: 'Physical Care',
      stripe: '#0197de', iconBg: 'rgba(1,151,222,0.14)', tagColor: '#7dd3fc',
      definition: 'Physical care encompasses all aspects of symptom management, comfort, and clinical care. It includes pain management, breathlessness, nausea, fatigue, and other physical symptoms. The goal is not cure but the best possible quality of life within the person\'s illness.',
      listLabel: 'Examples of physical care',
      items: [
        'Pain assessment and management (pharmacological and non-pharmacological)',
        'Breathlessness management including oxygen and positioning',
        'Nausea, vomiting, and appetite support',
        'Wound care, pressure area prevention, and comfort positioning',
        'Anticipatory prescribing for common end of life symptoms',
      ],
      source: 'Wong et al (2024) Phases and Layers of Palliative Care Framework'
    },
    2: {
      icon: '🕊️', tag: 'Layer', name: 'Psychological & Emotional',
      stripe: '#7c6ef5', iconBg: 'rgba(124,110,245,0.14)', tagColor: '#c4b5fd',
      definition: 'This layer recognises that living with a life-limiting illness profoundly affects mental and emotional wellbeing. Fear, grief, loss of identity, anxiety, and depression are common. Support may range from active listening by the care team to specialist psychological or counselling services.',
      listLabel: 'Key psychological dimensions',
      items: [
        'Anticipatory grief — grief before the loss occurs',
        'Anxiety about dying, pain, and being a burden',
        'Adjustment to changing roles and loss of independence',
        'Depression — often underdiagnosed in palliative patients',
        'Specialist counselling or psychological support where needed',
      ],
      source: 'Wong et al (2024) Phases and Layers of Palliative Care Framework'
    },
    3: {
      icon: '🤝', tag: 'Layer', name: 'Social & Practical',
      stripe: '#2ecc8e', iconBg: 'rgba(46,204,142,0.12)', tagColor: '#6ee7b7',
      definition: 'Serious illness affects not just the individual but everyone around them. This layer addresses family and carer wellbeing, social connection, financial hardship, and practical day-to-day needs. Social isolation is a significant and often overlooked risk factor.',
      listLabel: 'Social and practical considerations',
      items: [
        'Carer support — recognising and preventing carer burnout',
        'Financial hardship — benefits, CHC, and welfare advice',
        'Home adaptations, equipment, and care packages',
        'Risk of social isolation and loneliness',
        'Safeguarding considerations for vulnerable individuals',
      ],
      source: 'Wong et al (2024) Phases and Layers of Palliative Care Framework'
    },
    4: {
      icon: '✨', tag: 'Layer', name: 'Spiritual & Cultural',
      stripe: '#fdca0f', iconBg: 'rgba(253,202,15,0.1)', tagColor: '#fde68a',
      definition: 'Spiritual wellbeing — which may or may not be religious — relates to meaning, purpose, peace, and identity in the face of death. Cultural beliefs shape how people understand illness, dying, and death. Sensitive, respectful attention to these dimensions is central to person-centred palliative care.',
      listLabel: 'Key dimensions',
      items: [
        'Religious practices, rituals, and faith community support',
        'Cultural beliefs about death, dying, and the afterlife',
        'Meaning-making and life review',
        'Spiritual distress — existential suffering, fear, or despair',
        'Chaplaincy and spiritual care services',
      ],
      source: 'Wong et al (2024) Phases and Layers of Palliative Care Framework'
    },
    5: {
      icon: '💬', tag: 'Layer', name: 'Communication & ACP',
      stripe: '#0d9488', iconBg: 'rgba(13,148,136,0.14)', tagColor: '#5eead4',
      definition: 'Clear, compassionate communication is the thread that runs through all of palliative care. Advance Care Planning (ACP) allows people to express their wishes, values, and preferences for future care — ensuring their voice is heard even when they can no longer speak for themselves.',
      listLabel: 'Key communication elements',
      items: [
        'Honest, sensitive conversations about prognosis and goals of care',
        'Advance Care Planning — recording wishes, values, and preferences',
        'ReSPECT conversations and documentation',
        'DNACPR discussions and decision-making',
        'Lasting Power of Attorney (Health & Welfare)',
      ],
      source: 'Wong et al (2024) Phases and Layers of Palliative Care Framework'
    },
    6: {
      icon: '🔗', tag: 'Layer', name: 'Coordination & MDT',
      stripe: '#ef4444', iconBg: 'rgba(220,38,38,0.12)', tagColor: '#fca5a5',
      definition: 'Effective palliative care depends on seamless coordination across a multidisciplinary team (MDT) and across care settings. Poor coordination leads to fragmented care, avoidable hospital admissions, and unmet needs. The MDT brings together clinical, allied health, social, and voluntary sector professionals.',
      listLabel: 'Coordination in practice',
      items: [
        'MDT working — GP, specialist nurse, social worker, chaplain, OT, physio',
        'Shared care records and handover between settings',
        'Named keyworker or care coordinator for the person and family',
        'Avoiding avoidable hospital admissions through proactive planning',
        'Hospice, community, hospital, and care home integration',
      ],
      source: 'Wong et al (2024) Phases and Layers of Palliative Care Framework'
    },
  }
};

function openPhaseDetail(type, id) {
  const key  = `${type}-${id}`;
  const data = phaseData[type] && phaseData[type][id];
  if (!data) return;

  // Track explored items
  phasesExplored.add(key);

  // Mark button as active
  document.querySelectorAll('.phase-btn, .layer-btn').forEach(b => b.classList.remove('active'));
  const btnId = type === 'phase' ? `pb-${id}` : `lb-${id}`;
  const btn   = document.getElementById(btnId);
  if (btn) btn.classList.add('active');

  // Populate modal
  const stripe = document.getElementById('phm-stripe');
  if (stripe) stripe.style.background = data.stripe;

  const icon = document.getElementById('phm-icon');
  if (icon) { icon.style.background = data.iconBg; icon.textContent = data.icon; }

  const tag = document.getElementById('phm-tag');
  if (tag) { tag.style.color = data.tagColor; tag.textContent = data.tag; }

  const title = document.getElementById('phm-title');
  if (title) title.textContent = data.name;

  const def = document.getElementById('phm-definition');
  if (def) def.textContent = data.definition;

  const listLabel = document.getElementById('phm-list-label');
  if (listLabel) listLabel.textContent = data.listLabel;

  const list = document.getElementById('phm-list');
  if (list) {
    list.innerHTML = `<ul class="phase-detail-list">${
      data.items.map(item => `
        <li>
          <div class="phase-detail-dot" style="background:${data.stripe};"></div>
          <span>${item}</span>
        </li>`).join('')
    }</ul>`;
  }

  const source = document.getElementById('phm-source');
  if (source) source.textContent = data.source;

  // Hint text
  const remaining = PHASES_REQUIRED - phasesExplored.size;
  const hint = document.getElementById('phm-hint');
  if (hint) {
    hint.textContent = phasesExplored.size < PHASES_REQUIRED
      ? `Explore ${remaining} more item${remaining !== 1 ? 's' : ''} to unlock Continue.`
      : 'All required items explored — you may now continue.';
  }

  // Open modal
  const modal = document.getElementById('phase-modal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }
}

function closePhaseModal() {
  const modal = document.getElementById('phase-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';

  // Remove active highlight from buttons
  document.querySelectorAll('.phase-btn, .layer-btn').forEach(b => b.classList.remove('active'));

  // Unlock continue if threshold met
  if (phasesExplored.size >= PHASES_REQUIRED) {
    unlockPhasesContinue();
  }
}

function unlockPhasesContinue() {
  const lockMsg = document.getElementById('phases-locked-msg');
  if (lockMsg) {
    lockMsg.innerHTML = '<span aria-hidden="true">✅</span><span>Enough items explored — you may now continue.</span>';
    lockMsg.style.color = '#6ee7b7';
  }
  const btn = document.getElementById('phases-continue-btn');
  if (btn) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor  = 'pointer';
    btn.setAttribute('aria-label', 'Continue to GMC and NICE Definitions');
    btn.focus();
  }
}


/* ── QUIZ ────────────────────────────────────────────── */

const quizData = [
  {
    question: 'Palliative care is only provided in the last days of life.',
    answer: false,
    feedbackCorrect: '✅ Correct. Palliative care can begin at the point of diagnosis with a life-limiting illness and continues throughout the illness trajectory — it is not limited to the final days or weeks of life.',
    feedbackIncorrect: '❌ Incorrect. Palliative care is not limited to the last days of life. It can begin at diagnosis and run alongside curative or life-prolonging treatment.'
  },
  {
    question: 'End of life care may begin when a person is thought to be in the last 12 months of life.',
    answer: true,
    feedbackCorrect: '✅ Correct. According to NICE and GMC guidance, a person is "approaching the end of life" when they are likely to die within the next 12 months — this is the threshold for end of life care.',
    feedbackIncorrect: '❌ Incorrect. NICE and GMC guidance defines "approaching the end of life" as when a person is likely to die within the next 12 months — this is when end of life care may begin.'
  },
  {
    question: 'Using the term "palliative care" too late can limit access to symptom control and support.',
    answer: true,
    feedbackCorrect: '✅ Correct. Delayed use of palliative care terminology can mean patients miss out on vital symptom control, advance care planning, and psychological support that could have improved their quality of life.',
    feedbackIncorrect: '❌ Incorrect. Late or avoided use of palliative care language is linked to delayed referrals, missed opportunities for symptom control, and reduced quality of life for patients and families.'
  },
  {
    question: 'Palliative care means stopping all active treatment.',
    answer: false,
    feedbackCorrect: '✅ Correct. Palliative care can be — and often is — provided alongside curative or life-prolonging treatment. It focuses on quality of life, not on withholding treatment.',
    feedbackIncorrect: '❌ Incorrect. Palliative care does not mean stopping active treatment. It can run alongside chemotherapy, radiotherapy, or other treatments, focusing on comfort and quality of life.'
  },
  {
    question: 'Clear and compassionate language can improve patient understanding and decision-making.',
    answer: true,
    feedbackCorrect: '✅ Correct. Person-centred communication that is honest, clear, and compassionate supports patients in making informed decisions about their care and helps reduce fear and uncertainty.',
    feedbackIncorrect: '❌ Incorrect. Research and guidance consistently show that clear, compassionate communication improves patient understanding, supports informed decision-making, and reduces distress.'
  }
];

let currentQuestion = 0;
let quizAnswers     = []; // { answered: bool, correct: bool }

function renderQuiz() {
  quizAnswers = quizData.map(() => ({ answered: false, correct: false }));

  // Dots
  const dotsContainer = document.getElementById('quiz-dots');
  if (dotsContainer) {
    dotsContainer.innerHTML = quizData
      .map((_, i) => `<div class="quiz-dot" id="qdot-${i}" aria-hidden="true"></div>`)
      .join('');
  }

  // Questions
  const container = document.getElementById('quiz-questions-container');
  if (!container) return;

  container.innerHTML = quizData.map((q, i) => `
    <div class="quiz-question-card${i === 0 ? ' active' : ''}" id="qcard-${i}">
      <div class="quiz-q-num">Question ${i + 1} of ${quizData.length}</div>
      <p class="quiz-q-text">${q.question}</p>
      <div class="quiz-tf-btns">
        <button class="quiz-tf-btn" id="qtrue-${i}"
                onclick="answerQuiz(${i}, true)"
                aria-label="True — Question ${i + 1}">
          ✓ True
        </button>
        <button class="quiz-tf-btn" id="qfalse-${i}"
                onclick="answerQuiz(${i}, false)"
                aria-label="False — Question ${i + 1}">
          ✗ False
        </button>
      </div>
      <div class="quiz-feedback" id="qfeedback-${i}" role="alert" aria-live="polite"></div>
      <div class="quiz-nav-row" id="qnav-${i}" style="display:none;">
        ${i > 0 ? `<button class="btn btn-secondary" onclick="showQuestion(${i - 1})" style="font-size:0.82rem; padding:10px 18px;">← Back</button>` : '<span></span>'}
        ${i < quizData.length - 1
          ? `<button class="btn btn-primary" onclick="showQuestion(${i + 1})" aria-label="Next question">Next Question →</button>`
          : `<button class="btn btn-primary" onclick="showResults()" aria-label="See your results">See Results →</button>`
        }
      </div>
    </div>
  `).join('');
}

function answerQuiz(index, userAnswer) {
  if (quizAnswers[index].answered) return;

  const q       = quizData[index];
  const correct = userAnswer === q.answer;

  quizAnswers[index].answered = true;
  quizAnswers[index].correct  = correct;

  // Style buttons
  const trueBtn  = document.getElementById(`qtrue-${index}`);
  const falseBtn = document.getElementById(`qfalse-${index}`);
  if (trueBtn)  trueBtn.disabled  = true;
  if (falseBtn) falseBtn.disabled = true;

  if (userAnswer === true) {
    if (trueBtn)  trueBtn.classList.add(correct ? 'correct-glow' : 'wrong-glow');
    if (falseBtn && !correct) falseBtn.classList.add('correct-glow');
  } else {
    if (falseBtn) falseBtn.classList.add(correct ? 'correct-glow' : 'wrong-glow');
    if (trueBtn  && !correct) trueBtn.classList.add('correct-glow');
  }

  // Feedback
  const fb = document.getElementById(`qfeedback-${index}`);
  if (fb) {
    fb.className = `quiz-feedback show ${correct ? 'correct' : 'incorrect'}`;
    fb.innerHTML = `
      <span class="quiz-feedback-badge">${correct ? '✅ Correct' : '❌ Incorrect'}</span>
      <p>${correct ? q.feedbackCorrect : q.feedbackIncorrect}</p>
    `;
  }

  // Update dot
  const dot = document.getElementById(`qdot-${index}`);
  if (dot) dot.classList.add(correct ? 'correct' : 'incorrect');

  // Show nav
  const nav = document.getElementById(`qnav-${index}`);
  if (nav) nav.style.display = 'flex';

  // Update progress text
  const progressText = document.getElementById('quiz-progress-text');
  if (progressText) progressText.textContent = `Question ${index + 1} of ${quizData.length}`;
}

function showQuestion(index) {
  document.querySelectorAll('.quiz-question-card').forEach(c => c.classList.remove('active'));
  const card = document.getElementById(`qcard-${index}`);
  if (card) {
    card.classList.add('active');
    currentQuestion = index;
  }
  const progressText = document.getElementById('quiz-progress-text');
  if (progressText) progressText.textContent = `Question ${index + 1} of ${quizData.length}`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showResults() {
  // Hide all question cards
  document.querySelectorAll('.quiz-question-card').forEach(c => c.classList.remove('active'));

  const correctCount   = quizAnswers.filter(a => a.correct).length;
  const incorrectCount = quizAnswers.filter(a => !a.correct).length;
  const pct            = Math.round((correctCount / quizData.length) * 100);

  let icon, message;
  if (pct === 100) {
    icon    = '🌟';
    message = 'Outstanding! You answered every question correctly. You have a strong understanding of palliative and end of life care terminology, definitions, and principles. Well done.';
  } else if (pct >= 80) {
    icon    = '✅';
    message = `Great work — you answered ${correctCount} out of ${quizData.length} correctly. Review any questions you found challenging and revisit the relevant sections of this module.`;
  } else if (pct >= 60) {
    icon    = '📖';
    message = `You answered ${correctCount} out of ${quizData.length} correctly. There are some areas to revisit. We recommend reviewing the GMC &amp; NICE Definitions and What is Palliative Care? sections.`;
  } else {
    icon    = '🔄';
    message = `You answered ${correctCount} out of ${quizData.length} correctly. We recommend working through the module again, paying particular attention to the definition, phases, and GMC &amp; NICE guidance sections.`;
  }

  const results = document.getElementById('quiz-results');
  if (!results) return;

  results.innerHTML = `
    <div class="quiz-results-icon" aria-hidden="true">${icon}</div>
    <div class="quiz-results-score">${pct}%</div>
    <div class="quiz-results-label">Module Complete</div>
    <div class="quiz-results-breakdown" role="list">
      <div class="quiz-result-stat" role="listitem">
        <div class="quiz-result-stat-num stat-correct">${correctCount}</div>
        <div class="quiz-result-stat-lbl">Correct</div>
      </div>
      <div class="quiz-result-stat" role="listitem">
        <div class="quiz-result-stat-num stat-incorrect">${incorrectCount}</div>
        <div class="quiz-result-stat-lbl">Incorrect</div>
      </div>
      <div class="quiz-result-stat" role="listitem">
        <div class="quiz-result-stat-num" style="color:var(--yellow);">${quizData.length}</div>
        <div class="quiz-result-stat-lbl">Total</div>
      </div>
    </div>
    <div class="quiz-results-msg">${message}</div>
    <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
      <button class="btn btn-secondary" onclick="retryQuiz()" aria-label="Retry the quiz">
        🔄 Retry Quiz
      </button>
      <button class="btn btn-primary" onclick="goToPage(1)" aria-label="Return to start of module">
        ↩ Back to Start
      </button>
    </div>
  `;

  results.classList.add('show');
  results.focus && results.setAttribute('tabindex', '-1');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function retryQuiz() {
  const results = document.getElementById('quiz-results');
  if (results) results.classList.remove('show');
  currentQuestion = 0;
  renderQuiz();
  showQuestion(0);
}


/* ── GLOBAL EVENT LISTENERS ─────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // Initialise progress bar
  updateProgressBar(1);

  // Render quiz
  renderQuiz();

  // Close modals on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', e => {
      if (e.target !== backdrop) return;
      if (backdrop.id === 'phase-modal')        closePhaseModal();
      if (backdrop.id === 'model-answer-modal') closeModelAnswerModal();
    });
  });

  // Close modals on Escape
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('phase-modal')?.classList.contains('open'))        closePhaseModal();
    if (document.getElementById('model-answer-modal')?.classList.contains('open')) closeModelAnswerModal();
  });

});
