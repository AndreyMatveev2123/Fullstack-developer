const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

let data;

try {
  data = JSON.parse(sourceJson);
  console.log(data);
  const serviceForm = document.querySelector("#service-form");
  serviceForm.hidden = false;
} catch (error) {
  const errorBlock = document.querySelector("#data-error");
  errorBlock.textContent = "Ошибка данных.";
  errorBlock.hidden = false;

  const errorForm = document.querySelector("#service-form");
  errorForm.hidden = true;
}

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selectedServices = services.filter(
    (service) =>
      (service.id === "audio" && audioChecked === true) ||
      (service.id === "catalog" && catalogChecked === true) ||
      (service.id === "guide" && guideChecked === true),
  );

  const items = selectedServices.map((service) => {
    const { title, price } = service;

    return {
      title: title.trim(),
      price: price,
    };
  });

  const total = items.reduce((sum, service) => {
    return sum + service.price;
  }, 0);

  const count = selectedServices.length;

  return {
    count,
    items,
    total,
  };
}

const showProgramButton = document.querySelector("#show-program");

showProgramButton.addEventListener("click", function () {
  const programBlock = document.querySelector("#program");
  if (data) {
    programBlock.innerHTML = data.event.meeting;
    programBlock.hidden = false;
  }
});

const serviceForm = document.querySelector("#service-form");

serviceForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const guideChecked = document.querySelector("#guide").checked;
  const audioChecked = document.querySelector("#audio").checked;
  const catalogChecked = document.querySelector("#catalog").checked;

  console.log(guideChecked);
  console.log(audioChecked);
  console.log(catalogChecked);

  const report = buildReport(
    data.services,
    guideChecked,
    audioChecked,
    catalogChecked,
  );

  const choiceError = document.querySelector("#choice-error");
  const reportJSON = document.querySelector("#report-json");
  const result = document.querySelector("#result");

  if (report.count === 0) {
    choiceError.textContent = "Выберите хотя бы одну услугу.";
    choiceError.hidden = false;
    reportJSON.hidden = true;
    result.hidden = true;

    return;
  } else {
    choiceError.hidden = true;
    const titles = report.items.map((service) => service.title);
    const joinTitle = titles.join("<br>");

    result.innerHTML = `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.<br>${joinTitle}`;
    result.hidden = false;

    const jsonString = JSON.stringify(report);

    JSON.parse(jsonString);

    reportJSON.textContent = jsonString;

    reportJSON.hidden = false;
  }
});
