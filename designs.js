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

let stepIndex = 9; // Index of current step for saving history function

// Saving history steps function
const saveHistoryStep = () => {
  console.log("-- start of saveHistoryStep - stepIndex is " + stepIndex);

  let temporaryColor = "";
  let temporaryArray = [];
  if (stepIndex < 9) {
    stepIndex++;
  } else {
    stepIndex = 0;
  }
  let nextStepName = `step${stepIndex}`;

  // Removing previously saved history in the next step
  if (historyRecords[nextStepName].length > 0) {
    historyRecords[nextStepName] = [];
  }

  // Finding colored cells and making an array
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      temporaryColor = table.find(`#${i}-${j}`).css("background-color");
      if (temporaryColor === "rgba(0, 0, 0, 0)") {
        temporaryColor = "";
      }
      temporaryArray.push(`${temporaryColor}`);
    }
    historyRecords[nextStepName].push(temporaryArray);
    temporaryArray = [];
  }
  console.log("end of of saveHistoryStep - stepIndex is " + stepIndex);

};


// Erase all Function
const eraseAll = () => {
  // Making a new blank history records
  for (let i = 0; i < 10; i++) {
    historyRecords[`step${i}`] = [];
  }
  $("td").css("background-color", "");
}


// Undo Function
const undoFunction = () => {
  const tbody = $("tbody");
  let temporaryColor = "";
  console.log("-- start of undoFunction - stepIndex is " + stepIndex);
  if (stepIndex === 0) {
    stepIndex = 9;
    console.log("new stepIndex is " + stepIndex);
  } else {
    stepIndex--;
    console.log("new stepIndex is " + stepIndex);
  }

  let previousStepName = `step${stepIndex}`;

  for (let i = 0; i < height; i++) {
    let cells = historyRecords[previousStepName][i];
    let j = 0;
    for (let cell of cells) {
      temporaryColor = cell;
      if (temporaryColor === "rgba(0, 0, 0, 0)") {
        temporaryColor = "";
      }
      tbody.find(`#${i}-${j}`).css("background-color", `${temporaryColor}`);
      j++;
    }
  }
  console.log("end of undoFunction - stepIndex is " + stepIndex);

};


// Redo Function
///


// Draw Function
const drawFunction = () => {};


// Function Making grid
const makeGrid = () => {
  const tbody = $("tbody");
  height = inputHeight.val();
  width = inputWidth.val();

  // Erasing previous grid
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
};



// Listening for clicking on Make grid button
sizePicker.off("submit").on("submit", event => {
  const tbody = $("tbody");

  event.preventDefault();
  makeGrid();
  // $(".erase_all").prop("disabled", false);
});


// Listening for clicking on Erase all button
// $(".erase_all").prop("disabled", true); //Button disabled but it should be showed in css
$(".erase_all").off("click").on("click", () => eraseAll());


// Listening for clicking on Undo Button
$(".history_undo").off("click").on("click", () => {
  undoFunction();
});


// Listening for clicking on Redo Button
$(".history_redo").off("click").on("click", () => {
  redo();
});


// Listening for clicking on Borders button
borders_button.off("click").on("click", () => $("td").toggleClass("active"));


// Drawing and Erasing
table.off("mousedown").on("mousedown", "td", event => {
  let eventTarget = $(event.target);
  //Drawing
  if (event.which === 1) {
    let draw = true;
    let cellId = eventTarget.attr("id");
    eventTarget.css("background-color", colorPicker.val());
    $(`#preview_canvas #${cellId}`).css("background-color", colorPicker.val());

    // Listening for mouseUp and saving history step
    $(document).off("mouseup").on("mouseup", () => {
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
    let cellId = eventTarget.attr("id");
    eventTarget.css("background-color", "");
    $(`#preview_canvas #${cellId}`).css("background-color", "");

    // Listening for mouseUp and saving history step
    $(document).off("mouseup").on("mouseup", () => {
      erase = false;
      saveHistoryStep();
    });

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