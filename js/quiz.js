let loader = document.querySelector(".loader");
let hidden = document.querySelector(".hidden");

setTimeout(function () {
  loader.style.display = "none";
  hidden.classList.add("appear");
}, 2000);

let counter = document.querySelector(".quiz .counter");
let spans = document.querySelector("footer .counter");
let content = document.querySelector(".content");
let question = document.querySelector(".question");
let answers = document.querySelector(".answers");
let selectbtn = document.querySelector(".btn");
let results = document.querySelector(".results");
let removetest = document.querySelector(".remove");
let timer = document.querySelector(".timer");

let count = 0;
let correct = 0;
let time = 5;

fetch("../quiz.json")
  .then((res) => res.json())
  .then((data) => {
    let questionobject = data;
    let questioncounter = data.length;

    spansCount(questioncounter);

    add_data(questionobject[count], questioncounter);

    countdown(time, questioncounter);

    selectbtn.onclick = () => {
      check_answer(questionobject[count], questioncounter);
      count++;

      question.innerHTML = " ";
      answers.innerHTML = " ";

      add_data(questionobject[count], questioncounter);

      circles(count);
      clearInterval(timerinterval);
      countdown(time, questioncounter);

      showresults(questioncounter);
    };
  });

function spansCount(num) {
  counter.innerHTML = `Questions Count : ${num} `;

  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");
    let textspan = document.createTextNode("zzz");
    span.appendChild(textspan);
    spans.appendChild(span);

    if (i === 0) span.classList.add("active");
  }
}

function add_data(obj, num) {
  if (count < num) {
    let title = document.createElement("h2");
    let texttitle = document.createTextNode(obj["title"]);
    title.appendChild(texttitle);

    question.appendChild(title);

    for (let i = 1; i <= 4; i++) {
      let answerdiv = document.createElement("div");
      answerdiv.classList.add("answer");

      let input = document.createElement("input");
      input.type = "radio";
      input.classList.add("choose");
      input.name = "answer";
      input.dataset.answer = obj[`answer_${i}`];

      answerdiv.appendChild(input);

      let label = document.createElement("label");
      labeltext = document.createTextNode(obj[`answer_${i}`]);
      label.appendChild(labeltext);

      answerdiv.appendChild(label);

      answers.appendChild(answerdiv);
    }
  }
}

function check_answer(obj, num) {
  if (count < num) {
    let checkedinput = document.getElementsByName("answer");
    let chosenanswer;
    let correctanswer = obj.right_answer;

    for (let i = 0; i < 4; i++) {
      if (checkedinput[i].checked) {
        chosenanswer = checkedinput[i].dataset.answer;
      }
    }

    if (chosenanswer === correctanswer) {
      correct++;
    }
  }
}

function circles(index) {
  let span = document.querySelectorAll("footer .counter span");

  for (let i = 0; i < span.length; i++) {
    if (i === index) {
      span[i].classList.add("active");
    }
  }
}

function showresults(num) {
  if (count === num) {
    removetest.remove();
    if (correct == num || correct >= num / 2)
      results.innerHTML = `<p><span class="perfect"> Prfect :</span> ${correct} from ${count}</p>`;
    else
      results.innerHTML = `<p><span class="bad"> bad :</span> ${correct} from ${count}</p>`;
  }
}

function countdown(duration, num) {
  if (count < num) {
    let minutes, seconds;
    timerinterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      timer.innerHTML = `<span class="minutes">${minutes}</span> : <span class="seconds">${seconds}</span>`;

      if (--duration < 0) {
        clearInterval(timerinterval);
        selectbtn.click();
      }
    }, 1000);
  }
}
