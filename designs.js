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
let historyRecords = []; // Object for 10 history steps

let stepIndex = 9; // Index of current step for saving history function

// Saving history steps function
const saveHistoryStep = (before, now) => {
  stepIndex < 9 ? stepIndex++ : stepIndex = 0;

  // Counting steps for undo/redo functions and disabling/enabling their buttons
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

  // Saving changes and history
  historyRecords[stepIndex] = [before, now];
};


// Erase all Function
const eraseAll = () => {
  let stateBeforeEraseAll = "";

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      temporaryColor = table.find(`#${i}-${j}`).css("background-color");
      if (temporaryColor === "rgba(0, 0, 0, 0)") {
        temporaryColor = "none";
      }
      stateBeforeEraseAll += (` ${i}-${j}--${temporaryColor}`);
    }
  }

  stateBeforeEraseAll.trim();
  $("td").css("background-color", "");
  saveHistoryStep(stateBeforeEraseAll, "blank");
}


// Erase All button Function
const eraseButtonDisabled = (state) => {
  eraseAllButton.prop("disabled", state);
};


// Function for making Undo/Redo changes
const undoRedoChanges = (state) => {
  const history = historyRecords[stepIndex];
  let changesArray;
  let elementsOfChange;

  // Function for implementing Undo/Redo changes
  const changes = (i) => {
    // Looking for EraseAll step
    if (history[i] === "blank") {
      $("td").css("background-color", "");
    }
    // Implementing changes
    changesArray = history[i].split(" ");
    for (change of changesArray) {
      elementsOfChange = change.split("--");
      console.log(elementsOfChange);
      let [cellId, color] = elementsOfChange;
      if (color = "none") {
        color = "";
      }
      if (i === 1) console.log("color is " + color);
      $(`#${cellId}`).css("background-color", color);
    }
  };

  //Checking for Undo or Redo state and starting changes function
  state === "undo" ? changes(0) : changes(1);
};


// Undo Function
const undoFunction = () => {
  // Enabling/Disabling Undo/Redo buttons and counting number of clicks on them
  if (currentUndoRedoStep > 0) {
    currentUndoRedoStep--;
    if (currentUndoRedoStep === 0) {
      undoButtonDisabled(true);
    }
  }
  if (redoButton.prop("disabled")) {
    redoButtonDisabled(false);
  }

  // Calling Function for making Undo/Redo changes
  undoRedoChanges("undo");

  stepIndex === 0 ? stepIndex = 9 : stepIndex--;
};


// Undo button disabled state
const undoButtonDisabled = (state) => {
  undoButton.prop("disabled", state);
};


// Redo Function
const redoFunction = () => {
  stepIndex === 9 ? stepIndex = 0 : stepIndex++;

  // Enabling/Disabling Undo/Redo buttons and counting number of clicks on them
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

  // Calling Function for making Undo/Redo changes
  undoRedoChanges("redo");

  // Check if next redo is impossible and if yes - disabling button
  // (function() {
  //   let nextStepIndex = stepIndex + 1;
  //   if (historyRecords[nextStepIndex].length == 0) {
  //     redoButtonDisabled(true);
  //   }
  // })();
};


// Redo button disabled state
const redoButtonDisabled = (state) => {
  redoButton.prop("disabled", state);
};


// Draw-Erase Function
const drawEraseFunction = (event, state) => {
  let eventTarget = $(event.target);
  let invalid = false;
  let draw = true;
  let cellId = eventTarget.attr("id");
  let stateBeforeDraw = "";
  let stateAfterDraw = "";
  let temporaryColor = "";

  // Saving cell color before drawing/erasing
  temporaryColor = eventTarget.css("background-color");
  if (temporaryColor === "rgba(0, 0, 0, 0)") {
    temporaryColor = "none";
  }
  stateBeforeDraw = `${cellId}--${temporaryColor}`;

  // Drawing/Erasing and saving cell color after drawing/erasing
  if (state === "draw") {
    $(`#${cellId}`).each(() => $(this).css("background-color", colorPicker.val()));
    temporaryColor = colorPicker.val();
  } else if (state === "erase") {
    $(`#${cellId}`).css("background-color", "");
    temporaryColor = "none";
  }
  stateAfterDraw = `${cellId}--${temporaryColor}`;

  // Listening for mouseUp and saving history step
  $(document).on("mouseup", () => {
    invalid = true;
    draw = false;
    saveHistoryStep(stateBeforeDraw, stateAfterDraw);
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
    eventTarget = $(event.target);
    cellId = eventTarget.attr("id");

    temporaryColor = eventTarget.css("background-color");
    if (temporaryColor === "rgba(0, 0, 0, 0)") {
      temporaryColor = "none";
    }
    stateBeforeDraw += ` ${cellId}--${temporaryColor}`;

    if (state === "draw") {
      $(`#${cellId}`).css("background-color", colorPicker.val());
      temporaryColor = colorPicker.val();
    } else if (state === "erase") {
      $(`#${cellId}`).css("background-color", "");
      temporaryColor = "none";
    }

    stateAfterDraw += ` ${cellId}--${temporaryColor}`;
  });
};


// Function Making grid
const makeGrid = () => {
  const tbody = $("tbody");
  height = inputHeight.val();
  width = inputWidth.val();
  stepIndex = 9;

  // Erasing previous grid
  tbody.children().remove();

  // Making a new blank history records
  for (let i = 0; i < 10; i++) {
    historyRecords = [];
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
  saveHistoryStep("", "blank");
  eraseButtonDisabled(false);
  undoButtonDisabled(true);
  currentUndoRedoStep = 0;
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
    drawEraseFunction(event, "draw");
    return;

    // Erasing
  } else if (event.which === 3) {
    drawEraseFunction(event, "erase");
    return;
  }
});