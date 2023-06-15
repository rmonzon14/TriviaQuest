const trivia = (() => {  
    let url = "";
    let questionNum = 1;
    let questionArray;

    const getUrl = () => {
        return url
    }

    const setUrl = (value) => {
        url = value;
    };

    const getQuestionNum = () => {
        return questionNum;
    }

    const updateQuestionNum = () => {
        questionNum++;
    };

    const setQuestionArray = (value) => {
        questionArray = [...value];
    }

    const getQuestionArray = () => {
        return questionArray;
    }

    return {getUrl, setUrl, getQuestionNum, updateQuestionNum, setQuestionArray, getQuestionArray}
})();

const user = (() => {
    let score = 0;

    const setScore = (value) => {
        score = value;
    }

    const getScore = () => {
        return score;
    }

    return {getScore, setScore}
})();

const introduction = (() => {
    const introForm = document.getElementById("intro-form");
    const questionsCount = document.getElementById("questions-count");
    const category = document.getElementById("category");
    const difficulty = document.getElementById("difficulty");
    const questionsType = document.getElementById("questions-type");
    
    introForm.addEventListener("submit", (e) => {
        e.preventDefault();
        validateInput();
    });
    
    const validateInput = () => {
        const introSection = document.getElementById("intro-section");
        const error = document.getElementsByClassName("error")[0];
        const count = parseInt(questionsCount.value);
    
        if (isNaN(count)) {
            error.textContent = "Please type a number";
        } else if (count < 1) {
            error.textContent = "The number of questions should be more than one."; 
        } else {
            error.textContent = "";
            introSection.innerHTML = "";
            fetchApi();
        }
    }
    
    const generateUrl = () => {
        let url = `https://opentdb.com/api.php?amount=${parseInt(questionsCount.value)}&category=${category.value}
                    &difficulty=${difficulty.value}&type=${questionsType.value}`;
    
        if (category.value === "" && difficulty.value === "" && questionsType.value === "") {
            url = `https://opentdb.com/api.php?amount=${parseInt(questionsCount.value)}`;
        } else if (category.value === "") {
            url = `https://opentdb.com/api.php?amount=${parseInt(questionsCount.value)}&difficulty=${difficulty.value}&type=${questionsType.value}`;
        } else if (difficulty.value === "") {
            url = `https://opentdb.com/api.php?amount=${parseInt(questionsCount.value)}&category=${category.value}&type=${questionsType.value}`;
        } else if (questionsType.value === "") {
            url = `https://opentdb.com/api.php?amount=${parseInt(questionsCount.value)}&category=${category.value}&difficulty=${difficulty.value}`;
        }
    
        return url;
    }

    const fetchApi = async () => {
        trivia.setUrl(generateUrl());
    
        const requestURL = trivia.getUrl();
        const request = new Request(requestURL);
    
        const response = await fetch(request);
        const result = await response.json();
        const data = result["results"];

        trivia.setQuestionArray(data);
        start();
    }
})();

