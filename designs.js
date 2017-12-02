var color = $("#colorPicker").val();
var canvas = $("#pixel_canvas");

// Listening for color change
$("#colorPicker").on("change", function() {
  color = $("#colorPicker").val();
});

//Function for Making grid
function makeGrid(height, width) {
  let tablePos = canvas;
  //Building rows and columns
  for (let row = 0; row < height; row++) {
    tablePos.append("<tr>");
    let col = 0;
    while (col < width) {
      tablePos.children().last().append(`<td id="${row}-${col}"></td>`);
      col += 1;
    }
    tablePos.append("</tr>");
  }
}


// Disable button if input is incorrect
$("input").on("change", function() {
  let h = Number($("#input_height").val());
  let w = Number($("#input_width").val());
  // Grid values are 0 < x < 60
  if ((h > 0 && h <= 60) && (w > 0 && w <= 60)) {
    $(":button").prop("disabled", false);
  } else {
    $(":button").prop("disabled", true);
  }
});

// Making grid
$(":button").click(function() {
  // Remove previous grid.
  canvas.children().remove();

  // Values should be Numbers
  let h = Number($("#input_height").val());
  let w = Number($("#input_width").val());

  // Grid values are 0 < x < 60
  if ((h > 0 && h <= 60) && (w > 0 && w <= 60)) {
    makeGrid(h, w);
  } else {
    alert("Please insert numbers from 1 to 60")
  }
});


// Drawing
canvas.on("mousedown", "td", function() {
  let draw = true;
  $(this).css("background-color", color);

  // Listening for mouseUp
  canvas.on("mouseup", "td", function() {
    return draw = false;
  });

  // Continuos drawing
  canvas.on("mouseenter", "td", function() {
    if (!draw) {
      return;
    }
    $(this).css("background-color", color);
  });
});


// Erasing
canvas.on("contextmenu", "td", function(event) {
  event.preventDefault();
  $(this).removeAttr("style");
});