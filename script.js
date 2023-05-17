const introForm = document.getElementById("intro-form");
const questionsCount = document.getElementById("questions-count");
const category = document.getElementById("category");
const difficulty = document.getElementById("difficulty");
const questionsType = document.getElementById("questions-type");

const validateInput = () => {
    const error = document.getElementsByClassName("error")[0];
    const count = parseInt(questionsCount.value);

    if (isNaN(count)) {
        error.textContent = "Please type a number";
    } else if (count < 1) {
        error.textContent = "The number of questions should be more than one."; 
    } else {
        error.textContent = "";
        
        const introSection = document.getElementById("intro-section");
        introSection.innerHTML = "";
    }
}

introForm.addEventListener("submit", (e) => {
    e.preventDefault();

    validateInput();
});

const generateUrl = () => {
    let url = `https://opentdb.com/api.php?amount=${questionsCount}&category=${category.value}
                &difficulty=${difficulty.value}&type=${questionsType.value}`;

    if (category.value === "" && difficulty.value === "" && questionsType.value === "") {
        url = `https://opentdb.com/api.php?amount=${questionsCount}`;
    } else if (category.value === "") {
        url = `https://opentdb.com/api.php?amount=${questionsCount}&difficulty=${difficulty.value}&type=${questionsType.value}`;
    } else if (difficulty.value === "") {
        url = `https://opentdb.com/api.php?amount=${questionsCount}&category=${category.value}&type=${questionsType.value}`;
    } else if (questionsType.value === "") {
        url = `https://opentdb.com/api.php?amount=${questionsCount}&category=${category.value}&difficulty=${difficulty.value}`;
    }

    return url;
}