const displayQuestion = (data) => {
    const questionNum = document.getElementsByClassName("question-num")[0];
    const question = document.getElementsByClassName("question")[0];
    const correctAnswer = data[trivia.getQuestionNum() - 1]["correct_answer"];
    const choicesArray = data[trivia.getQuestionNum() - 1]["incorrect_answers"];
    const questionType = data[trivia.getQuestionNum() - 1].type;

    questionNum.textContent = `Question: ${trivia.getQuestionNum()}`;
    question.textContent = data[trivia.getQuestionNum() - 1].question;

    // Inserts the correct answer randomly for multiple choices questions. 
    choicesArray.splice(choicesArray.length * Math.random(), 0, correctAnswer);

    if (questionType === "multiple") {
        const typeMultipleUl = document.querySelector(".type-multiple"); 
        typeMultipleUl.style.display = "block";

        for (let i = 0; i < 4; i++) {
            const li = document.createElement("li");

            if (i == 0) {   
                li.innerHTML = `<span class="letter" data="${choicesArray[i]}">a. </span>${choicesArray[i]}`;
            } else if (i == 1) {
                li.innerHTML = `<span class="letter" data="${choicesArray[i]}">b. </span>${choicesArray[i]}`;
            } else if (i == 2) {
                li.innerHTML = `<span class="letter" data="${choicesArray[i]}">c. </span>${choicesArray[i]}`;
            } else if (i == 3) {
                li.innerHTML = `<span class="letter" data="${choicesArray[i]}">d. </span>${choicesArray[i]}`;
            }
            
            typeMultipleUl.appendChild(li);
        }

    } else if (questionType === "boolean") {
        const typeBooleanUl = document.querySelector(".type-boolean");
        typeBooleanUl.style.display = "block";

        for (let i = 0; i < 2; i++) {
            const li = document.createElement("li");

            if (i == 0) {   
                li.innerHTML = `<span class="letter" data="True">a. </span>True`;
            } else if (i == 1) {
                li.innerHTML = `<span class="letter" data="False">b. </span>False`;
            } 
            
            typeBooleanUl.appendChild(li);
        }
    }

    const choices = document.querySelectorAll(".letter");
    choices.forEach(data => {
        data.addEventListener("click", () => {
            markLetter(data);
            bindAnswer(data.getAttribute("data"));
        });
    })

    const markLetter = (element) => {
        // Removes the mark when a different answer is clicked.
        choices.forEach(data => {
            if (data.classList.contains("choices-clicked")) {
                data.classList.remove("choices-clicked");
            }
        });

        element.classList.add("choices-clicked");
    }

    const bindAnswer = (answer) => {
        const userAnswer = document.querySelector(".user-answer");
        userAnswer.textContent = answer;

        enableCheckAnswer();
    }

    const checkAnswerBtn = document.querySelector(".check-answer");
    checkAnswerBtn.addEventListener("click", () => {
        checkAnswer();
        showNextBtn();
        disableClick();
    });

    const enableCheckAnswer = () => {
        checkAnswerBtn.removeAttribute("disabled");

        checkAnswerBtn.addEventListener("mouseover", () => {
            checkAnswerBtn.style.cssText = `transform: scale(1.1); color: white`;
        });

        checkAnswerBtn.addEventListener("mouseout", () => {
            checkAnswerBtn.style.cssText = `transform: scale(1); color: black`;
        });
    }

    const userAnswer = document.querySelector(".user-answer");
    const checkAnswer = () => {
        if (correctAnswer === userAnswer.textContent) {
            userAnswer.setAttribute("style", "color: green; font-weight: bold;");
        } else {
            userAnswer.setAttribute("style", "color: red; font-weight: bold;");
            showCorrectAnswer(correctAnswer);
        }
    }

    const disableClick = () => {
        choices.forEach(data => {
            data.style.pointerEvents = "none";
        })

        checkAnswerBtn.setAttribute("disabled", "");
        checkAnswerBtn.style.color = "black";
    };

    const showCorrectAnswer = (correctAnswer) => {
        choices.forEach(data => {
            if (correctAnswer === data.getAttribute("data")) {
                const parent = data.parentNode;
                parent.setAttribute("style", "color: green; font-weight: bold;");
            }
        })
    }
    const nextBtn = document.querySelector(".next");
    const showNextBtn = () => {
        nextBtn.style.cssText = `
            display: block;
            position: absolute;
            right: 0;
            bottom: 0;
            margin-right: 150px;
            margin-bottom: 100px;
        `;
    }

    const reset = () => {
        const typeMultipleUl = document.querySelector(".type-multiple"); 
        const typeBooleanUl = document.querySelector(".type-boolean");

        typeBooleanUl.innerHTML = "";
        typeMultipleUl.innerHTML = "";

        choices.forEach(data => {
            data.style.cssText = `
                color: black;
                pointer-events = auto;
                font-weight: normal;
            `;

            data.classList.remove("choices-clicked");
        })

        checkAnswerBtn.setAttribute("disabled", "");
        userAnswer.textContent = "";
        nextBtn.style.display = "none";
    }

    nextBtn.addEventListener("click", () => {
        trivia.updateQuestionNum();
        reset();
        displayQuestion(data);
    });
};

const start = () => {
    const main = document.getElementsByTagName("main")[0];
    main.style.display = "block";

    const data = trivia.getQuestionArray();
    
    displayQuestion(data);
}

