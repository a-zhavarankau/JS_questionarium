allQuestions = {
  "1": {
    "1": "< 1 р.",
    "2": "1...3 р.",
    "3": "3...5 р.",
    "4": "5...7 р.",
    "correctAnswers": ["2","3"],
    "questionText": "Сколько стоит хлеб?",
    "questionNumber": 1
  },
  "2": {
    "1": "Принтер",
    "2": "Модем",
    "3": "Жесткий диск",
    "4": "Колонки",
    "correctAnswers": ["2"],
    "questionText": "Чем подключиться к интернету?",
    "questionNumber": 2
  },
  "3": {
    "1": "12",
    "2": "5",
    "3": "7",
    "4": "Их миллионы только в одних сборниках",
    "correctAnswers": ["3"],
    "questionText": "Сколько существует нот?",
    "questionNumber": 3
  },
  "4": {
    "1": "А поутру они проснулись",
    "2": "Му-му",
    "3": "Микроскоп",
    "4": "Верую!",
    "correctAnswers": ["1","3","4"],
    "questionText": "Какие рассказы написал Шукшин?",
    "questionNumber": 4
  },
  "5": {
    "1": "Смотря откуда считать!",
    "2": "А руки тоже ноги?",
    "3": "Меньше, чем у Борьки баб",
    "4": "Паук? Где паук? Аааа, караул!",
    "correctAnswers": ["3"],
    "questionText": "Сколько ног у паука?",
    "questionNumber": 5
  },
}

function checkIsValid(value) {
  return !(value == "" || value == null)
}

function addCorrectAnswers(userAnswers) {
  // Ф. должна вернуть правильные ответы, введенные пользователем вручную. Дополнительно сделан вывод вариантов ответов, если забыли их
  var сorrectAnswers = prompt(` 1: ${userAnswers[1]}\n
  2: ${userAnswers[2]}\n
  3: ${userAnswers[3]}\n
  4: ${userAnswers[4]}\n
  Введите номера правильных ответов через запятую. Нумерация начинается с 1`);
  if (checkIsValid(сorrectAnswers)) {
  for (var symbol of сorrectAnswers) {
    if (!("1234,".includes(symbol))) {
      getAlert("CC6");
      return false
    }
  }
  // Проверка на повторения номеров (через set) + доп. проверка, если ввод не по возрастанию
  сorrectAnswers = сorrectAnswers.split(",").sort();
  if (сorrectAnswers.length !== new Set(сorrectAnswers).size) {
    getAlert("CC6");
    return false;
  }
  return сorrectAnswers;
  } else {
    getAlert("CC3");
    return false;
  }
}

function createAnswer() {
  // Ф. должна вернуть варианты ответов + правильные ответы
  var userAnswers = {};
  for (var i=0; i <= 3; i++) {
    var textAnswer = prompt(`Введите текст ${i+1} варианта ответа`, "");
    if (checkIsValid(textAnswer)) {
      userAnswers[i+1] = textAnswer
    } else {
      getAlert("CC2", (i+1));
      return false;
    }
  }
  var correctAnswers = addCorrectAnswers(userAnswers);
  if (correctAnswers) {
    userAnswers["correctAnswers"] = correctAnswers;
  } else {
    return false;
  }
  return userAnswers;
}

function createQuestion() {
  // Ф. должна вернуть собранный вопрос + ответы + правильные_ответы + все_проверки
  var textQuestion = prompt("Введите текст вопроса", "");
  if (checkIsValid(textQuestion)) {
    var collectedQuestion = createAnswer();
    collectedQuestion["questionText"] = textQuestion;
    return collectedQuestion;
  } else {
    getAlert("CC1");
    return false;
  }
}

function getQstnsQnty() {
  var questionsQuantity = Object.keys(allQuestions).length;
  return questionsQuantity;
}

function addQuestion() {
  // Ф. получает вопрос и в случае true должна добавить к дефолтным
  var readyStack = createQuestion();
  if (readyStack) {
    readyStack["questionNumber"] = getQstnsQnty() + 1;
    allQuestions[readyStack.questionNumber] = readyStack;
  }
}

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

function createQuestionLabel(labelName) {
  var label = document.createElement("label");
  label.innerHTML = `<b>${labelName}</b>`;
  return label;
}

