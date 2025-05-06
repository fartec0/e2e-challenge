import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <div id="expression" class="expression-display" data-testid="expression"></div>
    <div id="result" class="display" data-testid="result">0</div>

    <div class="keypad">
      <button data-testid="function-ac" id="btn-ac" class="button color-light">AC</button>
      <button data-testid="function-plus-minus" id="btn-plus-minus" class="button color-light">±</button>
      <button data-testid="function-percent" id="btn-percent" class="button color-light">%</button>
      <button data-testid="operator-÷" id="btn-divide" class="button color-operator">÷</button>

      <button data-testid="digit-7" id="btn-7" class="button">7</button>
      <button data-testid="digit-8" id="btn-8" class="button">8</button>
      <button data-testid="digit-9" id="btn-9" class="button">9</button>
      <button data-testid="operator-×" id="btn-multiply" class="button color-operator">×</button>

      <button data-testid="digit-4" id="btn-4" class="button">4</button>
      <button data-testid="digit-5" id="btn-5" class="button">5</button>
      <button data-testid="digit-6" id="btn-6" class="button">6</button>
      <button data-testid="operator--" id="btn-subtract" class="button color-operator">-</button>

      <button data-testid="digit-1" id="btn-1" class="button">1</button>
      <button data-testid="digit-2" id="btn-2" class="button">2</button>
      <button data-testid="digit-3" id="btn-3" class="button">3</button>
      <button data-testid="operator-+" id="btn-add" class="button color-operator">+</button>

      <button data-testid="digit-0" id="btn-0" class="button wide">0</button>
      <button data-testid="decimal" id="btn-decimal" class="button">.</button>
      <button data-testid="operator-=" id="btn-equals" class="button color-operator">=</button>
    </div>
  </div>
`;


// "State"
let currentValue = '0';
let previousValue = null;
let operator = null;
let expression = '';
let freshInput = true;

// DOM references
const expressionDisplay = document.getElementById('expression');
const mainDisplay = document.getElementById('result');

// Update displayed values
function updateDisplays() {
  expressionDisplay.textContent = expression;
  mainDisplay.textContent = currentValue;
}

// Calculate result
function computeResult(op, a, b) {
  let result = 0;
  switch (op) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '×':
      result = a * b;
      break;
    case '÷':
      result = b === 0 ? 0 : a / b;
      break;
    default:
      result = b;
  }
  return result;
}

// Number click
function handleNumberClick(num) {
  if (freshInput || currentValue === '0') {
    currentValue = num;
    freshInput = false;
  } else {
    currentValue += num;
  }
  updateDisplays();
}

// Operator click
function handleOperatorClick(op) {
  if (operator && previousValue !== null) {
    const result = computeResult(operator, parseFloat(previousValue), parseFloat(currentValue));
    previousValue = String(result);
    expression = `${result} ${op}`;
  } else {
    previousValue = currentValue;
    expression = `${currentValue} ${op}`;
  }
  operator = op;
  freshInput = true;
  updateDisplays();
}

// Equals
function handleEquals() {
  if (!operator || previousValue === null) return;
  const result = computeResult(operator, parseFloat(previousValue), parseFloat(currentValue));
  currentValue = String(result);
  expression = `${previousValue} ${operator} ${currentValue} =`;
  previousValue = null;
  operator = null;
  freshInput = true;
  updateDisplays();
}

// Clear
function handleClear() {
  currentValue = '0';
  previousValue = null;
  operator = null;
  expression = '';
  freshInput = true;
  updateDisplays();
}

// Plus/Minus
function handlePlusMinus() {
  if (currentValue.startsWith('-')) {
    currentValue = currentValue.slice(1);
  } else {
    if (currentValue !== '0') {
      currentValue = '-' + currentValue;
    }
  }
  updateDisplays();
}

// Percent
function handlePercent() {
  currentValue = String(parseFloat(currentValue) / 100);
  updateDisplays();
}

// Decimal
function handleDecimal() {
  if (!currentValue.includes('.')) {
    currentValue += '.';
  }
  updateDisplays();
}

// 4) Attach event listeners now that the elements exist
document.getElementById('btn-ac').addEventListener('click', handleClear);
document.getElementById('btn-plus-minus').addEventListener('click', handlePlusMinus);
document.getElementById('btn-percent').addEventListener('click', handlePercent);

document.getElementById('btn-divide').addEventListener('click', () => handleOperatorClick('÷'));
document.getElementById('btn-multiply').addEventListener('click', () => handleOperatorClick('×'));
document.getElementById('btn-subtract').addEventListener('click', () => handleOperatorClick('-'));
document.getElementById('btn-add').addEventListener('click', () => handleOperatorClick('+'));
document.getElementById('btn-equals').addEventListener('click', handleEquals);

document.getElementById('btn-0').addEventListener('click', () => handleNumberClick('0'));
document.getElementById('btn-1').addEventListener('click', () => handleNumberClick('1'));
document.getElementById('btn-2').addEventListener('click', () => handleNumberClick('2'));
document.getElementById('btn-3').addEventListener('click', () => handleNumberClick('3'));
document.getElementById('btn-4').addEventListener('click', () => handleNumberClick('4'));
document.getElementById('btn-5').addEventListener('click', () => handleNumberClick('5'));
document.getElementById('btn-6').addEventListener('click', () => handleNumberClick('6'));
document.getElementById('btn-7').addEventListener('click', () => handleNumberClick('7'));
document.getElementById('btn-8').addEventListener('click', () => handleNumberClick('8'));
document.getElementById('btn-9').addEventListener('click', () => handleNumberClick('9'));

document.getElementById('btn-decimal').addEventListener('click', handleDecimal);

// 5) Initialize the display
updateDisplays();
