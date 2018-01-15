/*
 * Create an array that holds all the cards
 */
 let cards = [...document.getElementsByClassName('card')];


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
 cards = shuffle(cards);
 display(cards);

 // Append each card to a document fragment, then append the fragment to the parent node
 function display(cards) {
 	const fragment = document.createDocumentFragment();
 	const deck = document.querySelector('.deck');

 	for (const card of cards) {
 		fragment.appendChild(card);
 	}

 	deck.appendChild(fragment);
 }


 // Shuffle function from http://stackoverflow.com/a/2450976
 function shuffle(array) {
 	let currentIndex = array.length, temporaryValue, randomIndex;

 	while (currentIndex !== 0) {
 	 	randomIndex = Math.floor(Math.random() * currentIndex);
 	 	currentIndex -= 1;
 	 	temporaryValue = array[currentIndex];
 	 	array[currentIndex] = array[randomIndex];
 	 	array[randomIndex] = temporaryValue;
 	}

 	return array;
 }


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
 let openCards = []; // An array to store the 'open' cards
 let matchCount = 0; // Count the numbers of card pairs matched
 let firstClick = false; // Variable that checks if is the user's first card click
 const deck = document.querySelector('.deck');

 // Event listener attached to parent element (event delegation)
 deck.addEventListener('click', function(event) {
 	const evtTarget = event.target;

	if (evtTarget.nodeName === 'LI' && openCards.length < 2) {

		// the timer starts when the first card is open
		if (firstClick === false) {
			startTimer();
		}

		firstClick = true;
		addCard(evtTarget);
		showCard(evtTarget);

		if (openCards.length > 1) {

			if (openCards[openCards.length - 1].firstElementChild.classList.value === openCards[openCards.length - 2].firstElementChild.classList.value) {
				matchCount++;
				match(openCards[openCards.length - 1], openCards[openCards.length - 2]);

				// when all the cards have matched, the timer stops and the final score pops up
				if (matchCount === 8) {
					stopTimer();
					setTimeout(finalScore, 1000);
				}

			} else {
				setTimeout (function() {
					noMatch(openCards[openCards.length - 1], openCards[openCards.length - 2]);
				}, 1000);
			}

			moveCounter();
		}
	}
 });

 // Add the card to a 'list' of 'open' cards
 function addCard(target) {

	if (target.classList.length < 2) {
		openCards.push(target);
	}
 }

 // Display the card symbol
 function showCard(target) {
	target.classList.add('open', 'show');
 }

 // Lock the cards in the open position if they match
 function match(...cards) {

	for (card of cards) {
		card.classList.add('match');
		card.classList.remove('open', 'show');
		openCards = [];
	}
 }

 // Remove the cards from the list and hide the card symbol
 function noMatch(...cards) {

		for (card of cards) {
			card.classList.remove('open', 'show');
			openCards.pop();
		}
 }

 const moveElement = document.querySelector('.moves'); // Move counter element
 let moveCount = 0; // Increase by one after each move (two cards open)

 // Increment the move counter and display it on the page
 function moveCounter() {
 	moveCount++;
 	moveElement.textContent = moveCount;

 	switch (moveCount) {
 		case 16:
 			removeStar(); // Remove one start after sixteen moves
 			break;
 		case 24:
 			removeStar(); // Remove another start after twenty four moves
 	}
 }

 // If all cards have matched, display a message with the final score
 function finalScore() {
 	const message = `You have won!
 	You made ${moveCount} moves`;
 	alert(message);
 }

 // Add event listener to restart button:
 // - reload the page when the button is clicked
 const restartButton = document.querySelector('.restart'); // Restart button element

 restartButton.addEventListener('click', function() {
 	restart();
 });

 // Restart function - reload the page
 function restart() {
 	location.reload(true);
 }

 // Displays a star rating (from 1-3) that reflects the player's performance.
 const stars = document.querySelector('.stars'); // Star list

 // Remove stars after a number of moves
 function removeStar() {
 	const star = stars.firstElementChild; // Get one star element
 	stars.removeChild(star);
 }

 // Start a displayed timer when the player starts a game
 const timeElement = document.querySelector('time');
 let intervalId;

 // Start timer function
 function startTimer() {
 	let timeString = '';
 	let minutes = 0;
 	let seconds = 0;
 	intervalId = setInterval(myTimer, 1000); // Run this function each 1 second

	// Displays the timer in 'MM:SS' format
	function myTimer(){
		seconds++;

		if (seconds % 60 === 0) {
			minutes++;
			seconds = 0;
		}

		timeString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		timeElement.textContent = timeString;
 	}
 }

 // Stops timer when all cards have matched
 function stopTimer() {
 	clearInterval(intervalId);
 }