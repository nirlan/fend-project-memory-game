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
 let firstClick = true; // Variable that checks if is the user's first card click
 const deck = document.querySelector('.deck');

 // Event listener attached to parent element (event delegation)
 deck.addEventListener('click', function(event) {
 	const evtTarget = event.target;

	if (evtTarget.nodeName === 'LI' && openCards.length < 2) {

		// the timer starts when the first card is open
		if (firstClick === true) {
			startTimer();
		}

		firstClick = false;
		addCard(evtTarget);
		showCard(evtTarget);

		if (openCards.length > 1) {

			// If the cards match
			if (openCards[openCards.length - 1].firstElementChild.classList.value === openCards[openCards.length - 2].firstElementChild.classList.value) {
				matchCount++;
				match(openCards[openCards.length - 1], openCards[openCards.length - 2]);

				// when all the cards have matched, the timer stops and the final score pops up
				if (matchCount === 8) {
					stopTimer();
					setTimeout(finalScore, 1000);
				}

			// No match condition
			} else {
				noMatch(openCards[openCards.length - 1], openCards[openCards.length - 2]);
				setTimeout (function() {
					closeCards(openCards[openCards.length - 1], openCards[openCards.length - 2]);
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
 	if (openCards.length < 2) {
 		target.classList.add('show', 'open');
 	}
 }

 // Lock the cards in the open position if they match
 function match(...cards) {

	for (card of cards) {
		card.classList.remove('open');
		card.classList.add('show', 'match');
		openCards = [];
	}
 }

 //Triggers no match animation
 function noMatch(...cards) {

 	for (card of cards) {
 		card.classList.remove('open');
 		card.classList.add('show', 'no-match');
 	}
 }

 // Remove the cards from the list and hide the card symbol
 function closeCards(...cards) {

		for (card of cards) {
			card.classList.remove('show', 'no-match');
			openCards.pop();
		}
 }

 const moveElement = document.querySelector('.moves'); // Move counter element
 let moveCount = 0; // Increase by one after each move (two cards open)
 let starCount = 3;

 // Increment the move counter and display it on the page
 function moveCounter() {
 	moveCount++;
 	moveElement.textContent = moveCount;

 	switch (moveCount) {
 		case 16:
 			removeStar(); // Remove one start after sixteen moves
 			starCount--;
 			break;
 		case 24:
 			removeStar(); // Remove another start after twenty four moves
 			starCount--;
 	}
 }

 // If all cards have matched, display a message with the final score
 function finalScore() {
 	//Get the container element and set margin-top
 	const mainContent = document.querySelector('.container');
 	mainContent.style.marginTop = '250px';

 	// Hide the game board when the game is finished
 	const gameBoard = document.querySelector('.game-board');
 	gameBoard.style.display = 'none';

 	// Create SVG success check mark on the fly
 	const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); // Create a SVG element
	svgNode.setAttributeNS(null, 'width', '200px');
	svgNode.setAttributeNS(null, 'height', '200px');
	svgNode.setAttributeNS(null, 'viewBox', '0 0 363.025 363.024');

 	const svgIcon1 = document.createElementNS('http://www.w3.org/2000/svg', 'path'); // Create a path in SVG namespace
 	svgIcon1.setAttributeNS(null, 'd', 'M181.512 363.024C81.43 363.024 0 281.601 0 181.513 0 81.424 81.43 0 181.512 0c100.083 0 181.513 81.424 181.513 181.513 0 100.088-81.43 181.511-181.513 181.511zm0-351.314C87.88 11.71 11.71 87.886 11.71 181.513s76.17 169.802 169.802 169.802c93.633 0 169.803-76.175 169.803-169.802S275.145 11.71 181.512 11.71z');
	svgIcon1.setAttributeNS(null, 'fill', '#cffbc7');

 	const svgIcon2 = document.createElementNS('http://www.w3.org/2000/svg', 'path'); // Create a path in SVG namespace
 	svgIcon2.setAttributeNS(null, 'd', 'M147.957 258.935l-64.889-64.889 8.28-8.279 56.609 56.608 123.214-123.209 8.28 8.279z');
 	svgIcon2.setAttributeNS(null, 'fill', '#1ac550');

 	// Animate the SVG icon
 	const svgAnimate = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform'); // Create an animateTransform in SVG namespace
 	svgAnimate.setAttributeNS(null, 'attributeName', 'transform');
 	svgAnimate.setAttributeNS(null, 'type', 'scale');
 	svgAnimate.setAttributeNS(null, 'additive', 'sum');
 	svgAnimate.setAttributeNS(null, 'from', '0 0');
 	svgAnimate.setAttributeNS(null, 'to', '1 1');
 	svgAnimate.setAttributeNS(null, 'begin', '0s');
 	svgAnimate.setAttributeNS(null, 'dur', '0.15s');
 	svgAnimate.setAttributeNS(null, 'repeatCount', '1');

 	// Add the new SVG icon to the DOM
 	svgNode.appendChild(svgAnimate);
 	svgNode.appendChild(svgIcon1);
 	svgNode.appendChild(svgIcon2);
 	document.querySelector('.container').appendChild(svgNode);


 	// Create a document fragment to append the new elements of the final score panel
 	const fragment = document.createDocumentFragment();

 	// Create and set the new text elements that will be appended to the fragment
 	const congratHeading = document.createElement('h1');
 	const congratText1 = document.createElement('p');
 	const congratText2 = document.createElement('p');
 	const congratText3 = document.createElement('p');
 	congratHeading.textContent = 'Congratulations! You Won!';
 	congratText1.textContent = `With ${moveCount} Moves and ${starCount} Stars.`;
 	congratText2.textContent = 'Woooooo!';
 	congratText3.textContent = `You took ${minutes !== 0 ? minutes + ' minutes and ' : ''}${seconds} seconds to win the game.`;

 	// Create the 'play again' button
 	const buttonPlayAgain = document.createElement('button');
 	buttonPlayAgain.setAttribute('type', 'button');
 	buttonPlayAgain.setAttribute('onclick', 'restart()');
 	buttonPlayAgain.setAttribute('class', 'play-again-button');
 	buttonPlayAgain.textContent = 'Play again!';

 	// Append the new elements to the fragment
 	fragment.appendChild(congratHeading);
 	fragment.appendChild(congratText1);
 	fragment.appendChild(congratText2);
 	fragment.appendChild(congratText3);
 	fragment.appendChild(buttonPlayAgain);

 	// Display the SVG success icon
 	const svgIcon = document.querySelector('svg');
 	svgIcon.style.display = 'block'

 	// Append the fragment to the 'mainContent' element
 	mainContent.appendChild(fragment);
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
 let minutes;
 let seconds;

 // Start timer function
 function startTimer() {
 	let timeString = '';
 	minutes = 0;
 	seconds = 0;
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