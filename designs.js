var color = $("#colorPicker").val();
const canvas = $("#pixel_canvas");

/*
Сделать проверку на лету, чтобы показывалось предупреждение, в случае неверного ввода чисел

Стирать по ПКМ http://api.jquery.com/event.which/
В CSS затемнять клетки при прохождении курсора
Максимально задействовать CSS, пока хз как
Настроить UI и шрифты
Настроить таблицу цветов
id в таблице можно использовать, чтобы делать потом картинку
Генерировать сетку только в один квадрат, после вызвать функцию, которая щелкнет в начале, ее узнать координату в левом верхнем углу, потом по координатам курсора уже рисовать.

*/

// Listening for color change
$("#colorPicker").on("change", function() {
  color = $("#colorPicker").val();
});

//Function for Making grid
function makeGrid(height, width) {
  let tablePos = canvas;
  //Building rows and columns, adding ids
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

// Drawing and Erasing
canvas.on("mousedown", "td", function(event) {
  event.preventDefault();

  if (event.which === 1) {

    //Drawing
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
  } else if (event.which === 3) {

    // Erasing
    let erase = true;
    $(this).css("background-color", "white");

    // Listening for mouseUp
    canvas.on("mouseup contextmenu", "td", function() {
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