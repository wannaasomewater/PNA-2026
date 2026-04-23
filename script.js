const themes = {
  dark: {
    '--tv-bg':        '#111420',
    '--tv-surface':   '#1A1E2B',
    '--tv-light':     '#2e3547',
    '--tv-dark':      '#E8ECF2',
    '--tv-blue':      '#0047BB',
    '--tv-blue-dark': '#003399',
    '--tv-teal':      '#1CD2C2',
    '--tv-teal-dark': '#17b8aa',
    '--tv-mid':       '#a0aec0',
    '--tv-muted':     '#64748b',
    '--tv-border':    '#2e3547',
  },
  blue: {
    '--tv-bg':        'rgb(234, 234, 234)',
    '--tv-surface':   '#102060',
    '--tv-light':     '#1E4599',
    '--tv-dark':      '#EAF2FF',
    '--tv-blue':      '#1CD2C2',
    '--tv-blue-dark': '#17b8aa',
    '--tv-teal':      '#FFD166',
    '--tv-teal-dark': '#e0b84d',
    '--tv-mid':       '#a8c0e8',
    '--tv-muted':     '#7a9dcf',
    '--tv-border':    '#1E4599',
  },
};

/* тема */
function setTheme(name, dotEl) {
  const root = document.documentElement;
  Object.entries(themes[name]).forEach(([k, v]) => root.style.setProperty(k, v));
  document.querySelectorAll('[data-theme]').forEach(d => d.classList.remove('selected'));
  if (dotEl) dotEl.classList.add('selected');
}

/* смена фоновой темы */
function initThemeDots() {
  document.querySelectorAll('[data-theme]').forEach(dot => {
    dot.onclick = function () {
      setTheme(this.dataset.theme, this);
    };
  });
}

