const colorPicker = $("#colorPicker");
const inputHeight = $("#input_height");
const inputWidth = $("#input_width");
const sizePicker = $("#sizePicker");
const table = $("#pixel_canvas");
const canvas = document.getElementById("pixel_canvas");
const preview_table = $("#preview_canvas");
const preview_canvas = document.getElementById("preview_canvas");

let height = inputHeight.val(); // Height value
let width = inputWidth.val(); // Width value
const borders_button = $(".borders");
// change language
const userLang = navigator.language || navigator.userLanguage;
const historyRecords = {}; // Object for 10 history steps

let newStepIndex = 9; // Index of next step for saving history function

// Saving history steps function
const saveHistoryStep = () => {
  let temporaryColor = "";
  let temporaryArray = [];
  if (newStepIndex < 9) {
    newStepIndex += 1;
  } else {
    newStepIndex = 0;
  }
  let nextStepName = `step${newStepIndex}`;

  // Finding colored cells and making an array
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      temporaryColor = table.find(`#${i}-${j}`).css("background-color");
      if (temporaryColor === "rgba(0, 0, 0, 0)") {
        temporaryColor = "";
      }
      // if (historyRecords[nextStepName].length !== 0) {
      //   historyRecords[nextStepName] = [];
      // }
      temporaryArray.push(`${temporaryColor}`);
    }
    historyRecords[nextStepName].push(temporaryArray);
    console.log(temporaryArray);
    temporaryArray = [];
  }
};




// Function Making grid
const makeGrid = () => {
  // Retrive the values of the input elements.
  const tbody = $("tbody");
  height = inputHeight.val();
  width = inputWidth.val();

  // Rest of the function.
  tbody.children().remove();

  // Making a new blank history records
  for (let i = 0; i < 10; i++) {
    historyRecords[`step${i}`] = [];
  }

  //JavaScript - making grid
  for (let i = 0; i < height; i++) {
    let row = canvas.insertRow(i);
    let preview_row = preview_canvas.insertRow(i);
    for (let j = 0; j < width; j++) {
      let cell = row.insertCell(j);
      cell.id = `${i}-${j}`;
      let preview_cell = preview_row.insertCell(j);
      preview_cell.id = `${i}-${j}`;
    }
  }
}


// Listening for clicking on Make grid button
sizePicker.on("submit", event => {
  event.preventDefault();
  makeGrid();
});


// On-off borders
borders_button.click(() => $("td").toggleClass("active"));


// Drawing and Erasing
table.on("mousedown", "td", event => {

  //Drawing
  if (event.which === 1) {
    let draw = true;
    let cellId = $(event.target).attr("id");
    $(event.target).css("background-color", colorPicker.val());
    $(`#preview_canvas #${cellId}`).css("background-color", colorPicker.val());

    // Listening for mouseUp and saving history step
    $(document).on("mouseup", () => {
      draw = false;
      saveHistoryStep();
    });

    // Continuos drawing
    table.on("mouseenter", "td", (event) => {
      if (!draw) {
        return;
      }
      let cellId = $(event.target).attr("id");
      $(event.target).css("background-color", colorPicker.val());
      $(`#preview_canvas #${cellId}`).css("background-color", colorPicker.val());

    });

    // Erasing
  } else if (event.which === 3) {
    let erase = true;
    let cellId = $(event.target).attr("id");
    $(event.target).css("background-color", "");
    $(`#preview_canvas #${cellId}`).css("background-color", "");

    // Listening for mouseUp and saving history step
    $(document).on("mouseup", () => {
      erase = false;
      saveHistoryStep();
    });
    saveHistoryStep();

    // Continuos erasing
    table.on("mouseenter", "td", (event) => {
      if (!erase) {
        return;
      }
      let cellId = $(event.target).attr("id");
      $(event.target).css("background-color", "");
      $(`#preview_canvas #${cellId}`).css("background-color", "");
    });
  }
});