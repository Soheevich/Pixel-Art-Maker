const colorPicker = $("#colorPicker");
const inputHeight = $("#input_height");
const inputWidth = $("#input_width");
const sizePicker = $("#sizePicker");
const table = $("#pixel_canvas");
const canvas = document.getElementById("pixel_canvas");
const preview_table = $("#preview_canvas");
const preview_canvas = document.getElementById("preview_canvas");

const userLang = navigator.language || navigator.userLanguage;
// change language

// Function Making grid
const makeGrid = () => {
  // Retrive the values of the input elements.
  const tbody = $("tbody");
  let height = inputHeight.val();
  let width = inputWidth.val();

  // Rest of the function.
  tbody.children().remove();

  //JavaScript
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

sizePicker.on("submit", event => {
  event.preventDefault();
  makeGrid();
});


// Drawing and Erasing
table.on("mousedown", "td", event => {

  //Drawing
  if (event.which === 1) {
    let draw = true;
    let cellId = $(event.target).attr("id");
    $(event.target).css("background-color", colorPicker.val());
    $(`#preview_canvas #${cellId}`).css("background-color", colorPicker.val());

    // Listening for mouseUp
    $(document).on("mouseup", () => draw = false);

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

    // Listening for mouseUp and disabling contextmenu
    $(document).on("mouseup", () => erase = false);

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