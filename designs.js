const colorPicker = $("#colorPicker");
const inputHeight = $("#input_height");
const inputWidth = $("#input_width");
const sizePicker = $("#sizePicker");
const table = $("#pixel_canvas");
const canvas = document.getElementById("pixel_canvas");
const preview_table = $("#preview_canvas");
const preview_canvas = document.getElementById("preview_canvas");
const undoButton = $(".history_undo");
const redoButton = $(".history_redo");
const eraseAllButton = $(".erase_all");

let height = inputHeight.val(); // Height value
let width = inputWidth.val(); // Width value
let currentUndoRedoStep;
let stopRedoStep;
// change language
const userLang = navigator.language || navigator.userLanguage;
const historyRecords = {}; // Object for 10 history steps

let stepIndex = 9; // Index of current step for saving history function

// Saving history steps function
const saveHistoryStep = () => {
  let temporaryColor = "";
  let temporaryArray = [];
  (stepIndex < 9) ? stepIndex++ : stepIndex = 0;
  let nextStepName = `step${stepIndex}`;

  if (currentUndoRedoStep < 9) {
    currentUndoRedoStep++;
    if (currentUndoRedoStep === 1) {
      undoButtonDisabled(false);
    }
  }
  stopRedoStep = currentUndoRedoStep;

  if (!(undoButton.prop("disabled"))) {
    redoButtonDisabled(true);
  }

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
  console.log("currentUndoRedoStep is " + currentUndoRedoStep);
};


// Erase all Function
const eraseAll = () => {
  // Making a new blank history records
  $("td").css("background-color", "");
  saveHistoryStep();
}


// Erase All button Function
const eraseButtonDisabled = (condition) => {
  eraseAllButton.prop("disabled", condition);
};


// Undo Function
const undoFunction = () => {
  const tbody = $("tbody");
  let temporaryColor = "";
  let StepName;
  (stepIndex === 0) ? stepIndex = 9: stepIndex--;
  StepName = `step${stepIndex}`;

  if (currentUndoRedoStep > 0) {
    currentUndoRedoStep--;
    if (currentUndoRedoStep === 0) {
      undoButtonDisabled(true);
    }
  }

  if (redoButton.prop("disabled")) {
    redoButtonDisabled(false);
  }

  for (let i = 0; i < height; i++) {
    let cells = historyRecords[StepName][i];
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
  console.log("currentUndoRedoStep is " + currentUndoRedoStep);
};


// Undo button Function
const undoButtonDisabled = (condition) => {
  undoButton.prop("disabled", condition);
};


// Redo Function
const redoFunction = () => {
  const tbody = $("tbody");
  let temporaryColor = "";
  let StepName;

  (stepIndex === 9) ? stepIndex = 0: stepIndex++;
  StepName = `step${stepIndex}`;

  if (currentUndoRedoStep < 9) {
    currentUndoRedoStep++;
    if (currentUndoRedoStep === 9) {
      redoButtonDisabled(true);
    }
    if (currentUndoRedoStep === stopRedoStep) {
      redoButtonDisabled(true);
    }
  }

  if (undoButton.prop("disabled")) {
    undoButtonDisabled(false);
  }

  for (let i = 0; i < height; i++) {
    let j = 0;
    let cells = historyRecords[StepName][i];
    for (let cell of cells) {
      temporaryColor = cell;
      if (temporaryColor === "rgba(0, 0, 0, 0)") {
        temporaryColor = "";
      }
      tbody.find(`#${i}-${j}`).css("background-color", `${temporaryColor}`);
      j++;
    }
  }

  // Check if next redo is impossible and if yes - disabling button
  (function() {
    let nextStepIndex = stepIndex + 1;
    let Step = `step${nextStepIndex}`;
    if (historyRecords[Step].length == 0) {
      redoButtonDisabled(true);
    }
  })();
};


// Redo button Function
const redoButtonDisabled = (condition) => {
  redoButton.prop("disabled", condition);
};


// Draw Function
const drawFunction = (event) => {
  let eventTarget = $(event.target);
  let invalid = false;
  let draw = true;
  let cellId = eventTarget.attr("id");

  eventTarget.css("background-color", colorPicker.val());
  $(`#preview_canvas #${cellId}`).css("background-color", colorPicker.val());

  // Listening for mouseUp and saving history step
  $(document).on("mouseup", () => {
    invalid = true;
    draw = false;
    saveHistoryStep();
    $(document).off("mouseup");
    return;
  });

  if (invalid) {
    return;
  }

  // Continuos drawing
  table.on("mouseenter", "td", (event) => {
    if (!draw) {
      return;
    }
    let cellId = $(event.target).attr("id");
    $(event.target).css("background-color", colorPicker.val());
    $(`#preview_canvas #${cellId}`).css("background-color", colorPicker.val());

  });
};


// Erase function
const eraseFunction = (event) => {
  let eventTarget = $(event.target);
  let invalid = false;
  let erase = true;
  let cellId = eventTarget.attr("id");
  eventTarget.css("background-color", "");
  $(`#preview_canvas #${cellId}`).css("background-color", "");

  // Listening for mouseUp and saving history step
  $(document).on("mouseup", () => {
    invalid = true;
    erase = false;
    saveHistoryStep();
    $(document).off("mouseup");
    return;
  });

  if (invalid) {
    return;
  }

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



// Listening for reload page
$(window).ready(function() {
  undoButtonDisabled(true);
  redoButtonDisabled(true);
  eraseButtonDisabled(true);
});


// Listening for clicking on Make grid button
sizePicker.off("submit").on("submit", event => {
  const tbody = $("tbody");

  event.preventDefault();
  makeGrid();
  saveHistoryStep();
  eraseButtonDisabled(false);
  undoButtonDisabled(true);
  currentUndoRedoStep = 0;
  console.log("currentUndoRedoStep is " + currentUndoRedoStep);
});


// Listening for clicking on Erase all button
eraseAllButton.off("click").on("click", () => eraseAll());


// Listening for clicking on Undo Button
undoButton.off("click").on("click", () => {
  undoFunction();
});


// Listening for clicking on Redo Button
redoButton.off("click").on("click", () => {
  redoFunction();
});


// Listening for clicking on Borders button
$(".borders").off("click").on("click", () => $("td").toggleClass("active"));


// Drawing and Erasing
table.off("mousedown").on("mousedown", "td", event => {
  //Drawing
  if (event.which === 1) {
    drawFunction(event);
    return;

    // Erasing
  } else if (event.which === 3) {
    eraseFunction(event);
    return;
  }
});