//Listening for color change
var color = $("#colorPicker").val();
$("#colorPicker").on("change", function() {
  color = $("#colorPicker").val();
});

//Function for Making grid
function makeGrid(height, width) {
  let tablePos = $("#pixel_canvas");
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

/*
Сделать проверку на лету, чтобы показывалось предупреждение, в случае неверного ввода чисел
Отключать кнопку
Проверка пока не доделана
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button


В CSS затемнять клетки при прохождении курсора
Максимально задействовать CSS, пока хз как
Обнулять цвет по пкм
Настроить UI и шрифты
Настроить таблицу цветов
id в таблице можно использовать, чтобы делать потом картинку
Генерировать сетку только в один квадрат, после вызвать функцию, которая щелкнет в начале, ее узнать координату в левом верхнем углу, потом по координатам курсора уже рисовать.

*/
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
// Remove previous grid.
$(":button").click(function() {
  $("#pixel_canvas").children().remove();

  // Values should be only numbers
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
$("#pixel_canvas").on("click", "td", function() {
  $(this).css("background-color", color);
  // $("#pixel_canvas").on("mouseover", "td", function() {
  //   $(this).css("background-color", color);
  //   $(this).on("mouseup", "td", function() {
  //     return;
  //   });
  //   return;
  // });
  // return;
});

// Erasing
$("#pixel_canvas").on("contextmenu", "td", function(event) {
  event.preventDefault();
  $(this).removeAttr("style");
});