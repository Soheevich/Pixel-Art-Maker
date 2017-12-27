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
const eyedropperButton = $(".eyedropper");
const drawingButton = $(".drawing_tool");

let currentUndoRedoStep;
let stopRedoStep;
// change language
const userLang = navigator.language || navigator.userLanguage;
let historyRecords = []; // Object for 10 history steps

let stepIndex = 9; // Index of current step for saving history function
// Сделать объект для действий с историей.


// const stepIndexFunction = index => {
//   let i = index;
//   return direction => {
//     direction === "plus" ? (
//       stepIndex === 9 ? stepIndex = 0 : stepIndex++;
//     ) : (
//       stepIndex === 0 ? stepIndex = 9 : stepIndex--;
//     );
//   };
// };


// Hex to rgb
const hexToRgbA = (hex) => {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
  }
  throw new Error('Bad Hex');
}

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
  let stateBeforeEraseAll = [];
  let height = inputHeight.val(); // Height value
  let width = inputWidth.val(); // Width value

  for (let i = height; i--;) {
    for (let j = width; j--;) {
      temporaryColor = table.find(`#${i}-${j}`).css("background-color");
      if (temporaryColor === "rgba(0, 0, 0, 0)") {
        temporaryColor = "none";
      }
      stateBeforeEraseAll.push(`${i}-${j}--${temporaryColor}`);
    }
  }
  $("td").css("background-color", "");
  saveHistoryStep(stateBeforeEraseAll, "blank");
}


// Erase All button Function
const eraseButtonDisabled = (state) => {
  eraseAllButton.prop("disabled", state);
};


// Function for making Undo/Redo changes
const undoRedoChanges = (state) => {
  const historyArray = historyRecords[stepIndex];
  let changesArray;
  let elementsOfChange;

  // Function for implementing Undo/Redo changes
  const changes = (i) => {
    const changesArray = historyArray[i];
    // Looking for EraseAll step
    if (changesArray === "blank") {
      $("td").css("background-color", "");
      return;
    }
    // Implementing changes
    for (change of changesArray) {
      elementsOfChange = change.split("--");
      let [cellId, color] = elementsOfChange;
      if (color === "none") {
        color = "";
      }
      $(`#${cellId}`).css("background-color", color);
      $(`#preview_canvas #${cellId}`).css("background-color", color);
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
  let stateBeforeDraw = [];
  let stateAfterDraw = [];
  let temporaryColor = "";

  // Saving cell color before drawing/erasing
  temporaryColor = eventTarget.css("background-color");
  if (temporaryColor === "rgba(0, 0, 0, 0)") {
    temporaryColor = "none";
  }
  stateBeforeDraw.push(`${cellId}--${temporaryColor}`);

  // Drawing/Erasing and saving cell color after drawing/erasing
  if (state === "draw") {
    temporaryColor = hexToRgbA(colorPicker.val());
    eventTarget.css("background-color", temporaryColor);
    $(`#preview_canvas #${cellId}`).css("background-color", temporaryColor);
  } else if (state === "erase") {
    eventTarget.css("background-color", "");
    $(`#preview_canvas #${cellId}`).css("background-color", "");
    temporaryColor = "none";
  }
  stateAfterDraw.push(`${cellId}--${temporaryColor}`);

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
      table.off("mouseenter", "td");
      return;
    }
    eventTarget = $(event.target);
    cellId = eventTarget.attr("id");

    temporaryColor = eventTarget.css("background-color");
    if (temporaryColor === "rgba(0, 0, 0, 0)") {
      temporaryColor = "none";
    }


    if (stateBeforeDraw.join().indexOf(`${cellId}`) === -1) {
      stateBeforeDraw.push(`${cellId}--${temporaryColor}`);
    }

    if (state === "draw") {
      temporaryColor = hexToRgbA(colorPicker.val());
      eventTarget.css("background-color", temporaryColor);
      $(`#preview_canvas #${cellId}`).css("background-color", temporaryColor);
    } else if (state === "erase") {
      eventTarget.css("background-color", "");
      $(`#preview_canvas #${cellId}`).css("background-color", "");
      temporaryColor = "none";
    }
    if (stateAfterDraw.join().indexOf(`${cellId}`) === -1) {
      stateAfterDraw.push(`${cellId}--${temporaryColor}`);
    }
  });
};


// Function Making grid
const makeGrid = () => {
  const tbody = $("tbody");
  height = inputHeight.val();
  width = inputWidth.val();
  stepIndex = 9;

  tbody.empty();
  historyRecords = [];

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


const rgbToHex = (r, g, b) => {
  const componentToHex = color => {
    const hex = color.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


// Eyedropper function
const eyeDropper = () => {
  table.off("mousedown");
  table.on("click", "td", (event) => {
    let temporaryColor = $(event.target).css("background-color");
    let rgbString = temporaryColor.slice(4, -1);
    let [r, g, b] = rgbString.split(", ");
    temporaryColor = rgbToHex(+r, +g, +b);
    colorPicker.val(temporaryColor);
  });
};


// Changing color of the palette
const colorChange = color => {
  let temporaryColor = color;
  let rgbString = temporaryColor.slice(4, -1);
  let [r, g, b] = rgbString.split(", ");
  temporaryColor = rgbToHex(+r, +g, +b);
  colorPicker.val(temporaryColor);
};


// Changing color of the title
const changeColor = () => {
  let randomColor = () => Math.floor(Math.random() * 255);
  let color = `rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`;
  $(".pixel_header").css("color", color);
};


///////////////////////////////////////////////////////
// Listening for reload page
$(window).ready(function() {
  undoButtonDisabled(true);
  redoButtonDisabled(true);
  eraseButtonDisabled(true);
});


// Listening for clicking on Make grid button
sizePicker.off("submit").on("submit", event => {
  event.preventDefault();
  makeGrid();
  saveHistoryStep([], "blank");
  eraseButtonDisabled(false);
  undoButtonDisabled(true);
  drawingButton.trigger("click");
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


// Listening for clicking on Grid button
$(".grid_canvas").off("click").on("click", () => $("td").toggleClass("active"));


// Drawing and Erasing
drawingButton.click(() => {
  drawingButton.addClass("in_use");
  eyedropperButton.removeClass("in_use");
  table.off("click");
  table.on("mousedown", "td", event => {
    if (event.which === 1) {
      drawEraseFunction(event, "draw");
    } else if (event.which === 3) {
      drawEraseFunction(event, "erase");
    }
  });
});

eyedropperButton.off("click").on("click", () => {
  eyeDropper();
  drawingButton.removeClass("in_use");
  eyedropperButton.addClass("in_use");
});

// Changing color of header on mouse over
$(".pixel_header").mouseover(() => {
  changeColor();
});

// Color buttons function
$(".color").click(event => {
  let color = $(event.target).css("color");
  colorChange(color);
});