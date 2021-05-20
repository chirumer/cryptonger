server_url = 'http://localhost:3000'

let container;

const registration_html = (

'<form action="" onSubmit="register_user()">' +
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
'	<input type="tel" id="telephone" name="user_number">' + 
'    </li>' + 
'    <li>' +
'       <button type="submit">Go</button>' +
'    </li>' +
'</form>' 

);

function setup() {
    container = document.getElementById('quiz-container');
}

async function start_quiz() {
    let response = await fetch(server_url + '/is-quiz-open');
    const { is_open }  = await response.json();

    if (is_open) {
	container.innerHTML = registration_html;
    }
    else {
	container.innerHTML = 'not yet started';
    }
}

function register_user() {
    console.log('registering user');

}