/* калькулятор */
window.onload = function () {

  /* переменные состояния */
  let a                = '';    // первое число
  let b                = '';    // второе число
  let expressionResult = '';    // результат вычисления
  let selectedOperation = null; // выбранная арифметическая операция

  /* элементы */
  const outputElement = document.getElementById('result');
  const digitButtons  = document.querySelectorAll('[id^="btn_digit_"]');

  /* вспомогательные функции */
  const show = val => {
    outputElement.innerHTML = (val === '' || val === undefined) ? '0' : val;
  };

  // получить текущее активное число (a или b в зависимости от этапа ввода)
  const currentNum    = ()  => selectedOperation ? b : a;
  const setCurrentNum = (v) => { if (selectedOperation) { b = v; } else { a = v; } };

  /* формирование числа по нажатию цифровой кнопки */
  function onDigitButtonClicked(digit) {
    if (!selectedOperation) {
      if (digit !== '.' || !a.includes('.')) { a += digit; }
      outputElement.innerHTML = a;
    } else {
      if (digit !== '.' || !b.includes('.')) { b += digit; }
      outputElement.innerHTML = b;
    }
  }

  /* обработчики цифровых кнопок */
  digitButtons.forEach(button => {
    button.onclick = function () {
      const digitValue = button.innerHTML;
      onDigitButtonClicked(digitValue);
    };
  });

  /* обработчики кнопок арифметических операций */
  document.getElementById('btn_op_mult').onclick  = function () { if (a !== '') selectedOperation = 'x'; };
  document.getElementById('btn_op_plus').onclick  = function () { if (a !== '') selectedOperation = '+'; };
  document.getElementById('btn_op_minus').onclick = function () { if (a !== '') selectedOperation = '-'; };
  document.getElementById('btn_op_div').onclick   = function () { if (a !== '') selectedOperation = '/'; };

  /* кнопка очистки */
  document.getElementById('btn_op_clear').onclick = function () {
    a = '';
    b = '';
    selectedOperation = null;
    expressionResult  = '';
    outputElement.innerHTML = 0;
  };

  /* смена знака +/− */
  document.getElementById('btn_op_sign').onclick = function () {
    const cur = currentNum();
    if (cur === '') return;
    const val = String(parseFloat(cur) * -1);
    setCurrentNum(val);
    show(val);
  };

  /* процент % */
  document.getElementById('btn_op_percent').onclick = function () {
    const cur = currentNum();
    if (cur === '') return;
    const val = String(parseFloat(cur) / 100);
    setCurrentNum(val);
    show(val);
  };

  /* кнопка равно */
  document.getElementById('btn_op_equal').onclick = function () {
    if (a === '' || b === '' || !selectedOperation) return;

    switch (selectedOperation) {
      case 'x': expressionResult = (+a) * (+b); break;
      case '+': expressionResult = (+a)  (+b); break;
      case '-': expressionResult = (+a) - (+b); break;
      case '/':
        expressionResult = (+b) !== 0 ? (+a) / (+b) : 'Ошибка';
        break;
      default: break;
    }

    a = expressionResult.toString();
    b = '';
    selectedOperation = null;
    outputElement.innerHTML = a;
  };

  /* возведение в квадрат x² (кнопка на кальк.) */
  document.getElementById('btn_sq').onclick = function () {
    const cur = currentNum();
    if (cur === '') return;
    const val = String((+cur) * (+cur));
    setCurrentNum(val);
    show(val);
  };

  /* выпадающий список */
  document.getElementById('op-select').onchange = function () {
    const opResultBox = document.getElementById('op-result');
    const opKey = this.value;

    if (!opKey) {
      opResultBox.style.display = 'none';
      return;
    }

    const cur = currentNum();
    if (cur === '') {
      opResultBox.style.display = 'block';
      opResultBox.textContent   = 'Сначала введите число на калькуляторе';
      return;
    }

    let val;
    let label;

    switch (opKey) {
      case 'sq':
        val   = String((+cur) * (+cur));
        label = cur + '² = ' + val;
        break;
      case 'sqrt':
        if (+cur < 0) {
          opResultBox.style.display = 'block';
          opResultBox.textContent   = 'Ошибка: √ от отрицательного числа';
          return;
        }
        val   = String(+Math.sqrt(+cur).toFixed(10));
        label = '√' + cur + ' = ' + val;
        break;
      case 'inv':
        if (+cur === 0) {
          opResultBox.style.display = 'block';
          opResultBox.textContent   = 'Ошибка: деление на ноль';
          return;
        }
        val   = String(+(1 / +cur).toFixed(10));
        label = '1/' + cur + ' = ' + val;
        break;
      case 'fact': {
        const n = Math.floor(Math.abs(+cur));
        if (n > 20) {
          opResultBox.style.display = 'block';
          opResultBox.textContent   = 'Ошибка: слишком большое число для факториала';
          return;
        }
        let result = 1;
        for (let i = 2; i <= n; i++) { result *= i; }
        val   = String(result);
        label = cur + '! = ' + val;
        break;
      }
      default:
        return;
    }

    setCurrentNum(val);
    show(val);

    // показываем подсказку под списком
    opResultBox.style.display = 'block';
    opResultBox.textContent   = label;

    // сбрасываем select обратно на placeholder, чтобы можно было применить повторно
    this.value = '';
  };

  /* ввод по клавиатуре */
  const keyMap = {
    '0': 'btn_digit_0', '1': 'btn_digit_1', '2': 'btn_digit_2',
    '3': 'btn_digit_3', '4': 'btn_digit_4', '5': 'btn_digit_5',
    '6': 'btn_digit_6', '7': 'btn_digit_7', '8': 'btn_digit_8',
    '9': 'btn_digit_9', '.': 'btn_digit_dot', ',': 'btn_digit_dot',
    '+': 'btn_op_plus', '-': 'btn_op_minus',
    '*': 'btn_op_mult', '/': 'btn_op_div',
    'Enter': 'btn_op_equal', 'Escape': 'btn_op_clear',
  };

  document.addEventListener('keydown', function (e) {
    if (['+', '/'].includes(e.key)) e.preventDefault();
    const btnId = keyMap[e.key];
    if (btnId) {
      const btn = document.getElementById(btnId);
      if (btn) btn.click();
    }
  });

  initThemeDots();

  const defaultDot = document.querySelector('[data-theme="dark"]');
  setTheme('dark', defaultDot);
};
