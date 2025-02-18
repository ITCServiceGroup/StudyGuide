/************************************
  study.js
************************************/

let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#question-count-selection button').forEach((button) => {
    const start = parseInt(button.dataset.start, 10);
    const end = parseInt(button.dataset.end, 10);
    button.addEventListener('click', () => startQuiz(start, end));
  });
});

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function processQuestion(question) {
  const processed = JSON.parse(JSON.stringify(question));
  const originalOptions = [...processed.options];
  let originalCorrect;

  if (processed.type === 'check_all_that_apply') {
    originalCorrect = processed.correctAnswerIndices.map(i => originalOptions[i]);
  } else {
    originalCorrect = originalOptions[processed.correctAnswerIndex];
  }

  if (processed.type !== 'true_false') {
    processed.options = shuffleArray(processed.options);
  }

  if (processed.type === 'check_all_that_apply') {
    processed.correctAnswerIndices = originalCorrect
      .map(c => processed.options.indexOf(c))
      .filter(i => i !== -1)
      .sort((a, b) => a - b);
  } else if (processed.type !== 'true_false') {
    processed.correctAnswerIndex = processed.options.indexOf(originalCorrect);
  }

  return processed;
}

function getQuestions(start, end) {
  const bank = window.questionBank;
  const selectedQuestions = shuffleArray(bank.slice(start, end));
  return selectedQuestions.map(processQuestion);
}

function startQuiz(start, end) {
  document.getElementById('question-count-selection').style.display = 'none';
  document.getElementById('quiz-description').style.display = 'none';
  document.getElementById('back-to-menu').style.display = 'none';
  document.getElementById('quiz-content').style.display = 'block';
  document.getElementById('progress-bar-container').style.display = 'block';
  document.getElementById('navigation-buttons').style.display = 'flex';

  quizQuestions = getQuestions(start, end);
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];

  // Remove existing event listeners by cloning the buttons
  const nextButton = document.getElementById('next-button');
  const checkButton = document.getElementById('check-button');

  const newNextButton = nextButton.cloneNode(true);
  nextButton.parentNode.replaceChild(newNextButton, nextButton);
  newNextButton.addEventListener('click', handleNextButton);

  const newCheckButton = checkButton.cloneNode(true);
  checkButton.parentNode.replaceChild(newCheckButton, checkButton);
  newCheckButton.addEventListener('click', handleCheckButton);

  displayQuestion(currentQuestionIndex);
}

function displayQuestion(index) {
  const question = quizQuestions[index];
  document.getElementById('question-number').textContent = `Question ${index + 1} of ${quizQuestions.length}`;

  // Display question type with a transition
  const questionTypeDiv = document.getElementById('question-type');
  questionTypeDiv.classList.remove('visible');
  questionTypeDiv.textContent = `Type: ${formatQuestionType(question.type)}`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      questionTypeDiv.classList.add('visible');
    });
  });

  document.getElementById('question-text').textContent = question.question;
  const optionsList = document.getElementById('options-list');
  optionsList.innerHTML = '';

  // Reset feedback and selections
  const feedback = document.getElementById('feedback');
  feedback.innerHTML = '';
  feedback.classList.remove('feedback-correct', 'feedback-incorrect');

  question.userSelectedAnswerIndices = question.userSelectedAnswerIndices || [];
  question.userSelectedAnswerIndex = question.userSelectedAnswerIndex || null;

  // Reset action buttons
  const checkButton = document.getElementById('check-button');
  const nextButton = document.getElementById('next-button');
  checkButton.style.display = 'none';
  checkButton.disabled = true;
  nextButton.disabled = true;

  // Render options based on question type
  if (question.type === 'true_false') {
    renderTrueFalseOptions(question, optionsList);
  } else if (question.type === 'multiple_choice') {
    renderMultipleChoiceOptions(question, optionsList);
  } else if (question.type === 'check_all_that_apply') {
    renderCheckAllThatApplyOptions(question, optionsList);
    checkButton.style.display = 'inline-block';
    checkButton.disabled = true;
  }

  updateProgressBar(index);
}

function renderTrueFalseOptions(question, optionsList) {
  question.options.forEach((option, index) => {
    optionsList.appendChild(createOptionButton(question, index, option));
  });
}

function renderMultipleChoiceOptions(question, optionsList) {
  question.options.forEach((option, index) => {
    optionsList.appendChild(createOptionButton(question, index, option));
  });
}

