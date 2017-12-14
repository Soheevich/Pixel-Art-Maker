const colorPicker = $("#colorPicker");
const inputHeight = $("#input_height");
const inputWidth = $("#input_width");
const sizePicker = $("#sizePicker");
const table = $("#pixel_canvas");
const canvas = document.getElementById("pixel_canvas");

const userLang = navigator.language || navigator.userLanguage;
// change language

// Function Making grid
const makeGrid = () => {
  // Retrive the values of the input elements.
  let height = inputHeight.val();
  let width = inputWidth.val();

  // Rest of the function.
  table.children().remove();
  for (let i = 0; i < height; i++) {
    let row = canvas.insertRow(i);
    for (let j = 0; j < width; j++) {
      let cell = row.insertCell(j);
    }
  }
}


sizePicker.on("submit", e => {
  e.preventDefault();
  makeGrid();
});


// Drawing and Erasing
table.on("mousedown", "td", event => {

  //Drawing
  if (event.which === 1) {
    let draw = true;
    $(event.target).css("background-color", colorPicker.val());

    // Listening for mouseUp
    $(document).on("mouseup", () => draw = false);

    // Continuos drawing
    table.on("mouseenter", "td", (event) => {
      if (!draw) {
        return;
      }
      $(event.target).css("background-color", colorPicker.val());

    });

    // Erasing
  } else if (event.which === 3) {
    let erase = true;
    $(event.target).css("background-color", "");

    // Listening for mouseUp and disabling contextmenu
    $(document).on("mouseup", () => erase = false);

    // Continuos erasing
    table.on("mouseenter", "td", (event) => {
      if (!erase) {
        return;
      }
      $(event.target).css("background-color", "");

    });
  }

});