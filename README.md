# Quiz Application

A web-based quiz application with 25 traffic-related questions displayed with images.

## Features

✅ **5 Random Asuultantsar** - Each quiz randomly selects 5 questions from 25 available  
✅ **5-Minute hugtsaantsar** - Countdown timer with visual warning when time is running out  
✅ **Multi songolt** - Options vary from 2 to 5 choices per question  
✅ **Instant Feedback** - Shows correct answers after quiz completion  
✅ **Responsive Design** - Works on desktop and mobile devices  

## How to Use

### 1. Add Your Images
Create an `images/` folder in the project directory and add your 25 image files:
- `1.jpg` through `25.jpg`

### 2. Open the Quiz
Simply open `index.html` in your web browser.

### 3. Take the Quiz
1. Click **Start Quiz** button
2. View the image question
3. Select the correct answer (1, 2, 3, 4, or 5)
4. Click **Next Question**
5. Complete all 5 questions before time runs out

### 4. View Results
After completing the quiz, you'll see:
- Your score (e.g., 4/5)
- A message based on your performance
- Detailed results showing which answers were correct/incorrect
- The correct answers for any you missed

## File Structure

```
traffic/
├── index.html          # Main HTML file with styling
├── quiz.js             # Quiz logic and functionality
├── quiz-data.json      # All questions and answers
├── images/             # Create this folder and add 1.jpg - 25.jpg
│   ├── 1.jpg
│   ├── 2.jpg
│   └── ... (25 total)
└── README.md           # This file
```

## Question Format

Each question in `quiz-data.json` has:
- `id` - Question number (1-25)
- `image` - Path to question image
- `options` - Array of available answer choices (1-5)
- `correct` - The correct answer number

## Customization

### Change Time Limit
Edit `quiz.js` line: `timeRemaining = 300;` (300 = 5 minutes, 600 = 10 minutes, etc.)

### Change Number of Questions Per Quiz
Edit `quiz-data.json`: Change `"questionsPerTest": 5` to desired number

### Modify Questions or Answers
Edit `quiz-data.json` with new questions and answer mappings

## Supported Browsers

- Chrome/Edge (Chromium-based)
- Firefox
- Safari  
- Any modern browser with ES6 support

## Notes

- The quiz randomly selects questions each time you start
- All images should be in the `images/` folder
- If an image fails to load, a placeholder message appears
- Your progress is shown in the progress bar at the top of the quiz