function chboxStatus(event) {
  // Ф. определяет статус чекбокса (1=checked и 0=unchecked)
  var chbox = event.target;
  var isChecked = chbox.checked;
  if (isChecked) {
    chbox.status = 1
  } else {
    chbox.status = 0 // возвращает 0, если чекбокс был чекнут и анчекнут
  }
  return isChecked
}

function createChbox(i, j) {
  // Ф. создает чекбокс, присваивает ему id и status (status=1 (checked) и status=0 (unchecked))
  var chbox = document.createElement("input");
  chbox.type = "checkbox";
  chbox.id = [i, j];
  chbox.status = 0; // устанавливаем свойство чекбокса и его значение=0 по дефолту
  chbox.onchange = chboxStatus;
  return (chbox);
}

function createLabelChbox(labelChboxName) {
  var labelChbox = document.createElement("label");
  labelChbox.textContent = labelChboxName;
  return labelChbox;
}

function createBr() {
  var br = document.createElement("br");
  return br;
}

function showQuestions() {
  for (var i = 1; i <= getQstnsQnty(); i++) {
    var label = createQuestionLabel(allQuestions[i].questionText);
    var br = createBr();
    document.body.append(label, br);
    for (var j = 1; j <= 4; j++) {
      var br = createBr();
      var chbox = createChbox(i, j);
      var labelChbox = createLabelChbox(allQuestions[i][j]);
      document.body.append(chbox, " ", labelChbox, br); // этим автоматически связываются определенный чекбокс и определенный ответ
    }
  }
}

function checkAnswers() {
  // Ф. проходит по всем чекбоксам и достает информацию об id чекбокса и его статусе
  for (var i = 1; i <= getQstnsQnty(); i++) {
    var minimumAnswers = 0;
    for (var j = 1; j <= 4; j++) {
      var chboxA = document.getElementById([i, j]);
      if (chboxA.status == 1) {
        minimumAnswers += 1;
        var path = allQuestions[i].correctAnswers;
        // Условие ниже - если выбранный номер был в правильных ответах, он оттуда убирается, если нет - добавляется
        if (path.includes(`${j}`)) {
          path.splice(path.indexOf(`${j}`), 1);
        } else {
          path.splice(0, 0, `${j}`)
        }
      }
    }
    if (minimumAnswers == 0) { // проверка на неотвеченный вопрос
      return false;
    }
  }
  return true;
}

function testReport() {
  message = "";
  wrongQuestions = 0;
  for (var i = 1; i <= getQstnsQnty(); i++) {
    var path = allQuestions[i].correctAnswers;
    if (path.length !== 0){
      wrongQuestions += 1;
      message += `\n${i}. ${allQuestions[i].questionText}`
    }
  }
    if (wrongQuestions) {
      getAlert("CC7", 0, wrongQuestions, getQstnsQnty(), message);
    } else {
      getAlert("CC5", 0, wrongQuestions, getQstnsQnty())
    }
    document.getElementById("sendButton").disabled = true;
}

function prepareReport() {
  var reportAnswers = checkAnswers();
  if (reportAnswers) {
    testReport();
  } else {
    getAlert("CC4");
    createChbox();     // обновляем чекбоксы, если ответы изменились
    checkAnswers()     // снова пересчет ответов
  }
}

function createButton() {
  var button = document.createElement("button");
  button.textContent = "Отправить";
  button.id = "sendButton";
  button.onclick = prepareReport;
  document.body.append(button);
}

function startTest() {
  document.getElementById("addQstn").disabled = true;
  document.getElementById("strtTst").disabled = true;
  showQuestions();
  createButton();
}

function getAlert(ccn, ansNum, wrAns, allAns, mess) {
  alerts = {
  CC1: `Вы не ввели текст вопроса. Попробуйте добавить вопрос заново.`,
  CC2: `Вы не ввели текст ${ansNum} варианта ответа. Попробуйте добавить вопрос заново.`,
  CC3: `Вы не ввели правильные варианты ответов. Попробуйте добавить вопрос заново.`,
  CC4: `Все вопросы должны иметь хотя бы один выбранный вариант ответа. Проверьте правильность заполнения.`,
  CC5: `Ваш результат ${(allAns-wrAns)} из ${allAns}. Вы молодец!`,
  CC6: `Поле может содержать только уникальные цифры 1, 2, 3, 4, разделенные запятой. Попробуйте добавить вопрос заново.`,
  CC7: `Вы неправильно ответили на вопросы: ${mess}\n Ваш результат ${(allAns-wrAns)} из ${allAns}.`
}
  alert(alerts[ccn])
}
