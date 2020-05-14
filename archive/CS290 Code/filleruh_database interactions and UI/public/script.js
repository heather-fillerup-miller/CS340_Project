/*****************************************************************************
 * Author: Heather Fillerup- filleruh
 * Date: 03/01/2020
 * Last updated: 03/06/2020
 * Assignment: HW Assignment 6: Database interactions and UI
 * Description: Accomplishes the following:
 *   1. Upon visiting the home page, a form is displayed for adding a new
 *      exercise and if there is existing data in the database a table will
 *      be created by sending an http request to the server and generating
 *      a table based on the response.
 *  2.  Adding a new record sends a POST http request to the server, which then
 *      queries the database and inserts a new record. The table will then be
 *      rebuilt based on the response back from the server
 *  3. When clicking to delete a record, an http request is sent to the server
 *      and a query is sent to the database to delete the record with the id sent.
 *      The table is rebuilt based on the respose from the server.
 *  2. When clicking to edit a record, the record becomes editable and values
 *      can be changed. The edit button is changed to an update button, and when
 *      it is clicked it sends an http request to the server and queries the 
 *      database to update the record. The table is rebuilt based on the response
 *      back from the server.
 *****************************************************************************/

/****************************
 * Http Requests
 ***************************/

//send initial request to generate exisiting table
var req = new XMLHttpRequest();
req.open('PUT', '/', true);
req.setRequestHeader('Content-Type', 'application/json');
req.addEventListener('load', function() {
    if(req.status >= 200 && req.status < 400) {
        var response = JSON.parse(req.responseText);
        createExerciseTable(response);
    }
});
req.send();

//send new exercise
document.getElementById('submitExercise').addEventListener('click', function(event) {
    var req = new XMLHttpRequest();
    var newName = document.getElementById('name').value || null;
    if(newName == null) {
        alert("Please enter an exercise name before submitting.");
        event.preventDefault();
        return;
    }
    var newReps = document.getElementById('reps').value || null;
    var newWeight = document.getElementById('weight').value || null;
    var newLbs =  document.getElementById('lbs').value || null;
    var newDate = document.getElementById('date').value || null;

    var payload = {name:null, reps:null, weight:null, lbs:null, date:null};
    payload.name = newName;
    payload.reps = newReps;
    payload.weight = newWeight;
    payload.lbs = newLbs;
    payload.date = newDate;

    req.open('POST', '/', true);
    req.setRequestHeader('Content-Type','application/json');
    
    req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.responseText);
            createExerciseTable(response);
        }
        else {
            console.log("Error in network request: " + req.statusText);
        }
    });

    req.send(JSON.stringify(payload));
    event.preventDefault();
    document.getElementById('newExercise').reset();
});
    
function deleteRecord(event) {
    var req = new XMLHttpRequest();
    var id = this.previousSibling.value;
    var param = 'id=' +  id;

    req.open("Delete", '/?' + param, true);
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
   
    req.addEventListener('load', function(){
        if(req.status >= 200 && req.status < 400) {
            createExerciseTable(JSON.parse(req.responseText));
        }
        else {
            console.log('Error in network request: ' + req.statusText);
        }
    });

    req.send();
    event.preventDefault();
}

function updateRecord(event) {
    var id = this.previousSibling.value;
    var req = new XMLHttpRequest();
    var newName = document.getElementById('editName').value || null;
    if(newName == null) {
        alert("Please enter an exercise name before submitting.");
        event.preventDefault();
        return;
    }
    var newReps = document.getElementById('editReps').value || null;
    var newWeight = document.getElementById('editWeight').value || null;
    var newLbs = document.getElementById('editLbs').value || null;
    var newDate = document.getElementById('editDate').value || null;

    var payload = {id:null, name:null, reps:null, weight:null, lbs:null, date:null};
    payload.id = id;
    payload.name = newName;
    payload.reps = newReps;
    payload.weight = newWeight;
    payload.lbs = newLbs;
    payload.date = newDate;

    req.open('POST', '/', true);
    req.setRequestHeader('Content-Type','application/json');
    
    req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.responseText);
            createExerciseTable(response);
        }
        else {
            console.log("Error in network request: " + req.statusText);
        }
    });

    req.send(JSON.stringify(payload));
    event.preventDefault();
}

/****************************
 * Functions to generate HTML
 ***************************/

 //create table
