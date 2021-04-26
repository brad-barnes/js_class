"use strict";

// Declarations of Constants
// shortcuts to DOM calls
const hide = document.getElementById("sel");
const addBtn = document.getElementById("add-btn");
const sel = document.getElementById("f-name");
const addFName = document.getElementById("f-name-add");
const addLName = document.getElementById("l-name-add");
const addPhone = document.getElementById("phone-add");
const fNameDB = document.getElementById("fNameDB");
const lNameDB = document.getElementById("lNameDB");
const phoneDB = document.getElementById("phoneDB");
const showDB = document.getElementById("showDB");
const deleteBtn = document.getElementById("deleteBtn");
const addError = document.getElementById("addError");
const entryNum = document.getElementById("entryNum");
const editForm = document.getElementById("editForm");
const editBtn = document.getElementById("editBtn");
const submitBtn = document.getElementById("editSubmit");
const editFName = document.getElementById("editFName");
const editLName = document.getElementById("editLName");
const editPhone = document.getElementById("editPhone");
const cancelBtn = document.getElementById("editCancel");
const modal = document.getElementById("modal");
const infoBtn = document.getElementById("modalBtn");
const modalClose = document.querySelector(".close");
const container = document.getElementById("container");
const editFNameError = document.getElementById("editFNameError");
const editPhoneError = document.getElementById("editFNameError");

// variable declarations
// Array that holds database objects
let nameKeys = [];
// variable to retrieve locally stored array 
let nameLoad;
// global variable
let id = 0;
// global Index variable to pass value from
// Edit Button function and Submit Button function
let editIndex = 0;

// RegEx phone format
const phoneFormat = new RegExp("^(\\d{3}[- ]?){2}\\d{4}$");

// retrieving local storage array
nameLoad = localStorage.getItem("nameKeys");
// parses file to nameKeys array if there was a file to
// begin with
if (nameLoad !== null) {
  nameKeys = JSON.parse(nameLoad);
}

// function to display database in application
function displayDatabase(fName, lName, phone) {
  showDB.classList.remove("hide");
  fNameDB.textContent = fName;
  lNameDB.textContent = lName;
  phoneDB.textContent = phone;
}

function sortDisplaySelectOptions(id) {
  // sort array of database objects by first name
  nameKeys.sort((a, b) => {
    let fa = a.fName.toLowerCase(),
      fb = b.fName.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });

  // find index in array for object to edit
  let index = nameKeys.findIndex((obj) => obj.id == id);

  // delete options in SELECT
  while (sel.options.length > 0) {
    sel.remove(0);
  }

  // populates SELECT OPTIONS
  for (let i = 0; i < nameKeys.length; i++) {
    sel.innerHTML += `<option id="${nameKeys[i]["id"]}" value="${nameKeys[i]["id"]}">${nameKeys[i]["fName"]}</option>`;
  }

  // make option that has ID as parameter as SELECTED option
  sel.selectedIndex = index;
}

// function to update number of database entries
function updateEntryNum() {
  entryNum.textContent = nameKeys.length;
}

// function to format numbers into xxx-xxx-xxxx
// takes string of a number
function formatNumber(numStr) {
  // trim white space from beginning and end of string
  numStr = numStr.trim();
  // remove inner whitespace and hyphens
  numStr = numStr.replace(/-|\s/g, "");
  // convert string to array
  let numArr = numStr.split("");

  // insert appropriate hyphens
  numArr.splice(6, 0, "-");
  numArr.splice(3, 0, "-");

  // return formatted number string
  let formattedNum = numArr.join("");
  return formattedNum;
}

// function to populate Datebase Entry area and
// Select Options ON DOCUMENT LOAD
// ONLY IF there are any database entries in storage
document.addEventListener("DOMContentLoaded", (event) => {
  if (nameKeys.length > 0) {
    showDB.classList.remove("hide");

    // populates SELECT OPTIONS
    for (let i = 0; i < nameKeys.length; i++) {
      sel.innerHTML += `<option id="${nameKeys[i]["id"]}" value="${nameKeys[i]["id"]}">${nameKeys[i]["fName"]}</option>`;
    }
    // Calls function to display first database
    // object in array
    displayDatabase(
      nameKeys[0]["fName"],
      nameKeys[0]["lName"],
      nameKeys[0]["phone"]
    );
    // calls function to update display on number of
    // database entries
    updateEntryNum();

    // removes class name on Database Entry section on
    // screen if there are any entries at this point
    if (nameKeys.length > 1) {
      hide.classList.remove("hide");
    }
  }
});

