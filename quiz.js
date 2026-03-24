// Quiz Application JavaScript
let allQuestions = [];
let currentQuizzQuestions = [];
let currentQuestionIndex = 0;
let selectedAnswers = [];
let timerInterval = null;
let timeRemaining = 300; // 5 minutes in seconds
let moneyRainTimeout = null;

// Start raining money effect
function startMoneyRain() {
    const container = document.getElementById('moneyRainContainer');
    container.innerHTML = '';
    container.classList.add('active');
    
    // Create money falling elements
    const moneyCount = 30;
    for (let i = 0; i < moneyCount; i++) {
        const money = document.createElement('div');
        money.className = 'money';
        money.style.backgroundImage = 'url(./images/money.jpg)';
        money.style.left = Math.random() * 100 + '%';
        
        const duration = 2 + Math.random() * 2; // 2-4 seconds
        const delay = Math.random() * 0.5; // stagger start
        
        money.style.animation = `fall ${duration}s linear ${delay}s forwards`;
        container.appendChild(money);
    }
    
    // Stop the effect after 6 seconds
    if (moneyRainTimeout) clearTimeout(moneyRainTimeout);
    moneyRainTimeout = setTimeout(() => {
        container.classList.remove('active');
        container.innerHTML = '';
    }, 6000);
}

// Load questions from JSON file
async function loadQuestions() {
    try {
        const response = await fetch('quiz-data.json');
        const data = await response.json();
        allQuestions = data.questions;
    } catch (error) {
        console.error('Error loading quiz data:', error);
        allQuestions = [];
    }
}

// Start the quiz
function startQuiz() {
    loadQuestions().then(() => {
        if (allQuestions.length === 0) {
            alert('Error loading quiz questions. Please refresh the page.');
            return;
        }

        // Reset variables
        selectedAnswers = [];
        currentQuestionIndex = 0;
        timeRemaining = 300;
        
        // Select 5 random questions
        currentQuizzQuestions = selectRandomQuestions(5);
        
        // Hide start screen, show quiz screen
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('quizScreen').style.display = 'block';
        
        // Start timer
        startTimer();
        
        // Load first question
        loadQuestion();
    });
}

// Select random questions from the database
function selectRandomQuestions(count) {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Start countdown timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            finishQuiz();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.getElementById('timer').textContent = display;
    
    // Add warning when less than 1 minute
    const timerElement = document.getElementById('timer');
    if (timeRemaining < 60) {
        timerElement.classList.add('warning');
    } else {
        timerElement.classList.remove('warning');
    }
}

// Load and display current question
function loadQuestion() {
    const question = currentQuizzQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentQuizzQuestions.length) * 100;
    
    // Update progress bar
    document.getElementById('progressFill').style.width = progress + '%';
    
    // Update question number
    document.getElementById('questionNumber').textContent = currentQuestionIndex + 1;
    
    // Load and display image
    const quizImage = document.getElementById('quizImage');
    const imageError = document.getElementById('imageError');
    quizImage.src = question.image;
    quizImage.style.display = 'block';
    imageError.classList.add('hidden');
    
    // Generate options buttons
    displayOptions(question.options);
    
    // Enable next button only if answer is selected
    document.getElementById('nextBtn').disabled = true;
}

// Display answer options
function displayOptions(options) {
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';
    
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.textContent = option;
        btn.onclick = () => selectOption(btn, option);
        container.appendChild(btn);
    });
}

// Handle image load error
function handleImageError() {
    document.getElementById('quizImage').style.display = 'none';
    document.getElementById('imageError').classList.remove('hidden');
}

// Select an option
function selectOption(element, optionValue) {
    // Remove previous selection
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Mark new selection
    element.classList.add('selected');
    
    // Store answer
    selectedAnswers[currentQuestionIndex] = optionValue;
    
    // Enable next button
    document.getElementById('nextBtn').disabled = false;
}

// Move to next question
function nextQuestion() {
    if (currentQuestionIndex < currentQuizzQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        finishQuiz();
    }
}

