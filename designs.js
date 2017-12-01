// Select color input
// Select size input

// When size is submitted by the user, call makeGrid()

function makeGrid(height, width) {
  let tablePos = $("#pixel_canvas");

  // сделать проверку на NaN (не нужно, после Number() любая хрень станет числом) и слишком большое число во вводе

  for (let row = 0; row < height; row++) {
    tablePos.append("<tr>");
    let col = 0;
    while (col < width) {
      tablePos.children().last().append("<td></td>");
      col += 1;
    }
    tablePos.append("</tr>");
  }
}

//Сделать проверку на лету, чтобы показывалось предупреждение, в случае неверного ввода чисел

// Button doesn't refresh page. Remove previous grid. Values became numbers. Make grid if values are legitimate.
$(":submit").click(function(evt) {
  evt.preventDefault();
  $("#pixel_canvas").children().remove();
  let h = Number($("#input_height").val());
  let w = Number($("#input_width").val());
  if ((h > 0 && h <= 60) && (w > 0 && w <= 60)) {
    makeGrid(h, w);
  } else {
    alert("Please insert numbers from 1 to 60")
  }
});

$("#pixel_canvas").click("td", function() {
  console.log("mousedown");
});