function renderCheckAllThatApplyOptions(question, optionsList) {
  question.options.forEach((option, index) => {
    optionsList.appendChild(createOptionButton(question, index, option, true));
  });
}

function createOptionButton(question, index, text, isCheckbox = false) {
  const button = document.createElement('button');
  button.classList.add('option-button');
  button.textContent = text;
  button.dataset.optionIndex = index;

  if (question.type === 'check_all_that_apply') {
    if (question.userSelectedAnswerIndices.includes(index)) {
      button.classList.add('selected-answer');
    }
  } else {
    if (question.userSelectedAnswerIndex === index) {
      button.classList.add('selected-answer');
    }
  }

  button.setAttribute('aria-label', `Option ${index + 1}: ${text}`);
  button.addEventListener('click', () => handleOptionClick(question, button));
  return button;
}

function handleOptionClick(question, button) {
  const selectedIndex = parseInt(button.dataset.optionIndex, 10);

  if (question.type === 'multiple_choice' || question.type === 'true_false') {
    const allButtons = document.querySelectorAll('#options-list .option-button');
    allButtons.forEach((btn) => {
      btn.classList.remove('selected-answer');
      btn.disabled = true;
    });
    button.classList.add('selected-answer');
    question.userSelectedAnswerIndex = selectedIndex;
    question.userSelectedAnswerIndices = [];
    evaluateAnswer(question, selectedIndex);
  } else if (question.type === 'check_all_that_apply') {
    if (button.classList.contains('selected-answer')) {
      button.classList.remove('selected-answer');
      const idx = question.userSelectedAnswerIndices.indexOf(selectedIndex);
      if (idx > -1) {
        question.userSelectedAnswerIndices.splice(idx, 1);
      }
    } else {
      button.classList.add('selected-answer');
      question.userSelectedAnswerIndices.push(selectedIndex);
    }
    const checkButton = document.getElementById('check-button');
    checkButton.disabled = question.userSelectedAnswerIndices.length === 0;
  }
}

function evaluateAnswer(question, selectedIndex) {
  let isCorrect = false;
  if (question.type === 'true_false' || question.type === 'multiple_choice') {
    isCorrect = selectedIndex === question.correctAnswerIndex;
  }

  const allButtons = document.querySelectorAll('#options-list .option-button');
  allButtons.forEach((btn) => {
    const btnIndex = parseInt(btn.dataset.optionIndex, 10);
    if (btnIndex === question.correctAnswerIndex) {
      btn.classList.add('correct-answer');
    }
    if (btnIndex === selectedIndex && btnIndex !== question.correctAnswerIndex) {
      btn.classList.add('incorrect-answer');
    }
  });

  const feedback = document.getElementById('feedback');
  if (isCorrect) {
    feedback.innerHTML = `Correct!<br><br><p class="explanation-title">Explanation:</p><p class="explanation-text">${question.explanation}</p>`;
    feedback.classList.add('feedback-correct');
    feedback.classList.remove('feedback-incorrect');
    score++;
  } else {
    feedback.innerHTML = `Incorrect.<br><br><p class="explanation-title">Explanation:</p><p class="explanation-text">${question.explanation}</p>`;
    feedback.classList.add('feedback-incorrect');
    feedback.classList.remove('feedback-correct');
  }

  document.getElementById('next-button').disabled = false;
}

function handleCheckButton() {
  const question = quizQuestions[currentQuestionIndex];
  const selected = question.userSelectedAnswerIndices;
  const correct = question.correctAnswerIndices;
  const isCorrect = arraysEqual(selected.sort(), correct.sort());

  const allButtons = document.querySelectorAll('#options-list .option-button');
  allButtons.forEach((btn) => {
    const btnIndex = parseInt(btn.dataset.optionIndex, 10);
    if (correct.includes(btnIndex)) {
      btn.classList.add('correct-answer');
    }
    if (selected.includes(btnIndex) && !correct.includes(btnIndex)) {
      btn.classList.add('incorrect-answer');
    }
    btn.disabled = true;
  });

  const feedback = document.getElementById('feedback');
  if (isCorrect) {
    feedback.innerHTML = `Correct!<br><br><p class="explanation-title">Explanation:</p><p class="explanation-text">${question.explanation}</p>`;
    feedback.classList.add('feedback-correct');
    feedback.classList.remove('feedback-incorrect');
    score++;
  } else {
    feedback.innerHTML = `Incorrect.<br><br><p class="explanation-title">Explanation:</p><p class="explanation-text">${question.explanation}</p>`;
    feedback.classList.add('feedback-incorrect');
    feedback.classList.remove('feedback-correct');
  }

  document.getElementById('check-button').disabled = true;
  document.getElementById('next-button').disabled = false;
}

