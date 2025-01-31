/************************************
  study.js
************************************/

let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

document.addEventListener('DOMContentLoaded', () => {
  const countButtons = document.querySelectorAll('#question-count-selection button');
  countButtons.forEach(button => {
    button.addEventListener('click', function() {
      const start = parseInt(this.getAttribute('data-start'));
      const end = parseInt(this.getAttribute('data-end'));
      startQuiz(start, end);
    });
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
  
  // Store original correct answers
  const originalOptions = [...processed.options];
  let originalCorrect;
  if (processed.type === 'check_all_that_apply') {
    originalCorrect = processed.correctAnswerIndices.map(i => originalOptions[i]);
  } else {
    originalCorrect = originalOptions[processed.correctAnswerIndex];
  }

  // Shuffle options only if not a true_false question
  if (processed.type !== 'true_false') {
    // Shuffle options
    processed.options = shuffleArray(processed.options);
  }

  // Update correct answers based on shuffled options
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
  let selectedQuestions = bank.slice(start, end);
  
  // Shuffle question order
  selectedQuestions = shuffleArray(selectedQuestions);
  
  // Process each question to shuffle answers (if applicable)
  return selectedQuestions.map(processQuestion);
}

function startQuiz(start, end) {
  document.getElementById('question-count-selection').style.display = 'none';
  document.getElementById('quiz-description').style.display = 'none';
  document.getElementById('quiz-content').style.display = 'block';
  
// **Add this line to display the progress bar container**
document.getElementById('progress-bar-container').style.display = 'block';

  quizQuestions = getQuestions(start, end);
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  
  // Remove existing event listeners to prevent duplicates
  const nextButton = document.getElementById('next-button');
  const checkButton = document.getElementById('check-button');
  
  // Clone buttons to remove existing listeners
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
  
  // Display Question Type with Transition
  const questionTypeDiv = document.getElementById('question-type');
  
  // **1. Remove 'visible' class to reset the state**
  questionTypeDiv.classList.remove('visible');
  
  // **2. Set the new text content**
  questionTypeDiv.textContent = `Type: ${formatQuestionType(question.type)}`;
  
  // **3. Use requestAnimationFrame to ensure the class removal and text update are processed before adding 'visible'**
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      questionTypeDiv.classList.add('visible');
    });
  });
  
  // ... rest of your displayQuestion code ...
  
  document.getElementById('question-text').textContent = question.question;
  const optionsList = document.getElementById('options-list');
  optionsList.innerHTML = '';

  // Reset feedback
  const feedback = document.getElementById('feedback');
  feedback.innerHTML = '';
  feedback.classList.remove('feedback-correct', 'feedback-incorrect');

  // Reset selections
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

  // Update progress bar
  updateProgressBar(index);
}

function renderTrueFalseOptions(question, optionsList) {
  // Dynamically create buttons based on the actual options array
  question.options.forEach((option, index) => {
    const optionButton = createOptionButton(question, index, option);
    optionsList.appendChild(optionButton);
  });
}

function renderMultipleChoiceOptions(question, optionsList) {
  question.options.forEach((option, optionIndex) => {
    const optionButton = createOptionButton(question, optionIndex, option);
    optionsList.appendChild(optionButton);
  });
}

function renderCheckAllThatApplyOptions(question, optionsList) {
  question.options.forEach((option, optionIndex) => {
    const optionButton = createOptionButton(question, optionIndex, option, true);
    optionsList.appendChild(optionButton);
  });
}

function createOptionButton(question, index, text, isCheckbox = false) {
  const button = document.createElement('button');
  button.classList.add('option-button');
  button.textContent = text;
  button.dataset.optionIndex = index;
  
  // If previously selected, add the selected class
  if (question.type === 'check_all_that_apply') {
    if (question.userSelectedAnswerIndices.includes(index)) {
      button.classList.add('selected-answer');
    }
  } else {
    if (question.userSelectedAnswerIndex === index) {
      button.classList.add('selected-answer');
    }
  }

  // Add ARIA label for accessibility
  button.setAttribute('aria-label', `Option ${index + 1}: ${text}`);

  button.addEventListener('click', () => handleOptionClick(question, button));

  return button;
}

function handleOptionClick(question, button) {
  const selectedIndex = parseInt(button.dataset.optionIndex);
  
  if (question.type === 'multiple_choice' || question.type === 'true_false') {
    // Deselect all other buttons
    const allButtons = document.querySelectorAll('#options-list .option-button');
    allButtons.forEach(btn => {
      btn.classList.remove('selected-answer');
      btn.disabled = true; // Disable all buttons after selection
    });
    // Select the clicked button
    button.classList.add('selected-answer');
    question.userSelectedAnswerIndex = selectedIndex;
    question.userSelectedAnswerIndices = [];
    // Provide immediate feedback
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

    // Enable Check button if at least one selection
    const checkButton = document.getElementById('check-button');
    if (question.userSelectedAnswerIndices.length > 0) {
      checkButton.disabled = false;
    } else {
      checkButton.disabled = true;
    }
  }
}