function createExerciseTable(data) {
    var divTable = document.getElementById('exerciseTable');
    //if table currently exists delete it
    if(divTable.firstChild != null) {
        divTable.removeChild(divTable.firstChild);
    }
    var table = document.createElement('table');
    var header = table.createTHead();
    var rowHeader = header.insertRow(0);
    divTable.appendChild(table);
    rowHeader.setAttribute('id', 'rowHeader');
    addCell(rowHeader, 'Date', 0);
    addCell(rowHeader, 'Exercise', 1);
    addCell(rowHeader, 'Reps', 2);
    addCell(rowHeader, 'Weight', 3);
    addCell(rowHeader, 'Units', 4);
    addCell(rowHeader, 'Update', 5, 'update');
    document.getElementById('update').colSpan = 2;
    
    var tableBody = table.createTBody();
    data.forEach(function(row){
        var newRecord = document.createElement('tr');
        newRecord.setAttribute('id', row['id']);
        var date = row['date'];
        if(date != null){
            date = date.substring(0,10);
        }
        addCell(newRecord, date, 0);
        addCell(newRecord, row['name'], 1);
        addCell(newRecord, row['reps'], 2);
        addCell(newRecord, row['weight'], 3);
        var units;
        if(row['lbs'] == 1) {
            units = 'lbs';
        }
        else if (row['lbs'] == 0) {
            units = 'kgs';
        }
        addCell(newRecord, units, 4);
        addButton(newRecord, 'edit', 5, row['id'], editRecord);
        addButton(newRecord, 'delete', 6, row['id'], deleteRecord);
        tableBody.appendChild(newRecord);
    });
}

//adds cells to a parent
function addCell(parent, text, col, id) {
    var newCell = parent.insertCell(col);
    newCell.textContent = text;
    if(id){
        newCell.setAttribute('id', id);
    }
}

//adds button to the parent with a event listener function when clicked
function addButton(parent, text, col, newId, functionName) {
    var newCell = parent.insertCell(col);
    var form = document.createElement('form');
   
    var inputId = document.createElement('input');
    inputId.setAttribute('type', 'hidden');
    inputId.setAttribute('value', newId);
    var button = document.createElement('input');
    form.appendChild(inputId);

    button.setAttribute('type', 'button');
    button.setAttribute('value', text);
    button.setAttribute('class', text);
    button.addEventListener('click', functionName);
    form.appendChild(button);

    newCell.appendChild(form);
}

//change row to edit into an editable form
function editRecord(event) {
    //get button -> form -> cell -> row
    var record = this.parentElement.parentElement.parentElement;
    editField(record, 0, 'input', 'editDate', 'date');
    editField(record, 1, 'input', 'editName', 'text');
    editField(record, 2, 'input', 'editReps', 'number');
    editField(record, 3, 'input', 'editWeight', 'number');
    editField(record, 4, 'select', 'editLbs');

    //change edit button to update button and add event listener function
    var buttonId = this.previousSibling.value;
    record.children[5].textContent = '';
    var updateForm = document.createElement('form');
    var updateInput = document.createElement('input');
    updateInput.setAttribute('type', 'hidden');
    updateInput.setAttribute('value', buttonId);
    var updateButton = document.createElement('input');
    updateButton.setAttribute('type', 'button');
    updateButton.setAttribute('value', 'update');
    updateButton.setAttribute('class', 'update');
    updateForm.appendChild(updateInput);
    updateForm.appendChild(updateButton);
    record.children[5].appendChild(updateForm);
    updateButton.addEventListener('click', updateRecord);
    event.preventDefault();
}

//edits the form type in the record passed
function editField(parent, col, formType, editName, inputType) {
    var fieldInput = document.createElement(formType);
    if(formType == 'input') {
        fieldInput.setAttribute('value', parent.children[col].textContent);
        fieldInput.setAttribute('type', inputType);
    }
    else if (formType == 'select') {
        addOption(parent, fieldInput, col, 'lbs', 1);
        addOption(parent, fieldInput,col, 'kgs', 0);
    }
    fieldInput.setAttribute('id', editName);
    parent.children[col].textContent = "";
    parent.children[col].appendChild(fieldInput);
}

//edits the option in the record passed
function addOption(row, parent, col, text, value) {
    var option = document.createElement('option');
    option.setAttribute('value', value);
    option.textContent = text;
    if(row.children[col].textContent == text) {
        option.selected = true;
    }
    else {
        option.selected = false;
    }
    parent.appendChild(option);
}