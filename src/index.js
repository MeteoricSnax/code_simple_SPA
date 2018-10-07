import 'bootstrap/dist/css/bootstrap.css'

const url = 'https://albertvandel.dk/ExamCA2-1.0-SNAPSHOT/api/person/';
const table = document.getElementById("table");
const btnname = document.getElementById("btnname");
const btnhobby = document.getElementById("btnhobby");
const btnzipcode = document.getElementById("btnzipcode");
const btnphone = document.getElementById("btnphone");
const fname = document.getElementById("firstname");
const lname = document.getElementById("lastname");
const hobby = document.getElementById("hobby");
const zipcode = document.getElementById("zipcode");
const phone = document.getElementById("phone");

// Event Listeners
btnname.addEventListener("click", getPersonsByName);
btnhobby.addEventListener("click", getPersonsByHobby);
btnzipcode.addEventListener("click", getPersonsByZip);
btnphone.addEventListener("click", getPersonsByPhone);

function fetchGeneral(url, cb, input) {
    if (validateInput(input)) {
        fetch(url, { method: 'GET' })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                if (json.code) {
                    console.log("Error");
                    showError(json.message);
                    hideTable();
                } else {
                    cb(json);
                }
            })
            .catch(function (error) {
                console.log('Error: ' + error);
            });
    }
}

// Updates the table 
function updateTable(json) {
    let content = '<h2>Persons Found</h2>';
    content += '<table class="table"><tr><th>First Name</th><th>Last Name</th><th>Email</th><th></th></tr>';
    content += json.map(el => `<tr><td>${el.firstName}</td><td>${el.lastName}</td><td>${el.email}</td>
                <td><button type="button" href="#" class="btn btn-primary" id=btnedit${el.id}>edit</button>  
                <button type="button" href="#" class="btn btn-primary btndelete" id=${el.id}>delete</button></td></tr>`).join("");
    content += '</table>';
    table.innerHTML = content;
    document.querySelector("#table").addEventListener("click", clickHandler, false);
}

function hideTable(){
    table.innerHTML = "";
}

function getPersonsByPhone(){
    fetchGeneral(url + "phone/" + phone.value, updateTable, phone.value);
}

function getPersonsByZip(){
    fetchGeneral(url + "zipcode/" + zipcode.value, updateTable, zipcode.value);
}

function getPersonsByHobby(){
    fetchGeneral(url + "hobby/" + hobby.value, updateTable, hobby.value);
}

function getPersonsByName(){
    fetchGeneral(url + "name?firstname=" + fname.value + "&lastname=" + lname.value, updateTable, fname.value);
}

// Validates the user input
function validateInput(input) {
    if (input == "") {
        showError("Please enter a valid input");
        hideTable();
        return false;
    } else {
        hideError();
        return true;
    }
}

// Clickhandler 
function clickHandler(e) {
    console.log("click");
    if (e.target !== e.currentTarget && e.target.classList.contains("btndelete")) {
        console.log("delete");
        deletePerson(e.target.id);
    }
    e.stopPropagation();
}

// Displays an error message
function showError(message) {
    let error = '';
    error += '<div class="alert alert-info"><strong>Error</strong> ' + message + '</div>';
    document.getElementById("error").innerHTML = error;
}

// Hides the error message
function hideError() {
    document.getElementById("error").innerHTML = "";
}

// Deletes a person
function deletePerson(id) {
    fetch(url + id, { method: 'DELETE' })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        }).catch(error => {
            console.log('Error: ' + error);
        });
}


