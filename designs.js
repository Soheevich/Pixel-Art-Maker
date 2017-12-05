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
Сделать кнопку с рандомом, которая раскрашивает все клетки в случайные цвета. Иногда выдавать нарисованную картинку, будто случайно нарисовалась.


Особенности:
- Тотальная защита от неправильного ввода (убрана по совету ментора за ненадобностью)
- Легкое рисование и стирание с зажатой кнопкой (ЛКМ или ПКМ соответственно)
- Устранен баг при рисовании, когда можно было зажать кнопку, увести курсор из сетки, отпустить кнопку, вернуться на сетку, а рисование продолжалось
- Устранен баг, когда можно было рисовать правой кнопкой мыши.
*/

const colorPicker = $("#colorPicker");
const inputHeight = $("#input_height");
const inputWidth = $("#input_width");
const sizePicker = $("#sizePicker");
const table = $("#pixel_canvas");
const canvas = document.getElementById("pixel_canvas");


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
    $(this).css("background-color", colorPicker.val());

    // Listening for mouseUp
    $(document).on("mouseup", () => draw = false);

    // Continuos drawing
    table.on("mouseenter", "td", () => {
      if (draw) {
        $(this).css("background-color", colorPicker.val());
      } else {
        return;
      }

    });

    // Erasing
  } else if (event.which === 3) {
    let erase = true;
    $(this).css("background-color", "white");

    // Listening for mouseUp and disabling contextmenu
    $(document).on("mouseup", () => erase = false);

    // Continuos erasing
    table.on("mouseenter", "td", () => {
      if (erase) {
        $(this).css("background-color", "white");
      } else {
        return;
      }

    });
  }

});