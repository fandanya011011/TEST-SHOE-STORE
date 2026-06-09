document.addEventListener("DOMContentLoaded", () => {
  
  // Стани (State) кошика
  let currency = "UAH"; 
  let discountPercent = 0;
  const taxRate = 0.08; // 8% ПДВ
  let shippingCostUAH = 250;
  let shippingCostUSD = 6.25;

  // Селектори елементів DOM
  const currencyToggle = document.getElementById("currencyToggle");
  const currencyText = document.getElementById("currencyText");
  const cartCountBadge = document.getElementById("cartCount");
  
  const cartGrid = document.getElementById("cartGrid");
  const emptyCartView = document.getElementById("emptyCartView");
  const cartItemsList = document.getElementById("cartItemsList");

  // Елементи фінансового звіту
  const subtotalVal = document.getElementById("subtotalVal");
  const discountBlock = document.getElementById("discountBlock");
  const discountTitle = document.getElementById("discountTitle");
  const discountVal = document.getElementById("discountVal");
  const shippingVal = document.getElementById("shippingVal");
  const taxVal = document.getElementById("taxVal");
  const totalVal = document.getElementById("totalVal");
  const modalTotalSpan = document.querySelector(".modal-total-price");

  // Робота з купонами
  const promoForm = document.getElementById("promoForm");
  const promoInput = document.getElementById("promoInput");
  const promoStatus = document.getElementById("promoStatus");

  // ФУНКЦІЯ ОРЕНДЕРУ ТОВАРІВ З LOCALSTORAGE
  function renderCartItems() {
    // Зчитуємо дані
    const cart = JSON.parse(localStorage.getItem("elite_kicks_cart")) || [];
    cartItemsList.innerHTML = ""; // Очищаємо статичний HTML шаблону

    if (cart.length === 0) {
      cartGrid.classList.add("d-none");
      emptyCartView.classList.remove("d-none");
      if (cartCountBadge) {
        cartCountBadge.textContent = "0";
        cartCountBadge.classList.add("d-none");
      }
      return;
    }

    cartGrid.classList.remove("d-none");
    emptyCartView.classList.add("d-none");

    // Генеруємо HTML для кожного збереженого товару
    cart.forEach((item, index) => {
      const basePrice = currency === "UAH" ? item.priceUAH : item.priceUSD;
      const itemSubtotal = basePrice * item.quantity;
      
      const priceText = currency === "UAH" 
        ? `${itemSubtotal.toLocaleString("uk-UA")} ₴` 
        : `$${itemSubtotal.toFixed(2)}`;
        
      const singlePriceText = currency === "UAH"
        ? `${basePrice.toLocaleString("uk-UA")} ₴ кожна`
        : `$${basePrice.toFixed(2)} each`;

      const showSinglePrice = item.quantity > 1 ? "" : "d-none";

      const itemHTML = `
        <div class="card product-cart-item p-4 border shadow-sm rounded-3 transition-300" data-index="${index}">
          <div class="row g-3 align-items-center">
            <div class="col-md-3 col-sm-4 text-center bg-light rounded-3 p-3">
              <img src="${item.img}" class="img-fluid mix-blend-multiply" alt="${item.name}" style="max-height: 120px;">
            </div>
            
            <div class="col-md-9 col-sm-8 d-flex flex-column justify-content-between">
              <div>
                <div class="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <h3 class="font-bold fs-5 text-dark m-0">${item.name}</h3>
                    <p class="text-muted text-xs font-semibold mt-1 uppercase tracking-wider">${item.brand} / ${item.category}</p>
                  </div>
                  <div class="text-end">
                    <p class="font-black text-primary fs-5 m-0 item-total-price">${priceText}</p>
                    <p class="text-muted text-xs m-0 mt-1 item-single-price ${showSinglePrice}">${singlePriceText}</p>
                  </div>
                </div>

                <div class="d-flex gap-4 mt-3">
                  <div>
                    <label class="text-muted font-bold text-uppercase text-xs tracking-wider d-block mb-1">Розмір</label>
                    <select class="form-select form-select-sm font-bold text-xs bg-white border rounded size-select">
                      <option value="41" ${item.size === 41 ? "selected" : ""}>41.0</option>
                      <option value="42" ${item.size === 42 ? "selected" : ""}>42.0</option>
                      <option value="43" ${item.size === 43 ? "selected" : ""}>43.0</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-muted font-bold text-uppercase text-xs tracking-wider d-block mb-1">Колір</label>
                    <select class="form-select form-select-sm font-bold text-xs bg-white border rounded color-select">
                      <option value="Orange" ${item.color === "Orange" ? "selected" : ""}>Orange</option>
                      <option value="White" ${item.color === "White" ? "selected" : ""}>White</option>
                      <option value="Deep Charcoal" ${item.color === "Deep Charcoal" ? "selected" : ""}>Deep Charcoal</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mt-4">
                <div class="d-flex align-items-center border rounded-pill px-2 py-1 bg-white gap-3">
                  <button class="btn btn-link text-dark p-0 d-flex align-items-center justify-content-center qty-minus" style="width: 24px; height: 24px; text-decoration: none;"><i class="bi bi-minus"></i></button>
                  <span class="font-bold text-xs text-dark w-4 text-center select-none qty-count">${item.quantity}</span>
                  <button class="btn btn-link text-dark p-0 d-flex align-items-center justify-content-center qty-plus" style="width: 24px; height: 24px; text-decoration: none;"><i class="bi bi-plus"></i></button>
                </div>
                <button class="btn btn-link text-danger text-uppercase font-black text-xs d-flex align-items-center gap-1 remove-item-btn" style="text-decoration: none;">
                  <i class="bi bi-trash3"></i> <span>REMOVE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      cartItemsList.insertAdjacentHTML("beforeend", itemHTML);
    });

    calculateCart();
  }

  // Оновлення математичних підсумків чека
  function calculateCart() {
    const cart = JSON.parse(localStorage.getItem("elite_kicks_cart")) || [];
    
    let subtotal = 0;
    let totalItemsCount = 0;

    cart.forEach(item => {
      const basePrice = currency === "UAH" ? item.priceUAH : item.priceUSD;
      subtotal += basePrice * item.quantity;
      totalItemsCount += item.quantity;
    });

    // Якщо все видалили
    if (cart.length === 0) {
      cartGrid.classList.add("d-none");
      emptyCartView.classList.remove("d-none");
      if (cartCountBadge) cartCountBadge.classList.add("d-none");
      return;
    }

    // Фінальні калькуляції
    const discount = subtotal * (discountPercent / 100);
    const shipping = currency === "UAH" ? shippingCostUAH : shippingCostUSD;
    const tax = subtotal * taxRate;
    const total = Math.max(0, subtotal + shipping + tax - discount);

    // Оновлюємо інтерфейс чека
    if (currency === "UAH") {
      subtotalVal.textContent = `${subtotal.toLocaleString("uk-UA")} ₴`;
      shippingVal.textContent = `${shipping.toLocaleString("uk-UA")} ₴`;
      taxVal.textContent = `${Math.round(tax).toLocaleString("uk-UA")} ₴`;
      totalVal.textContent = `${Math.round(total).toLocaleString("uk-UA")} ₴`;
      modalTotalSpan.textContent = `${Math.round(total).toLocaleString("uk-UA")} ₴`;
      if (discountPercent > 0) {
        discountVal.textContent = `-${Math.round(discount).toLocaleString("uk-UA")} ₴`;
      }
    } else {
      subtotalVal.textContent = `$${subtotal.toFixed(2)}`;
      shippingVal.textContent = `$${shipping.toFixed(2)}`;
      taxVal.textContent = `$${tax.toFixed(2)}`;
      totalVal.textContent = `$${total.toFixed(2)}`;
      modalTotalSpan.textContent = `$${total.toFixed(2)}`;
      if (discountPercent > 0) {
        discountVal.textContent = `-$${discount.toFixed(2)}`;
      }
    }

    // Відображення блоку знижки
    if (discountPercent > 0) {
      discountTitle.textContent = `Знижка (${discountPercent}%)`;
      discountBlock.classList.remove("d-none");
    } else {
      discountBlock.classList.add("d-none");
    }

    // Оновлюємо бейдж
    if (cartCountBadge) {
      cartCountBadge.textContent = totalItemsCount;
      cartCountBadge.classList.remove("d-none");
    }
  }

  // Делегування подій (Зміна Кількості, Видалення, Зміна Розміру/Кольору)
  cartItemsList.addEventListener("click", (e) => {
    const target = e.target;
    const itemRow = target.closest(".product-cart-item");
    if (!itemRow) return;

    const index = parseInt(itemRow.getAttribute("data-index"));
    let cart = JSON.parse(localStorage.getItem("elite_kicks_cart")) || [];

    // Клік на плюс
    if (target.closest(".qty-plus")) {
      cart[index].quantity += 1;
      localStorage.setItem("elite_kicks_cart", JSON.stringify(cart));
      renderCartItems();
    }
    // Клік на мінус
    else if (target.closest(".qty-minus")) {
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        localStorage.setItem("elite_kicks_cart", JSON.stringify(cart));
        renderCartItems();
      }
    }
    // Клік на видалення товару
    else if (target.closest(".remove-item-btn")) {
      cart.splice(index, 1); // видаляємо елемент з масиву
      localStorage.setItem("elite_kicks_cart", JSON.stringify(cart));
      renderCartItems();
    }
  });

  // Відстеження вибору селектів (розмір та колір) для збереження у localStorage
  cartItemsList.addEventListener("change", (e) => {
    const target = e.target;
    const itemRow = target.closest(".product-cart-item");
    if (!itemRow) return;

    const index = parseInt(itemRow.getAttribute("data-index"));
    let cart = JSON.parse(localStorage.getItem("elite_kicks_cart")) || [];

    if (target.classList.contains("size-select")) {
      cart[index].size = parseInt(target.value);
    } else if (target.classList.contains("color-select")) {
      cart[index].color = target.value;
    }
    localStorage.setItem("elite_kicks_cart", JSON.stringify(cart));
  });

  // Перемикач валюти (UAH / USD)
  currencyToggle.addEventListener("click", () => {
    currency = (currency === "UAH") ? "USD" : "UAH";
    currencyText.textContent = currency;
    renderCartItems();
  });

  // Валідація промокоду
  promoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = promoInput.value.trim().toUpperCase();
    promoStatus.className = "text-xs font-bold mt-2"; 

    if (code === "ELITE10") {
      discountPercent = 10;
      promoStatus.textContent = "🎉 Купон ELITE10 активовано (10% знижки)!";
      promoStatus.classList.add("text-success");
    } else {
      discountPercent = 0;
      promoStatus.textContent = "❌ Промокод недійсний.";
      promoStatus.classList.add("text-danger");
    }
    promoStatus.classList.remove("d-none");
    calculateCart();
  });

  // Оформлення замовлення
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutStep1 = document.getElementById("checkoutStep1");
  const checkoutStep2 = document.getElementById("checkoutStep2");

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const formData = new FormData(checkoutForm);
    const clientName = formData.get("name");

    document.getElementById("resOrderNum").textContent = `#EK-${Math.floor(10000 + Math.random() * 90000)}`;
    document.getElementById("resName").textContent = clientName;
    document.getElementById("resTotal").textContent = totalVal.textContent;

    document.getElementById("closeModalBtn").classList.add("d-none");
    checkoutStep1.classList.add("d-none");
    checkoutStep2.classList.remove("d-none");

    // Очищаємо кошик в LocalStorage після успішного оформлення
    localStorage.removeItem("elite_kicks_cart");
  });

  // Перший запуск побудови списку товарів
  renderCartItems();
});