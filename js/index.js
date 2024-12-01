const EDIT_BUTTON_PREFIX = 'edit-button-';

const titleInput = document.getElementById("title_input");
const descriptionInput = document.getElementById("description_input");
const speedInput = document.getElementById("speed_input");
const priceInput = document.getElementById("price_input");
const itemsContainer = document.getElementById("items_container");
const dropContainer = document.getElementById("drop_container");

const findInput = document.getElementById("find_input");
const findButton = document.getElementById("find_button");
const cancelFindButton = document.getElementById("cancel_find_button");
const countPriceButton = document.getElementById("count_price_button");
const totalPriceContainer = document.getElementById("total_price");

let items = [];

const itemTemplate = ({ id, title, description, speed, price }) => `
<li id="${id}" class="card mb-3 item-card" draggable="true" style="width: 18rem;">
  <img src="assets/car.jpg" class="item-container__image card-img-top" alt="car image">
  <div class="card-body">
    <h5 class="card-title">${title}</h5>
    <p class="card-text">Engine Power: ${description}</p>
    <p class="card-text">Max Speed: ${speed} km/h</p>
    <p class="card-text">Price: $${price}</p>
    <button id="${EDIT_BUTTON_PREFIX}${id}" type="button" class="btn btn-info">
      Edit
    </button>
  </div>
</li>`;

const clearInputs = () => {
  titleInput.value = "";
  descriptionInput.value = "";
  speedInput.value = "";
  priceInput.value = "";
};

const addItemToPage = ({ id, title, description, speed, price }) => {
  itemsContainer.insertAdjacentHTML("afterbegin", itemTemplate({ id, title, description, speed, price }));

  const element = document.getElementById(id);
  const editButton = document.getElementById(`${EDIT_BUTTON_PREFIX}${id}`);

  //обробник події dragstart
  element.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', id); 
    setTimeout(() => {
      element.style.display = 'none'; 
    }, 0);
  });

  // обробник події dragend
  element.addEventListener('dragend', () => {
    element.style.display = 'block'; 
  });
};

const renderItemsList = (items) => {
  itemsContainer.innerHTML = "";

  for (const item of items) {
    addItemToPage(item);
  }
};

const getInputValues = () => {
  return {
    title: titleInput.value,
    description: descriptionInput.value,
    speed: speedInput.value,
    price: priceInput.value,
  };
};

findButton.addEventListener("click", () => {
  const searchTerm = findInput.value.toLowerCase();
  const filteredItems = items.filter(item => item.title.toLowerCase().includes(searchTerm));
  renderItemsList(filteredItems);
});

cancelFindButton.addEventListener("click", () => {
  findInput.value = "";
  renderItemsList(items);
});

countPriceButton.addEventListener("click", () => {
  let totalPrice = 0;

  items.forEach(item => {
    totalPrice += parseFloat(item.price);
  });

  totalPriceContainer.innerHTML = `<h5>Total Price: $${totalPrice.toFixed(2)}</h5>`;
});

document.getElementById("submit_button").addEventListener("click", (event) => {
  event.preventDefault();
  const newItem = {
    id: uuid.v4(),
    ...getInputValues()
  };

  items.unshift(newItem);
  addItemToPage(newItem);
  clearInputs();
});

// Обробники подій для контейнера скидання
dropContainer.addEventListener('dragover', (event) => {
  event.preventDefault(); 
});

dropContainer.addEventListener('drop', (event) => {
  event.preventDefault();
  const id = event.dataTransfer.getData('text/plain');
  const itemIndex = items.findIndex(item => item.id === id);

  if (itemIndex > -1) {
    items.splice(itemIndex, 1);
    renderItemsList(items);
  }
});

const sortPriceButton = document.getElementById("sort_price_button");

sortPriceButton.addEventListener("click", () => {
  items.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); // Сортуємо масив за зростанням ціни
  renderItemsList(items); 
});