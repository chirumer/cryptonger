let container;

const not_open_html = (
`
<p>
    quiz not open
</p>
`
);

const registration_html = (
`
<div> 
<ul> 
    <li> 
	<label for="name">Name:</label> 
	<input type="text" id="name" name="user_name"> 
    </li> 
    <li> 
	<label for="mail">Email:</label> 
	<input type="email" id="mail" name="user_email"> 
    </li> 
    <li> 
	<label for="telephone">Phone Number:</label> 
	<input type="tel" id="telephone" name="user_phone"> 
    </li> 
    <li>
       <button onclick="register_user()">Go</button>
    </li>
</ul>
</div>
`
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

	<button id="submit" onclick="submit_question()"> Submit </button>
`
);

const quizover_html = (
`
<p> quiz over, results in whatsapp group </p>
`
);

function setup() {
    container = document.getElementById('container');
}

async function start_quiz() {
    console.log(!(await is_open()));
    console.log(await is_registered());
    
    if (!(await is_open())) {
	container.innerHTML = not_open_html;
	return;
    }

    if (await is_registered()) {
	console.log('user already registered');
	quiz();
	return;
    }

    container.innerHTML = registration_html;
}

async function register_user() {

    if(!(await is_open())) {
	container.innerHTML = not_open_html;
	return;
    }
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

    question();


}

async function question() {
    if (!(await is_open())) {
	end_quiz()
	return;
    }
    let response = await fetch('/get-question');
    const data = await response.json();

    console.log(data);

    if (data == null) {
	end_quiz()
	return;
    }

    const { question, options } = data;
    console.log(options);
    const question_element = document.getElementById('question');
    const option_a = document.getElementById('a_text');
    const option_b = document.getElementById('b_text');
    const option_c = document.getElementById('c_text');
    const option_d = document.getElementById('d_text');
    question_element.innerHTML = question;
    option_a.innerHTML = options[0];
    option_b.innerHTML = options[1];
    option_c.innerHTML = options[2];
    option_d.innerHTML = options[3];
    
}

async function submit_question() {
    if (!(await is_open())) {
	end_quiz()
	return;
    }
    
    let answer;

    if (document.getElementById('a').checked)
	answer = 0;
    else if (document.getElementById('b').checked)
	answer = 1;
    else if (document.getElementById('c').checked)
	answer = 2;
    else if (document.getElementById('d').checked)
	answer = 3;

    if (answer == undefined)
	return; // no option selected

    answer = { answer };

    // submit the question
     let response = await fetch('/submit-answer', {
	method: 'POST',
	headers: {
	    'Content-Type': 'application/json' /*;charset=utf8'*/
	},
	body: JSON.stringify(answer)
    });

    if (response.ok) {
	console.log('submitted question successfully');
	quiz();
    }
}

async function is_open() {
    let response = await fetch('/is-quiz-open');
    return (await response.json()).is_open;
}

async function is_registered() {
    response = await fetch('/is-registered');
    return (await response.json()).is_registered;
}

async function end_quiz() {
    container.innerHTML = quizover_html;
}