function evaluateAnswer(question, selectedIndex) {
  let isCorrect = false;
  if (question.type === 'true_false' || question.type === 'multiple_choice') {
    isCorrect = selectedIndex === question.correctAnswerIndex;
  }

  // Highlight correct and incorrect answers
  const allButtons = document.querySelectorAll('#options-list .option-button');
  allButtons.forEach(btn => {
    const btnIndex = parseInt(btn.dataset.optionIndex);
    if (btnIndex === question.correctAnswerIndex) {
      btn.classList.add('correct-answer');
    }
    if (btnIndex === selectedIndex && btnIndex !== question.correctAnswerIndex) {
      btn.classList.add('incorrect-answer');
    }
  });

  // Show feedback
  const feedback = document.getElementById('feedback');
  if (isCorrect) {
    feedback.textContent = 'Correct!';
    feedback.classList.add('feedback-correct');
    feedback.classList.remove('feedback-incorrect');
    score++;
  } else {
    // Display only the explanation without the correct answer
    feedback.innerHTML = `Incorrect.<br><br>Explanation: ${question.explanation}`;
    feedback.classList.add('feedback-incorrect');
    feedback.classList.remove('feedback-correct');
  }

  // Enable Next button
  const nextButton = document.getElementById('next-button');
  nextButton.disabled = false;
}

function handleCheckButton() {
  const question = quizQuestions[currentQuestionIndex];
  const selected = question.userSelectedAnswerIndices;
  const correct = question.correctAnswerIndices;

  const isCorrect = arraysEqual(selected.sort(), correct.sort());

  // Highlight correct and incorrect answers
  const allButtons = document.querySelectorAll('#options-list .option-button');
  allButtons.forEach(btn => {
    const btnIndex = parseInt(btn.dataset.optionIndex);
    if (correct.includes(btnIndex)) {
      btn.classList.add('correct-answer');
    }
    if (selected.includes(btnIndex) && !correct.includes(btnIndex)) {
      btn.classList.add('incorrect-answer');
    }
    // Disable all buttons after checking
    btn.disabled = true;
  });

  // Show feedback
  const feedback = document.getElementById('feedback');
  if (isCorrect) {
    feedback.textContent = 'Correct!';
    feedback.classList.add('feedback-correct');
    feedback.classList.remove('feedback-incorrect');
    score++;
  } else {
    // Display only the explanation without the correct answers
    feedback.innerHTML = `Incorrect.<br><br>Explanation: ${question.explanation}`;
    feedback.classList.add('feedback-incorrect');
    feedback.classList.remove('feedback-correct');
  }

  // Disable Check button and enable Next button
  const checkButton = document.getElementById('check-button');
  const nextButton = document.getElementById('next-button');
  
  checkButton.disabled = true;
  nextButton.disabled = false;
}

function handleNextButton() {
  const question = quizQuestions[currentQuestionIndex];
  userAnswers.push({
    question: question.question,
    type: question.type,
    selected: question.type === 'check_all_that_apply' 
      ? question.userSelectedAnswerIndices 
      : question.userSelectedAnswerIndex,
    correct: question.type === 'check_all_that_apply'
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
      <div id="summary"><h2>Detailed Summary:</h2><ul>
  `;

  userAnswers.forEach((answer, index) => {
    const isCorrect = answer.type === 'check_all_that_apply' ?
      arraysEqual(answer.selected.sort(), answer.correct.sort()) :
      answer.selected === answer.correct;

    let userAnswerFormatted = '';
    if (answer.type === 'check_all_that_apply') {
      if (answer.selected.length === 0) {
        userAnswerFormatted = 'No answer selected';
      } else {
        userAnswerFormatted = answer.selected.map(idx => answer.options[idx]).join(', ');
      }
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
          <p class="question-type">Type: ${formatQuestionType(answer.type)}</p>
          <p class="question-text">Question ${index + 1}: ${answer.question}</p>
          <p class="${isCorrect ? 'correct' : 'incorrect'}">Your Answer: ${userAnswerFormatted}</p>
          ${!isCorrect ? `<p class="correct">Correct Answer: ${correctAnswerFormatted}</p>` : ''}
          <p class="explanation">Explanation: ${answer.explanation}</p>
        </div>
      </li>`;
  });

  summaryHTML += `</ul></div></div>
    <button id="restart-button">Restart Quiz</button>`;

  // Replace quiz content with summary
  quizContainer.innerHTML = summaryHTML;
  
  // Attach event listeners after the new HTML has been injected
  document.getElementById('restart-button').addEventListener('click', () => location.reload());
}

function formatAnswer(answer) {
  if (answer.type === 'check_all_that_apply') {
    if (!answer.selected || answer.selected.length === 0) return 'No answer selected';
    return answer.selected.map(idx => answer.options[idx]).join(', ');
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
  switch(type) {
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

  const progress = ((index + 1) / quizQuestions.length) * 100; // +1 to reflect the current question
  progressBar.style.width = `${progress}%`;
  progressBar.style.transition = 'width 0.5s ease-in-out';

  console.log(`Progress updated: ${progress}%`);
}