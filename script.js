const fetchQuoteBtn = document.getElementById('fetch-quote');
const fetchQuotesBtn = document.getElementById('fetch-quotes');
const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const errorMessage = document.getElementById('error-message');
const loader = document.getElementById('loader');

let apiQuotes = [];
let apiQuote;
let errorCount = 0;

function showLoadingSpinner() {
	loader.hidden = false;
	quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
	loader.hidden = true;
	quoteContainer.hidden = false;
}

function showErrorMessage() {
	errorMessage.hidden = false;
}

function removeErrorMessage() {
	errorMessage.hidden = true;
}

function handleError() {
	// prevent infinite loop by capping error count to 10
	if (errorCount < 10) {
		errorCount++;
		getQuote();
	} else {
		errorCount = 0;
		showErrorMessage();
		loader.hidden = true;
	}
}

// Show New Quote
// if apiQuotes array has a length get quote from array
// else get quote from apiQuote object
function newQuote() {
	showLoadingSpinner();
	removeErrorMessage();
	const authorProperty = apiQuotes.length ? 'author' : 'quoteAuthor';
	const quoteProperty = apiQuotes.length ? 'text' : 'quoteText';
	
	const quote = apiQuotes.length 
		// Pick a random quote from apiQuotes array
		? apiQuotes[Math.floor(Math.random() * apiQuotes.length)]
		: apiQuote;

	// Check if author field is blank and replace it with 'Unknown'
	authorText.textContent = quote[authorProperty] ? quote[authorProperty] : 'Unknown';

	// Check quote length to determine the styling
	if (quote[quoteProperty].length > 120) {
		quoteText.classList.add('long-quote');
	} else {
		quoteText.classList.remove('long-quote');
	}

	// Set Quote, Show Quote Container, Hide Loader
	quoteText.textContent = quote[quoteProperty];
	removeLoadingSpinner();
}

// Get Quotes From API
async function getQuotes() {
	showLoadingSpinner();
	const apiUrl = 'https://type.fit/api/quotes';
	try {
		const response = await fetch(apiUrl);
		apiQuotes = await response.json();
		newQuote();
	} catch (error) {
		handleError();
	}
}

// Get Quote From API
async function getQuote() {
	showLoadingSpinner();
	// empty apiQuotes array until getQuotes is called again
	apiQuotes = [];
	const proxyUrl = 'https://sd-cors-anywhere.herokuapp.com/';
	const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
	try {
		const response = await fetch(proxyUrl + apiUrl);
		apiQuote = await response.json();
		newQuote();
	} catch (error) {
		handleError();
	}
}

// Tweet Quote
function tweetQuote() {
	const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`;
	window.open(twitterUrl, '_blank');
}

// Event Listeners
fetchQuoteBtn.addEventListener('click', getQuote);
fetchQuotesBtn.addEventListener('click', getQuotes);
newQuoteBtn.addEventListener('click', function() {
	apiQuotes.length ? newQuote() : getQuote();
});
twitterBtn.addEventListener('click', tweetQuote);