// function to add entry to database
// requires at least first name is entered
addBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // variable for error message to display
  addFNameError.textContent = "";
  addPhoneError.textContent = "";

  // initialize input variables and format number
  let inputFName = addFName.value;
  let inputLName = addLName.value;
  let inputPhone = formatNumber(addPhone.value);

  console.log(phoneFormat.test(inputPhone));

  // checks to see if first name is not empty as well as phone format
  if (
    inputFName !== "" &&
    (phoneFormat.test(inputPhone) || inputPhone === "")
  ) {
    // sets up temporary database object
    let tempDBObject = {
      fName: "",
      lName: "",
      phone: "",
      id: 0,
    };

    // if database has an entry, sets next ID to be one
    // more than highest ID number
    if (nameKeys.length > 0) {
      let max = 0;
      for (let i = 0; i < nameKeys.length; i++) {
        if (max < nameKeys[i]["id"]) {
          max = nameKeys[i]["id"];
        }
      }
      id = max + 1;
      // else the idea is set to 1
    } else {
      id = 1;
    }

    // sets new database object keys to text inputs
    tempDBObject["fName"] = inputFName;
    tempDBObject["lName"] = inputLName;
    tempDBObject["phone"] = inputPhone;
    tempDBObject["id"] = id;

    // add new object to the end of the database array
    nameKeys.push(tempDBObject);

    // sort and display SELECT OPTIONS
    // IF database has more than one record, the SELECT will be unhidden
    // but it is sorted and updated each time regardless
    sortDisplaySelectOptions(id);

    // add updated array to local storage
    localStorage.setItem("nameKeys", JSON.stringify(nameKeys));

    // if array has at least 2 entries, show SELECT OPTIONS
    if (nameKeys.length > 1) {
      hide.classList.remove("hide");
    } else {
      hide.classList.add("hide");
    }

    // Display Database Entries and Number of Entries
    displayDatabase(inputFName, inputLName, inputPhone);
    updateEntryNum();

    addFName.value = "";
    addLName.value = "";
    addPhone.value = "";
  }
  // shows error message if first name is empty
  if (inputFName === "") {
    addFNameError.textContent = `Database Entry MUST have First Name`;
  }
  if (!phoneFormat.test(inputPhone) && inputPhone !== "") {
    addPhoneError.textContent = `
      Phone Number MUST be in xxx-xxx-xxxx format or LEFT BLANK`;
  }
});

// event listener to change display based on
// which entry is SELECTED in SELECT MENU
sel.addEventListener("change", function (e) {
  e.preventDefault();
  let selectFName = fNameDB.value;
  let selectLName = lNameDB.value;
  let selectPhone = phoneDB.value;
  let selectValue = parseInt(sel.value);

  // finds index in array that contains
  // the object's ID
  let index = nameKeys.findIndex((obj) => obj.id == selectValue);

  // uses index to populate Database Entries
  selectFName = nameKeys[index]["fName"];
  selectLName = nameKeys[index]["lName"];
  selectPhone = nameKeys[index]["phone"];

  // Display database using newly assigned variables
  displayDatabase(selectFName, selectLName, selectPhone);
});

// event listener for Delete Button
deleteBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // Removes the error message on screen
  addFNameError.textContent = "";
  addPhoneError.textContent = "";

  // initializes variables for the value in the
  // SELECT OPTION that corresponds to database
  // objects ID
  let selectValueStr = sel.value;
  let selectValue = parseInt(selectValueStr);

  // finds array index for database object to delete
  let index = nameKeys.findIndex((obj) => obj.id == selectValue);

  let element = document.getElementById(selectValueStr);

  // for loop to remove the appropiate SELECT OPTION
  for (let i = 0; i < sel.length; i++) {
    if (sel.options[i].value === selectValueStr) {
      sel.remove(i);
    }
  }

  // Removes database object from array
  nameKeys.splice(index, 1);

  // updates number of database entries on screen
  updateEntryNum();
  // updates local storage
  localStorage.setItem("nameKeys", JSON.stringify(nameKeys));

  // repopulates Database Entry data after deletion
  // if there are still any database entries
  if (nameKeys.length > 0) {
    selectValue = parseInt(sel.value);

    index = nameKeys.findIndex((obj) => obj.id == selectValue);

    let selectFName = nameKeys[index]["fName"];
    let selectLName = nameKeys[index]["lName"];
    let selectPhone = nameKeys[index]["phone"];

    displayDatabase(selectFName, selectLName, selectPhone);
    sortDisplaySelectOptions(selectValue);
  }

  // hides SELECT OPTIONS if only 1 database entry left
  if (nameKeys.length === 1) {
    hide.classList.add("hide");
  }

  // hides database entry section from screen
  // if database is empty
  if (nameKeys.length === 0) {
    fNameDB.textContent = "";
    lNameDB.textContent = "";
    phoneDB.textContent = "";

    // clears database entry screen fields
    addFName.value = "";
    addLName.value = "";
    addPhone.value = "";

    // hides database entries
    showDB.classList.add("hide");
    // hides SELECT MENU
    hide.classList.add("hide");
  }
});

