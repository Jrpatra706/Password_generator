const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
//symbol string
const symbols = '~`!@#$%^&*()_-+={[}]|;:"<,>.?/';

//password is empty at begining
let password = ""; 
//by default our password length will remain 10
let passwordLength = 10;
//1st checkbox is marked at begining
//will be used in event Listner on generate password button
let checkCount =0; 
//set strength color to grey
setIndicator("#ccc");

handleSlider();

//set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
} 

//setting color of the dot
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min))+min ;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    return symbols.charAt(getRndInteger(0,symbols.length));
}

//function to calculate strength of a password
function calcStrength(){

    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6 ) {
      setIndicator("#ff0");
    } 
    else {
      setIndicator("#f00");
    }
}


async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    
    //to make copy wala span visible
    copyMsg.classList.add("active");
    
    //to make copied message invisible after 2 sec
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

//function to shuffle the password
function shufflePassword(array){
    //by Fisher yates method
    for(let i = array.length -1;i>0;i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j]= temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

//function to manage checkCount on check boxes
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special condition
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

//event Listner on checkboxes
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

//event Listner on slider
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

//event Listner on copy Button
copyBtn.addEventListener('click' , () => {
    if(passwordDisplay.value){
        copyContent();
    }
})

//event Listner on generate password button
generateBtn.addEventListener('click', () => {

    if(checkCount ==0){
        return;
    }
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //starting to find new password
    //1// remove old password
    password= "";
    //2//putting stuffs mentioned by check boxes

    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //3//cumpulsory addition
    for(let i=0;i<funcArr.length;i++){
        password +=funcArr[i]();
    }

    //4//remaining addition
    for(let i=0; i < passwordLength-funcArr.length;i++){
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }

    //5//shuffle the password
    password = shufflePassword(Array.from(password));

    //show updated password in Ui
    passwordDisplay.value = password;
    //calculate strength of new password
    calcStrength();

});

