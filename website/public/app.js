server_url = 'http://localhost:3000'

let container;

const registration_html = (
'<div>' + 
'<ul>' + 
'    <li>' + 
'	<label for="name">Name:</label>' + 
'	<input type="text" id="name" name="user_name">' + 
'    </li>' + 
'    <li>' + 
'	<label for="mail">Email:</label>' + 
'	<input type="email" id="mail" name="user_email">' + 
'    </li>' + 
'    <li>' + 
'	<label for="telephone">Phone Number:</label>' + 
'	<input type="tel" id="telephone" name="user_phone">' + 
'    </li>' + 
'    <li>' +
'       <button onclick="register_user()">Go</button>' +
'    </li>' +
'</ul>' +
'</div>'
);

const quiz_html = (
`
	<div id="quiz-body">
	    <h2 id="question"> Question </h2>

	    <ul>
		<li>
		    <input type="radio" name="answer" id="a" class="answer" />
		    <label id="a_text"> Option </label>
		</li>
		<li>
		    <input type="radio" name="answer" id="b" class="answer" />
		    <label id="b_text"> Option </label>
		</li>
		<li>
		    <input type="radio" name="answer" id="c" class="answer" />
		    <label id="c_text"> Option </label>
		</li>
		<li>
		    <input type="radio" name="answer" id="d" class="answer" />
		    <label id="d_text"> Option </label>
		</li>
	    </ul>

	</div>

	<button id="submit"> Submit </button>
`
);
 

function setup() {
    container = document.getElementById('quiz-container');
}

async function start_quiz() {
    let response = await fetch('/is-quiz-open');
    const { is_open }  = await response.json();

    if (!is_open) {
	container.innerHTML = 'quiz not open yet or closed';
	return;
    }

    response = await fetch('/is-registered');
    const { is_registered } = await response.json();

    if (is_registered) {
	quiz();
	return;
    }

    container.innerHTML = registration_html;
}

async function register_user() {
    console.log('registering user');
    const user_name = document.getElementById("name").value;
    const user_email = document.getElementById("mail").value;
    const user_phone = document.getElementById("telephone").value;

    const user = { user_name, user_email, user_phone };
    console.log(user);

    let response = await fetch('/register-user', {
	method: 'POST',
	headers: {
	    'Content-Type': 'application/json' /*;charset=utf8'*/
	},
	body: JSON.stringify(user)
    });

    if (response.ok) {
	console.log('sent user data successfully');
	quiz();
    }
}

async function quiz() {
    container.innerHTML = quiz_html;

    while (await question(container));

    console.log('user out of questions');

    container.innertHTML = '';
    container.innerText = 'quiz over';
}

async function question(container) {
    let response = await fetch('/get-question');
    const data = await response.json();

    console.log(data);

    if (data == null) {
	return false;
    }

    const { question } = data;
}