// event listenter to show EDIT section of screen
// when user hits EDIT button
// It loads ID from selected option in SELECT MENU
// into editIndex variable to pass it to the
// SUBMIT button event listener
editBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // shows EDIT form on screen
  editForm.classList.remove("hide");

  // initializes ID of database object to edi
  let selectValue = parseInt(sel.value);

  // find index in array for object to edit
  let index = nameKeys.findIndex((obj) => obj.id == selectValue);

  // sets global editIndex to the index discovered above
  editIndex = index;

  // initializes variables to set text input values
  // to database object values
  let selectFName = nameKeys[index]["fName"];
  let selectLName = nameKeys[index]["lName"];
  let selectPhone = nameKeys[index]["phone"];

  // puts correct values on screen
  editFName.value = selectFName;
  editLName.value = selectLName;
  console.log(selectPhone);
  editPhone.value = selectPhone;
});

// event listener to SUBMIT edits to database object
submitBtn.addEventListener("click", function (e) {
  e.preventDefault();

  console.log(editPhone.value);
  if (
    editFName.value !== "" &&
    (phoneFormat.test(editPhone.value) || editPhone.value === "")
  ) {
    // hides EDIT form from screen
    editForm.classList.add("hide");

    // sets index to global editIndex to update array
    // index is just shorter to write 3 times lol
    let index = editIndex;
    let id = nameKeys[index]["id"];

    // updates database object including formatted number
    nameKeys[index]["fName"] = editFName.value;
    nameKeys[index]["lName"] = editLName.value;
    nameKeys[index]["phone"] = formatNumber(editPhone.value);
    // updates Database Entry section of screen
    displayDatabase(
      nameKeys[index]["fName"],
      nameKeys[index]["lName"],
      nameKeys[index]["phone"]
    );

    // updates SELECT OPTION with any changes to the First Name
    sortDisplaySelectOptions(id);

    // Updates array in local storage
    localStorage.setItem("nameKeys", JSON.stringify(nameKeys));

    // clears error fields
    editFNameError.textContent = "";
    editPhoneError.textContent = "";
  }

  // shows error message if first name is empty
  if (editFName.value === "") {
    editFNameError.textContent = `Database Entry MUST have First Name`;
  }
  if (!phoneFormat.test(editPhone.value) && editPhone.value !== "") {
    editPhoneError.textContent = `
      Phone Number MUST be in xxx-xxx-xxxx format or LEFT BLANK`;
  }
});

// event listener for cancel button to cancel and hide EDIT section
// while clearing the values in the text inputs
cancelBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // clear out values from EDIT text inputs
  editFName.value = "";
  editLName.value = "";
  editPhone.value = "";

  // clears error fields
  editFNameError.textContent = "";
  editPhoneError.textContent = "";

  // hide EDIT section
  editForm.classList.add("hide");
});

// event listener for INFORMATION modal button
infoBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // makes modal background to darken screen and modal window VISIBLE
  modal.style.display = "block";
  // Blurs regular content under modal window a bit for effect
  container.classList.add("is-blurred");
});

// closes modal and removes blur by clicking 'X' button in modal window
modalClose.addEventListener("click", function (e) {
  e.preventDefault();

  modal.style.display = "none";
  container.classList.remove("is-blurred");
});

// // closes modal and removes blur by clicking anywhere outside modal window
window.addEventListener("click", function (e) {
  if (e.target == modal) {
    modal.style.display = "none";
    container.classList.remove("is-blurred");
  }
});