function handleNextButton() {
  const question = quizQuestions[currentQuestionIndex];
  userAnswers.push({
    question: question.question,
    type: question.type,
    selected:
      question.type === 'check_all_that_apply'
        ? question.userSelectedAnswerIndices
        : question.userSelectedAnswerIndex,
    correct:
      question.type === 'check_all_that_apply'
        ? question.correctAnswerIndices
        : question.correctAnswerIndex,
    explanation: question.explanation,
    options: question.options
  });

  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    displayQuestion(currentQuestionIndex);
  } else {
    showFinalScore();
  }
}

function showFinalScore() {
  const percentage = ((score / quizQuestions.length) * 100).toFixed(2);
  const quizContainer = document.getElementById('quiz-container');

  let summaryHTML = `
    <div id="summary-content">
      <div style="margin-bottom: 20px;">
        <h2 style="margin-bottom: 5px;">Score: ${score}/${quizQuestions.length} (${percentage}%)</h2>
      </div>
      <div id="summary">
        <h2>Detailed Summary:</h2>
        <ul>
  `;

  userAnswers.forEach((answer, index) => {
    const isCorrect =
      answer.type === 'check_all_that_apply'
        ? arraysEqual(answer.selected.sort(), answer.correct.sort())
        : answer.selected === answer.correct;

    let userAnswerFormatted = '';
    if (answer.type === 'check_all_that_apply') {
      userAnswerFormatted =
        answer.selected.length === 0
          ? 'No answer selected'
          : answer.selected.map(idx => answer.options[idx]).join(', ');
    } else {
      userAnswerFormatted = answer.options[answer.selected] || 'No answer selected';
    }

    let correctAnswerFormatted = '';
    if (answer.type === 'check_all_that_apply') {
      correctAnswerFormatted = answer.correct.map(idx => answer.options[idx]).join(', ');
    } else {
      correctAnswerFormatted = answer.options[answer.correct];
    }

    summaryHTML += `
      <li class="summary-item">
        <div class="question-block">
          <p class="question-text">Question ${index + 1}: ${answer.question}</p>
          <p class="question-type">Type: ${formatQuestionType(answer.type)}</p>
          <p class="${isCorrect ? 'correct' : 'incorrect'}">Your Answer: ${userAnswerFormatted}</p>
          ${
            !isCorrect
              ? `<p class="correct">Correct Answer: ${correctAnswerFormatted}</p>`
              : ''
          }
          <p class="explanation">Explanation: ${answer.explanation}</p>
        </div>
      </li>`;
  });

  summaryHTML += `
        </ul>
      </div>
    </div>
    <button id="restart-button">Restart Quiz</button>
  `;

  quizContainer.innerHTML = summaryHTML;
  document.getElementById('restart-button').addEventListener('click', () => location.reload());
}

function formatAnswer(answer) {
  if (answer.type === 'check_all_that_apply') {
    return !answer.selected || answer.selected.length === 0
      ? 'No answer selected'
      : answer.selected.map(idx => answer.options[idx]).join(', ');
  }
  return answer.options[answer.selected] || 'No answer selected';
}

function formatCorrectAnswer(answer) {
  if (answer.type === 'check_all_that_apply') {
    return answer.correct.map(idx => answer.options[idx]).join(', ');
  }
  return answer.options[answer.correct];
}

function formatQuestionType(type) {
  switch (type) {
    case 'multiple_choice':
      return 'Multiple Choice';
    case 'true_false':
      return 'True/False';
    case 'check_all_that_apply':
      return 'Check All That Apply';
    default:
      return 'Unknown Type';
  }
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, index) => val === b[index]);
}

function updateProgressBar(index) {
  const progressBar = document.getElementById('progress-bar');
  if (!progressBar) {
    console.error('Progress bar element not found!');
    return;
  }

  if (quizQuestions.length === 0) {
    console.warn('No quiz questions available to calculate progress.');
    return;
  }

  const progress = ((index + 1) / quizQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressBar.style.transition = 'width 0.5s ease-in-out';
  console.log(`Progress updated: ${progress}%`);
}
