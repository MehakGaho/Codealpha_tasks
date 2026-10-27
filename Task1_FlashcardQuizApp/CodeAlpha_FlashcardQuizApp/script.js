const defaultCards = [
  {
    question: "What is HTML?",
    answer: "HTML stands for HyperText Markup Language. It creates the structure of a web page."
  },
  {
    question: "What is CSS?",
    answer: "CSS stands for Cascading Style Sheets. It controls the design, colors, spacing, and layout of a web page."
  },
  {
    question: "What is JavaScript?",
    answer: "JavaScript is a programming language that adds interactivity and dynamic behavior to websites."
  },
  {
    question: "What is localStorage?",
    answer: "localStorage lets a website save small amounts of data in the browser so the data remains after a page refresh."
  }
];

const STORAGE_KEY = "codealpha-flashcards-v1";

const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const answerArea = document.getElementById("answerArea");
const showAnswerBtn = document.getElementById("showAnswerBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const addBtn = document.getElementById("addBtn");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const totalCardsEl = document.getElementById("totalCards");
const currentCardEl = document.getElementById("currentCard");
const cardNumberEl = document.getElementById("cardNumber");
const positionText = document.getElementById("positionText");
const progressBar = document.getElementById("progressBar");

const cardForm = document.getElementById("cardForm");
const formTitle = document.getElementById("formTitle");
const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formMessage = document.getElementById("formMessage");
const cardList = document.getElementById("cardList");

function loadCards() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      if (
        Array.isArray(parsed) &&
        parsed.every(
          card =>
            card &&
            typeof card.question === "string" &&
            typeof card.answer === "string"
        )
      ) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Could not load saved flashcards:", error);
  }

  return defaultCards.map(card => ({ ...card }));
}

let cards = loadCards();
let currentIndex = 0;
let isAnswerVisible = false;
let editingIndex = null;

function saveCards() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    return true;
  } catch (error) {
    console.error("Could not save flashcards:", error);
    formMessage.textContent = "Could not save changes in this browser.";
    return false;
  }
}

function renderCard() {
  const total = cards.length;
  const hasCards = total > 0;

  if (currentIndex >= total) {
    currentIndex = Math.max(0, total - 1);
  }

  totalCardsEl.textContent = total;
  currentCardEl.textContent = hasCards ? `${currentIndex + 1} / ${total}` : "0 / 0";
  cardNumberEl.textContent = hasCards ? String(currentIndex + 1).padStart(2, "0") : "00";
  positionText.textContent = hasCards ? `Card ${currentIndex + 1} of ${total}` : "No cards available";

  progressBar.style.width = hasCards ? `${((currentIndex + 1) / total) * 100}%` : "0%";
  questionEl.textContent = hasCards ? cards[currentIndex].question : "Ready to create your first flashcard?";
  answerEl.textContent = hasCards ? cards[currentIndex].answer : "Add a question and answer using the form below.";

  isAnswerVisible = false;
  answerArea.hidden = true;
  showAnswerBtn.textContent = "Show Answer";

  prevBtn.disabled = !hasCards || currentIndex === 0;
  nextBtn.disabled = !hasCards || currentIndex === total - 1;
  showAnswerBtn.disabled = !hasCards;
  editBtn.disabled = !hasCards;
  deleteBtn.disabled = !hasCards;

  renderList();
}

function renderList() {
  cardList.replaceChildren();

  if (cards.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-list";
    empty.textContent = "No flashcards yet. Create your first one above!";
    cardList.appendChild(empty);
    return;
  }

  cards.forEach((card, index) => {
    const item = document.createElement("div");
    item.className = "list-card";

    const info = document.createElement("div");
    const question = document.createElement("p");
    question.className = "list-question";
    question.textContent = `${index + 1}. ${card.question}`;

    const answer = document.createElement("p");
    answer.className = "list-answer";
    answer.textContent = card.answer;
    info.append(question, answer);

    const actions = document.createElement("div");
    actions.className = "list-actions";

    const studyButton = document.createElement("button");
    studyButton.type = "button";
    studyButton.textContent = "Study";
    studyButton.addEventListener("click", () => {
      currentIndex = index;
      renderCard();
      document.getElementById("flashcard").scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => startEditing(index));

    actions.append(studyButton, editButton);
    item.append(info, actions);
    cardList.appendChild(item);
  });
}

showAnswerBtn.addEventListener("click", () => {
  if (cards.length === 0) return;

  isAnswerVisible = !isAnswerVisible;
  answerArea.hidden = !isAnswerVisible;
  showAnswerBtn.textContent = isAnswerVisible ? "Hide Answer" : "Show Answer";
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderCard();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    renderCard();
  }
});

function resetForm() {
  cardForm.reset();
  editingIndex = null;
  formTitle.textContent = "Create a new flashcard";
  saveBtn.textContent = "Save Flashcard";
  cancelBtn.hidden = true;
  formMessage.textContent = "";
}

function startEditing(index) {
  editingIndex = index;
  questionInput.value = cards[index].question;
  answerInput.value = cards[index].answer;
  formTitle.textContent = "Edit your flashcard";
  saveBtn.textContent = "Update Flashcard";
  cancelBtn.hidden = false;
  formMessage.textContent = "";

  cardForm.scrollIntoView({ behavior: "smooth", block: "center" });
  questionInput.focus();
}

addBtn.addEventListener("click", () => {
  resetForm();
  cardForm.scrollIntoView({ behavior: "smooth", block: "center" });
  questionInput.focus();
});

editBtn.addEventListener("click", () => {
  if (cards.length > 0) startEditing(currentIndex);
});

cancelBtn.addEventListener("click", resetForm);

cardForm.addEventListener("submit", event => {
  event.preventDefault();

  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();

  if (!question || !answer) {
    formMessage.textContent = "Please enter both a question and an answer.";
    return;
  }

  const previousCards = cards.map(card => ({ ...card }));
  const previousIndex = currentIndex;
  const previousEditingIndex = editingIndex;

  if (editingIndex !== null) {
    cards[editingIndex] = { question, answer };
    currentIndex = editingIndex;
  } else {
    cards.push({ question, answer });
    currentIndex = cards.length - 1;
  }

  if (!saveCards()) {
    cards = previousCards;
    currentIndex = previousIndex;
    editingIndex = previousEditingIndex;
    renderCard();
    return;
  }

  renderCard();
  resetForm();
  formMessage.textContent = "Flashcard saved successfully!";
});

deleteBtn.addEventListener("click", () => {
  if (cards.length === 0) return;

  const confirmed = window.confirm("Are you sure you want to delete this flashcard?");
  if (!confirmed) return;

  const previousCards = cards.map(card => ({ ...card }));
  const previousIndex = currentIndex;

  cards.splice(currentIndex, 1);
  currentIndex = Math.min(currentIndex, cards.length - 1);

  if (!saveCards()) {
    cards = previousCards;
    currentIndex = previousIndex;
    renderCard();
    return;
  }

  resetForm();
  renderCard();
});

renderCard();
