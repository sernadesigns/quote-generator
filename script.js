const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

let apiQuotes = [];

// Show Loading
function loading() {
	loader.hidden = false;
	quoteContainer.hidden = true;
}

// Hide Loading
function complete() {
	loader.hidden = true;
	quoteContainer.hidden = false;
}

// Show New Quote
function newQuote() {
	loading();
	// Pick a random quote from apiQuotes array
	const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
	// Check if author field is blank and replace it with 'Unknown'
	authorText.textContent = quote.author ? quote.author : 'Unknown';
	// Check quote length to determine the styling
	if (quote.text.length > 120) {
		quoteText.classList.add('long-quote');
	} else {
		quoteText.classList.remove('long-quote');
	}
	// Set Quote, Hide Loader
	quoteText.textContent = quote.text;
	complete();
}

// Get Quotes From API
async function getQuotes() {
	loading();
	const apiUrl = 'https://type.fit/api/quotes';
	try {
		const response = await fetch(apiUrl);
		apiQuotes = await response.json();
		newQuote();
	} catch (error) {
		// Catch Error Here
	}
}

// Get Quote From API
async function getQuote() {
	loading();
	const proxyUrl = 'https://sd-cors-anywhere.herokuapp.com/';
	const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
	try {
		const response = await fetch(proxyUrl + apiUrl);
		apiQuote = await response.json();
		console.log(apiQuote);
	} catch (error) {
		getQuote();
		console.log('Woops, no quote', error);
	}
}

// Tweet Quote
function tweetQuote() {
	const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`;
	window.open(twitterUrl, '_blank');
}

// Event Listeners
newQuoteBtn.addEventListener('click', newQuote);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
getQuotes();
// getQuote();