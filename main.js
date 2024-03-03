//Setting Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By Mamdouh Helmy`;


// Setting Game Options
let numbersOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

//Mange Words
let wordToGuess = "";
const words = ["Create" , "Update" , "Delete" , "Master" , "Branch" , "Mainly" , "Mamdoh" , "School"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

//Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click" , getHint);

function generateInput(){
    const inputContainer = document.querySelector(".inputs");

    //Crate In Try Div
    for(let i = 1 ; i <= numbersOfTries ; i++){
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>try ${i}</span>`;

        if(i !== 1){
            tryDiv.classList.add("disabeld-inputs");
        }

        //Create Inputs
        for(let j = 1 ; j <= numberOfLetters ; j++){
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.maxLength = 1;
            tryDiv.appendChild(input);
        }

        inputContainer.appendChild(tryDiv);
    }
    inputContainer.children[0].children[1].focus();

    //Disable All Inputs Except First One
    const inputsInDisabledDiv = document.querySelectorAll(".disabeld-inputs input");
    inputsInDisabledDiv.forEach((input) => (input.disabled = true));

    //Add Event Listener To Inputs
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input , index) =>{
        //Convert Inputs To UpperCaese
        input.addEventListener("input" , function (){
            this.value = this.value.toUpperCase();
            const nextInput = inputs[index + 1];
            if(nextInput) nextInput.focus();
        })

        input.addEventListener("keydown" , function (event){
            const currentIndedx = Array.from(inputs).indexOf(event.target);

            if(event.key === "ArrowRight"){
                const nextInput = currentIndedx + 1;
                if(nextInput < inputs.length) inputs[nextInput].focus();
            }

            if(event.key === "ArrowLeft"){
                const prevInput = currentIndedx - 1;
                if(prevInput >= 0) inputs[prevInput].focus();
            }
        })
    })
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click" , handleGuesses);

console.log(wordToGuess)

function handleGuesses(){
    let sucessGuess = true;
    for(let i = 1 ; i <= numberOfLetters ; i++){
        const inputFiled = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputFiled.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];


        //Game Logic
        if(letter === actualLetter){
            inputFiled.classList.add("yes-in-place");
        }else if(wordToGuess.includes(letter) && letter !== ""){
            inputFiled.classList.add("not-in-place");
            sucessGuess = false;
        }else{
            inputFiled.classList.add("no");
            sucessGuess = false;
        }
    }

    //Check If User Win Or Lose
    if(sucessGuess === true){
        messageArea.style.display = 'block';
        messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;
        if(numberOfHints === 2){
            messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span> <br> <p>Congratz You Didn't Use Hints</p>`;
        }

        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv) => tryDiv.classList.add("disabeld-inputs"));

        guessButton.disabled = true;
    }else{
        document.querySelector(`.try-${currentTry}`).classList.add("disabeld-inputs");
        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input) => (input.disabled = true));

        currentTry++;

        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((input) => (input.disabled = false));

        let el = document.querySelector(`.try-${currentTry}`);
        if(el){
            document.querySelector(`.try-${currentTry}`).classList.remove("disabeld-inputs");
            el.children[1].focus();
        }else{
            guessButton.disabled = true;
            messageArea.innerHTML = `You Los The Word Is <span>${wordToGuess}</span>`;
            messageArea.style.display = 'block';
        }

    }

    if (guessButton.disabled === true) {
        getHintButton.disabled = true;
    }
}


function getHint(){
    if(numberOfHints > 0){
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;
    }

    if(numberOfHints === 0){
        getHintButton.disabled = true;
    }
    

    const enableInputs = document.querySelectorAll("input:not([disabled])");
    const emptyEnableInputs = Array.from(enableInputs).filter((input) => input.value === "");

    if(emptyEnableInputs.length > 0){
        const randomIndex = Math.floor(Math.random() * emptyEnableInputs.length);
        const randomInput = emptyEnableInputs[randomIndex];
        const indexToFill = Array.from(enableInputs).indexOf(randomInput);

        if(indexToFill !== -1){
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    }
}

function handelBackSpace(event){
    if(event.key === "Backspace"){
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndedx = Array.from(inputs).indexOf(document.activeElement);
        if(currentIndedx > 0){
            const currentInput = inputs[currentIndedx];
            const prevInput = inputs[currentIndedx - 1]
            currentInput.value = "";
            prevInput.value = "";
            prevInput.focus();
        }
    }
}

document.addEventListener("keydown" , handelBackSpace);

window.onload = function (){
    generateInput();
}