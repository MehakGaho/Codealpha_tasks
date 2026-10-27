const quotes = [
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent van Gogh" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C. S. Lewis" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" }
];

const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const copyBtn = document.getElementById("copyBtn");
const status = document.getElementById("status");
let lastIndex = 0;

function showRandomQuote() {
  let index;
  do { index = Math.floor(Math.random() * quotes.length); } while (quotes.length > 1 && index === lastIndex);
  lastIndex = index;
  quoteText.textContent = quotes[index].text;
  quoteAuthor.textContent = `— ${quotes[index].author}`;
  status.textContent = "";
}

newQuoteBtn.addEventListener("click", showRandomQuote);

copyBtn.addEventListener("click", async () => {
  const fullQuote = `“${quoteText.textContent}” ${quoteAuthor.textContent}`;
  try {
    await navigator.clipboard.writeText(fullQuote);
    status.textContent = "Quote copied to clipboard!";
  } catch (error) {
    status.textContent = "Copy is not available in this browser. You can select the quote and copy it.";
  }
});

showRandomQuote();
