var color = $("#colorPicker").val();
const canvas = $("#pixel_canvas");

//Function for Making grid
function makeGrid(height, width) {
  //Building rows and columns
  for (let row = 0; row < height; row++) {
    canvas.append("<tr>");
    let col = 0;
    while (col < width) {
      canvas.children().last().append("<td></td>");
      col += 1;
    }
    canvas.append("</tr>");
  }
}


// Listening for color change
$("#colorPicker").on("change", function() {
  color = $("#colorPicker").val();
});


// Disable "Make grid" button if input is incorrect
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

// Drawing and Erasing
canvas.on("mousedown", "td", function(event) {
  event.preventDefault(); // No drag'n'drop attempts

  if (event.which === 1) {

    //Drawing
    let draw = true;
    $(this).css("background-color", color);

    // Listening for mouseUp
    $(document).on("mouseup", function() {
      return draw = false;
    });

    // Continuos drawing
    canvas.on("mouseenter", "td", function() {
      if (!draw) {
        return;
      }
      $(this).css("background-color", color);
    });

    // Erasing
  } else if (event.which === 3) {
    let erase = true;
    $(this).css("background-color", "white");

    // Listening for mouseUp and disabling contextmenu
    $(document).on("mouseup contextmenu", function() {
      event.preventDefault();
      return erase = false;
    });

    // Continuos erasing
    canvas.on("mouseenter", "td", function() {
      if (!erase) {
        return;
      }
      $(this).css("background-color", "white");
    });
  }

});