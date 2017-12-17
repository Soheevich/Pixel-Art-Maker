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
let currentUndoRedoStep;
// change language
const userLang = navigator.language || navigator.userLanguage;
const historyRecords = {}; // Object for 10 history steps

let stepIndex = 9; // Index of current step for saving history function

// Saving history steps function
const saveHistoryStep = () => {
  console.log("save history step");
  let temporaryColor = "";
  let temporaryArray = [];
  if (stepIndex < 9) {
    stepIndex++;
  } else {
    stepIndex = 0;
  }
  let nextStepName = `step${stepIndex}`;

  if (currentUndoRedoStep < 10) {
    currentUndoRedoStep++;
    if (currentUndoRedoStep === 1) {
      $(".history_undo").prop("disabled", false);
    }
  }

  if (!($(".history_undo").prop("disabled"))) {
    $(".history_redo").prop("disabled", true);
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
};


// Erase all Function
const eraseAll = () => {
  // Making a new blank history records
  $("td").css("background-color", "");
  saveHistoryStep();
}


// Undo Function
const undoFunction = () => {
  const tbody = $("tbody");
  let temporaryColor = "";
  let StepName;
  if (stepIndex === 0) {
    stepIndex = 9;
  } else {
    stepIndex--;
  }
  StepName = `step${stepIndex}`;

  if (currentUndoRedoStep > 0) {
    currentUndoRedoStep--;
    if (currentUndoRedoStep === 0) {
      $(".history_undo").prop("disabled", true);
    }
  }

  if ($(".history_redo").prop("disabled")) {
    $(".history_redo").prop("disabled", false);
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
};


// Redo Function
const redoFunction = () => {
  const tbody = $("tbody");
  let temporaryColor = "";
  let StepName;

  if (stepIndex === 9) {
    stepIndex = 0;
  } else {
    stepIndex++;
  }
  StepName = `step${stepIndex}`;

  if (currentUndoRedoStep < 9) {
    currentUndoRedoStep++;
    if (currentUndoRedoStep === 9) {
      $(".history_redo").prop("disabled", true);
    }
  }

  if ($(".history_undo").prop("disabled")) {
    $(".history_undo").prop("disabled", false);
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
      $(".history_redo").prop("disabled", true);
    }
  })();
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
  $(".history_undo").prop("disabled", true);
  $(".history_redo").prop("disabled", true);
});


// Listening for clicking on Make grid button
sizePicker.off("submit").on("submit", event => {
  const tbody = $("tbody");

  event.preventDefault();
  makeGrid();
  saveHistoryStep();
  $(".erase_all").prop("disabled", false);
  $(".history_undo").prop("disabled", true);
  currentUndoRedoStep = 0;
});


// Listening for clicking on Erase all button
$(".erase_all").prop("disabled", true); //Button disabled but it should be showed in css
$(".erase_all").off("click").on("click", () => eraseAll());


// Listening for clicking on Undo Button
$(".history_undo").off("click").on("click", () => {
  undoFunction();
});


// Listening for clicking on Redo Button
$(".history_redo").off("click").on("click", () => {
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