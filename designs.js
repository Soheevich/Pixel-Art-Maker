//Listening for color change
let color;
$("#colorPicker").on("change", function() {
  color = $("#colorPicker").val();
});

//Function for Making grid
function makeGrid(height, width) {
  let tablePos = $("#pixel_canvas");
  //Building rows
  for (let row = 0; row < height; row++) {
    tablePos.append("<tr>");
    let col = 0;
    // Building columns
    while (col < width) {
      tablePos.children().last().append(`<td id="${row}-${col}"></td>`);
      col += 1;
    }
    tablePos.append("</tr>");
  }
}

/*
Сделать проверку на лету, чтобы показывалось предупреждение, в случае неверного ввода чисел


В CSS затемнять клетки при прохождении курсора
Максимально задействовать CSS, пока хз как
Обнулять цвет по пкм
Настроить UI и шрифты
Настроить таблицу цветов
id в таблице можно использовать, чтобы делать потом картинку
Генерировать сетку только в один квадрат, после вызвать функцию, которая щелкнет в начале, ее узнать координату в левом верхнем углу, потом по координатам курсора уже рисовать.

*/

// Making grid
// Button doesn't refresh the page. Remove previous grid.
$(":submit").click(function(evt) {
  evt.preventDefault();
  $("#pixel_canvas").children().remove();
  // Values should be only numbers
  console.log(typeof $("#input_height").val());
  console.log(typeof $("#input_width").val());

  let h = Number($("#input_height").val());
  let w = Number($("#input_width").val());
  // Grid values are 0 < x < 60
  if ((h > 0 && h <= 60) && (w > 0 && w <= 60)) {
    makeGrid(h, w);
  } else {
    alert("Please insert numbers from 1 to 60")
    console.log("height is " + h + typeof h);
    console.log("width is " + w + typeof w);
  }
});


// пока в процессе
$("#pixel_canvas").on("click", "td", function() {

});