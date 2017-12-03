/*
Сделать
В CSS затемнять клетки при прохождении курсора
Максимально задействовать CSS, пока хз как
Настроить UI и шрифты
Настроить таблицу цветов - пока только с добавлением сторонних библиотек. Не айс.
id в таблице можно использовать, чтобы делать потом картинку (надо при создании таблицы всем цветам принудительно ставить белый цвет)
34 строка где-то, сюда добавить стиль на белый цвет, не айс, но щито поделать:
tablePos.children().last().append(`<td id="${row}-${col}"></td>`);

Динамичное отрисовывание элементов при загрузке страницы и сетки
Добавить иконки
Добавить всплывающие подсказки


Особенности:
- Тотальная защита от неправильного ввода
- Легкое рисование и стирание с зажатой кнопкой (ЛКМ или ПКМ соответственно)
- Устранен баг при рисовании, когда можно было зажать кнопку, увести курсор из сетки, отпустить кнопку, вернуться на сетку, а рисование продолжалось
- Устранен баг, когда можно было рисовать правой кнопкой мыши.
*/


const canvas = $("#pixel_canvas");
let color = $("#colorPicker").val();
let h = Number($("#input_height").val());
let w = Number($("#input_width").val());

const colorPicker = document.getElementById("colorPicker");


// Function Making grid
function makeGrid(height, width) {
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


// Listening for grid size input
$("input").on("change", function() {
  h = Number($("#input_height").val());
  w = Number($("#input_width").val());
});


// Disable "Make grid" button if input is incorrect
$("input").on("change", function disableButton() {
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
  makeGrid(h, w);
});


// Drawing and Erasing
canvas.on("mousedown", "td", function(event) {
  event.preventDefault(); // No drag'n'drop attempts

  //Drawing
  if (event.which === 1) {
    let draw = true;
    // $(this).css("background-color", color);
    element.style.backgroundColor = colorPicker.value;
    console.log(colorPicker.value);

    // Listening for mouseUp
    $(document).on("mouseup", function() {
      return draw = false;
    });

    // Continuos drawing
    canvas.on("mouseenter", "td", function() {
      if (!draw) {
        return;
      }
      // $(this).css("background-color", color);
      element.style.backgroundColor = colorPicker.value;
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