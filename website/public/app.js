server_url = 'http://localhost:3000'

let container;

function setup() {
    container = document.getElementById('quiz-container');
}

async function start_quiz() {
    let response = await fetch(server_url + '/questions.json');
    const questions = await response.json();

    if (questions.length == 0) {
	container.innerText = 'not yet started';
    }
    else {
	container.innerText = 'started';
    }
    console.log(questions);
}