// Finish the quiz and show results
function finishQuiz() {
    clearInterval(timerInterval);
    
    // Hide quiz screen, show results screen
    document.getElementById('quizScreen').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'block';
    
    // Calculate score
    const results = calculateResults();
    displayResults(results);
}

// Calculate correct and incorrect answers
function calculateResults() {
    let correct = 0;
    let incorrect = 0;
    const detailedResults = [];
    
    currentQuizzQuestions.forEach((question, index) => {
        const userAnswer = selectedAnswers[index];
        const isCorrect = userAnswer === question.correct;
        
        if (isCorrect) {
            correct++;
        } else {
            incorrect++;
        }
        
        detailedResults.push({
            questionNum: index + 1,
            questionId: question.id,
            image: question.image,
            userAnswer: userAnswer || 'Not answered',
            correctAnswer: question.correct,
            isCorrect: isCorrect
        });
    });
    
    return {
        correct: correct,
        incorrect: incorrect,
        total: currentQuizzQuestions.length,
        details: detailedResults
    };
}

// Display results on results screen
function displayResults(results) {
    // Update score display
    const score = `${results.correct}/${results.total}`;
    document.getElementById('scoreDisplay').textContent = score;
    
    // Update score message
    const percentage = Math.round((results.correct / results.total) * 100);
    let message = '';
    if (percentage === 100) {
        message = '🎉 5/5 sda yanzaga yanzaga!';
        startMoneyRain();
    } else if (percentage >= 80) {
        message = '🌟 bayr hurgey sugaa!';
    } else if (percentage >= 60) {
        message = '👍 Yanzaga bnaa! ilvv hichee araasoo!';
    } else {
        message = '📚 Suga sda!';
    }
    document.getElementById('scoreMessage').textContent = message;
    
    // Display detailed results
    const resultsSummary = document.getElementById('resultsSummary');
    resultsSummary.innerHTML = '';
    
    results.details.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        const questionNum = document.createElement('div');
        questionNum.className = 'result-question-num';
        questionNum.textContent = `Question ${result.questionNum} (ID: ${result.questionId})`;
        
        const image = document.createElement('img');
        image.className = 'result-image';
        image.src = result.image;
        image.alt = `Question ${result.questionNum}`;
        image.onclick = () => openImageModal(result.image, result.questionNum);
        image.onerror = function() {
            this.style.display = 'none';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'result-image-error';
            errorDiv.textContent = 'Image not found';
            this.parentNode.insertBefore(errorDiv, this.nextSibling);
        };
        
        const status = document.createElement('div');
        status.className = `result-status ${result.isCorrect ? 'result-correct' : 'result-incorrect'}`;
        status.textContent = result.isCorrect ? '✓ Correct' : '✗ Incorrect';
        
        const answers = document.createElement('div');
        answers.className = 'result-answer';
        if (result.isCorrect) {
            answers.textContent = `Your answer: ${result.userAnswer} ✓`;
        } else {
            answers.innerHTML = `Your answer: ${result.userAnswer}<br>Correct answer: ${result.correctAnswer}`;
        }
        
        resultItem.appendChild(questionNum);
        resultItem.appendChild(image);
        resultItem.appendChild(status);
        resultItem.appendChild(answers);
        resultsSummary.appendChild(resultItem);
    });
}

// Reset quiz to start screen
function resetQuiz() {
    // Show start screen
    document.getElementById('startScreen').style.display = 'flex';
    document.getElementById('resultsScreen').style.display = 'none';
    
    // Clear states
    selectedAnswers = [];
    currentQuestionIndex = 0;
}

// Modal functionality for full-screen image view
function openImageModal(imageSrc, questionNum) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalQuestion = document.getElementById('modalQuestion');
    
    modalImage.src = imageSrc;
    modalQuestion.textContent = `Question ${questionNum}`;
    modal.classList.add('active');
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
}

// Close modal when clicking outside the image
document.addEventListener('click', function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeImageModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeImageModal();
    }
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', loadQuestions);
