const c = (x) => { console.log(x) }

const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _nextQusBtn = document.getElementById('next-question');
const _submitBtn = document.getElementById('submit-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _resultScore = document.getElementById('result-score');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const registrationform = document.getElementsByClassName("registration-form");
const quizcontainer = document.getElementsByClassName("quiz-container");
const quizBody = document.getElementsByClassName('quiz-body')
const quizHead = document.getElementsByClassName('quiz-head')

const timerElement = document.getElementById("timer-element");
timerElement.style.display = 'none';

var numberOfQuestions = document.getElementById("number-question");
var level = document.getElementById("difficulty");
var questionCategory = "";

var data;

const checkbox = document.getElementsByName('category');

checkbox.forEach(function (checkitem) {
    var value = checkitem.value;
    checkitem.addEventListener('change', (event) => {
        questionCategory = value;
        console.log(questionCategory)
    })
});

let correctAnswer = "",
    correctScore = 0,
    askedCount = 0;
let totalQuestion;

// On Submit : Event Listeners 
function eventListeners() {
    _nextQusBtn.addEventListener("click", OnClickNext);
    _playAgainBtn.addEventListener("click", restartQuiz);
    _submitBtn.addEventListener("click", submitAnswer);
}

// On Submit Events
registrationform[0].addEventListener("submit", function (event) {
    event.preventDefault();
    loadQuestion();
    eventListeners();
    registrationform[0].classList.add("hide");
    quizcontainer[0].classList.remove("hide");
    quizcontainer[0].classList.add("show");
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
});


// load question from API
async function loadQuestion() {
    var numberOfQuestionsvalue = numberOfQuestions.value;
    var levelvalue = level.value;
    // var questionCategoryvalue = questionCategory.value;
    // console.log(questionCategoryvalue)
    totalQuestion = numberOfQuestionsvalue;
    const APIUrl =
        "https://opentdb.com/api.php?amount=" +
        numberOfQuestionsvalue +
        " &category= " +
        questionCategory +
        "&difficulty=" +
        levelvalue +
        "&type=" +
        "multiple";
    try {
        const result = await fetch(`${APIUrl}`);
        data = await result.json();
        _result.innerHTML = "";
        showQuestion(data.results[0]);
        console.log('results', result)
        console.log('data', data)
        _correctScore.textContent = 1;
        timerElement.style.display = 'unset';
        startTimer(1000); // 4 minutes in seconds


    } catch (error) {
        console.log(error)
    }
}

// Load Questions 1st Time + Rest Of Time When Next Ques Btn is Clicked
function showQuestion(data) {
    _nextQusBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(
        Math.floor(Math.random() * (incorrectAnswer.length + 1)),
        0,
        correctAnswer
    );

    _question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
    _options.innerHTML = `
${optionsList
            .map(
                (option, index) => `
<li> ${index + 1}. <span>${option}</span> </li>
`
            )
            .join("")}
`;
    selectOption();

}

var isSubmitted = false;

// Series of event to follow when submitting an Answer
function submitAnswer() {
    // eventListeners()
    // _submitBtn.disabled = true;
    console.log(_options.querySelector(".selected"))
    if (_options.querySelector(".selected")) {
        let selectedAnswer = _options.querySelector(".selected span").textContent;
        console.log(selectedAnswer)
        if (selectedAnswer == data.results[askedCount].correct_answer) {
            correctScore++;
            _result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
        } else {
            _result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
        }
        isSubmitted = true;
    } else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
        _submitBtn.disabled = false;
    }
}

// Next Qus Btn Operations
function OnClickNext() {
    if (isSubmitted) {
        askedCount++;
        c(askedCount)
        setCount();

        if (askedCount >= totalQuestion) {
            // setTimeout(function () {
            //     console.log("");
            // }, 5000);

            _resultScore.innerHTML += `<p>Your score is ${correctScore}.</p>`;
            _playAgainBtn.style.display = "block";
            _nextQusBtn.style.display = "none";
            quizBody[0].style.display = 'none';
            quizHead[0].style.display = 'none';
            _submitBtn.style.display = 'none';
            timerElement.style.display = 'none';


            // c(quizBody[0])
        } else if (askedCount == (totalQuestion - 1)) {
            clearInterval(timer);
            startTimer(1000)
            _result.innerHTML = ''
            showQuestion(data.results[askedCount])
            _nextQusBtn.innerText = 'Check Your Score'
        }
        else {
            // setTimeout(function () {
            clearInterval(timer);
            startTimer(1000)
            _result.innerHTML = ''
            showQuestion(data.results[askedCount])
            // }, 300);
            isSubmitted = false;
        }

    }
    else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Please submit an answer first.</p>`;
    }
}

// options selection
function selectOption() {
    _options.querySelectorAll("li").forEach(function (option) {
        option.addEventListener("click", function () {
            if (_options.querySelector(".selected")) {
                const activeOption = _options.querySelector(".selected");
                activeOption.classList.remove("selected");
            }
            option.classList.add("selected");
        });
    });
}

// Events -> Timer
function timer() {
    var sec = 20;
    var timer = setInterval(function () {
        document.getElementById('safeTimerDisplay').innerHTML = '00:' + sec;
        sec--;
        if (sec < 0) {
            clearInterval(timer);
        }
    }, 1000);
}

function setCount() {
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = askedCount + 1;
}

function restartQuiz() {
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _nextQusBtn.style.display = "block";
    _nextQusBtn.disabled = false;
    setCount();
    loadQuestion();
}

// to convert html entities into normal text of correct answer if there is any
// function HTMLDecode(textString) {
//     let doc = new DOMParser().parseFromString(textString, "text/html");
//     return doc.documentElement.textContent;
// }

var timeInSecs;
var ticker;

function startTimer(secs) {
    timeInSecs = parseInt(secs);
    ticker = setInterval("tick()", 1000);
}

function tick() {
    var secs = timeInSecs;
    if (askedCount >= totalQuestion) {

    }
    else {

        if (secs > 0) {
            timeInSecs--;
        }
        else {
            clearInterval(ticker);
            // startTimer(5 * 60); // 4 minutes in seconds
            isSubmitted = true;
            OnClickNext()
        }

        var mins = Math.floor(secs / 60);
        secs %= 60;
        var pretty = ((mins < 10) ? "0" : "") + mins + ":" + ((secs < 10) ? "0" : "") + secs;

        timerElement.innerHTML = pretty;
    }
}

// startTimer(5 * 60); // 4 minutes in seconds

//Credits to Gulzaib from Pakistan