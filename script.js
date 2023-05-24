const trivia = (() => {  
    let url = "";
    let questionNum = 1;

    const getUrl = () => {
        return url
    }

    const setUrl = (value) => {
        url = value;
    };

    const getQuestionNum = () => {
        return questionNum;
    }

    const setQuestionNum = (value) => {
        questionNum = value;
    };

    return {getUrl, setUrl, getQuestionNum, setQuestionNum}
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

const displayQuestions = (data) => {
    const main = document.getElementsByTagName("main")[0];
    main.style.display = "block";
    
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
        const typeOneUl = document.querySelector(".type-one");
        const typeOneLists = document.querySelectorAll(".type-one li");
        
        typeOneUl.style.display = "block";

        typeOneLists.forEach((data, i) => {
            if (i == 0) {   
                data.innerHTML = `<span class="letter">a. </span>${choicesArray[i]}`;
            } else if (i == 1) {
                data.innerHTML = `<span class="letter">b. </span>${choicesArray[i]}`;
            } else if (i == 2) {
                data.innerHTML = `<span class="letter">c. </span>${choicesArray[i]}`;
            } else if (i == 3) {
                data.innerHTML = `<span class="letter">d. </span>${choicesArray[i]}`;
            }
        });
    } else if (questionType === "boolean") {
        const typeTwoUl = document.querySelector(".type-two");
        
        typeTwoUl.style.display = "block";
    }
}

const fetchApi = async () => {
    trivia.setUrl(generateUrl());

    const requestURL = trivia.getUrl();
    const request = new Request(requestURL);

    const response = await fetch(request);
    const result = await response.json();
    const data = result["results"];

    displayQuestions(data);
}

const handleScore = (() => {
    const score = document.querySelector(".score");
    score.textContent = user.getScore();
})();

const getAnswer = () => {
    
}