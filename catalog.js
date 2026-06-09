document.addEventListener("DOMContentLoaded", () => {

  // 1. База даних товарів (Mock Data)
  const PRODUCTS_DATA = [
    { id: 1, name: "Elite Speed Runner X", brand: "Nike", category: "Running", priceUAH: 3200, priceUSD: 80, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop" },
    { id: 2, name: "Air Max Cushion Prime", brand: "Nike", category: "Lifestyle", priceUAH: 4500, priceUSD: 112.5, img: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=400&auto=format&fit=crop" },
    { id: 3, name: "Ultraboost Speed Pro", brand: "Adidas", category: "Running", priceUAH: 5200, priceUSD: 130, img: "https://images.unsplash.com/photo-1580902394724-b08ff9ba7e8a?q=80&w=774&auto=format&fit=crop" },
    { id: 4, name: "Court King Retro", brand: "Adidas", category: "Lifestyle", priceUAH: 2800, priceUSD: 70, img: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=400&auto=format&fit=crop" },
    { id: 5, name: "Puma Clyde All-Pro", brand: "Puma", category: "Basketball", priceUAH: 3900, priceUSD: 97.5, img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=400&auto=format&fit=crop" },
    { id: 6, name: "Nitro Elite Track V2", brand: "Puma", category: "Running", priceUAH: 4100, priceUSD: 102.5, img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400&auto=format&fit=crop" }
  ];

  // Державні глобальні змінні (State)
  let currentCurrency = "UAH";
  let cartCount = 0;
  
  // Фільтраційні стани
  let activeCategory = "all";
  let activeBrands = [];
  let searchQuery = "";
  let currentSort = "default";

  // Елементи інтерфейсу
  const catalogGrid = document.getElementById("catalogGrid");
  const noProductsView = document.getElementById("noProductsView");
  const itemsCounter = document.getElementById("itemsCounter");
  const searchInput = document.getElementById("catalogSearch");
  const sortSelect = document.getElementById("sortSelect");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
  const currencyToggle = document.getElementById("currencyToggle");
  const currencyText = document.getElementById("currencyText");

  // Функція рендерингу карток
  function renderCatalog() {
    catalogGrid.innerHTML = ""; // Очищення сітки

    // Крок А: Фільтрація
    let filtered = PRODUCTS_DATA.filter(product => {
      // Фільтр за категорією
      const matchCategory = (activeCategory === "all" || product.category === activeCategory);
      // Фільтр за брендами
      const matchBrand = (activeBrands.length === 0 || activeBrands.includes(product.brand));
      // Фільтр за пошуковим словом
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchCategory && matchBrand && matchSearch;
    });

    // Крок Б: Сортування
    if (currentSort === "price-asc") {
      filtered.sort((a, b) => (currentCurrency === "UAH" ? a.priceUAH - b.priceUAH : a.priceUSD - b.priceUSD));
    } else if (currentSort === "price-desc") {
      filtered.sort((a, b) => (currentCurrency === "UAH" ? b.priceUAH - a.priceUAH : b.priceUSD - a.priceUSD));
    }

    // Крок В: Оновлення лічильника результатів
    itemsCounter.textContent = `Показано: ${filtered.length} товарів`;

    // Крок Г: Безпосереднє відмальовування
    if (filtered.length === 0) {
      noProductsView.classList.remove("d-none");
      return;
    }
    noProductsView.classList.add("d-none");

    filtered.forEach(product => {
      const priceText = currentCurrency === "UAH" 
        ? `${product.priceUAH.toLocaleString("uk-UA")} ₴` 
        : `$${product.priceUSD.toFixed(2)}`;

      const cardHTML = `
        <div class="col animate-fade">
          <div class="card h-100 catalog-product-card border-0 shadow-sm p-3 rounded-3 position-relative">
            <div class="img-box bg-light rounded-2 text-center p-3 mb-3 position-relative overflow-hidden" style="height: 180px;">
              <img src="${product.img}" class="img-fluid mix-blend-multiply h-100 object-fit-contain" alt="${product.name}">
            </div>
            <div class="card-body p-0 d-flex flex-column justify-content-between">
              <div>
                <span class="badge bg-secondary bg-opacity-10 text-dark font-bold tracking-wider text-uppercase" style="font-size:9px;">${product.brand}</span>
                <h5 class="card-title font-bold text-dark text-truncate fs-6 mt-1 mb-0" title="${product.name}">${product.name}</h5>
                <p class="text-muted text-xs font-medium mt-0.5">${product.category}</p>
              </div>
              <div class="d-flex justify-content-between align-items-center mt-3">
                <span class="font-black text-primary fs-5">${priceText}</span>
                <button class="btn btn-orange-sm rounded-circle d-flex align-items-center justify-content-center add-to-cart-btn" data-id="${product.id}" aria-label="Додати в кошик">
                  <i class="bi bi-bag-plus-fill text-white fs-6"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      catalogGrid.insertAdjacentHTML("beforeend", cardHTML);
    });
  }

  // СЛУХАЧІ ПОДІЙ ФІЛЬТРАЦІЇ

  // 1. Пошукове поле (Input Search)
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderCatalog();
    });
  }

  // 2. Радіо-кнопки категорій
  const categoryFilterGroup = document.getElementById("categoryFilterGroup");
  if (categoryFilterGroup) {
    categoryFilterGroup.addEventListener("change", (e) => {
      if (e.target.name === "categoryFilter") {
        activeCategory = e.target.value;
        renderCatalog();
      }
    });
  }

  // 3. Чекбокси брендів
  const brandFilterGroup = document.getElementById("brandFilterGroup");
  if (brandFilterGroup) {
    brandFilterGroup.addEventListener("change", () => {
      const checkboxes = document.querySelectorAll(".brand-checkbox");
      activeBrands = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
      renderCatalog();
    });
  }

  // 4. Комбобокс сортування
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderCatalog();
    });
  }

  // 5. Кнопка скидання фільтрів
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      searchQuery = "";
      activeCategory = "all";
      activeBrands = [];
      currentSort = "default";
      if (sortSelect) sortSelect.value = "default";

      const catAll = document.getElementById("cat-all");
      if (catAll) catAll.checked = true;
      document.querySelectorAll(".brand-checkbox").forEach(cb => cb.checked = false);

      renderCatalog();
    });
  }

  // 6. Перемикач Валют UAH/USD
  if (currencyToggle) {
    currencyToggle.addEventListener("click", () => {
      if (currentCurrency === "UAH") {
        currentCurrency = "USD";
        if (currencyText) currencyText.textContent = "USD";
      } else {
        currentCurrency = "UAH";
        if (currencyText) currencyText.textContent = "UAH";
      }
      renderCatalog();
    });
  }

  // 7. Додавання в кошик (Збереження в localStorage)
  let cartToast = null;
  const cartToastEl = document.getElementById("cartToast");
  if (cartToastEl && typeof bootstrap !== "undefined") {
    cartToast = new bootstrap.Toast(cartToastEl, { delay: 2000 });
  }

  // Функція для оновлення лічильника в шапці на сторінці каталогу
  function updateCatalogCartBadge() {
    const cart = JSON.parse(localStorage.getItem("elite_kicks_cart")) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById("cartCount");
    if (badge) {
      if (totalCount > 0) {
        badge.textContent = totalCount;
        badge.classList.remove("d-none");
      } else {
        badge.classList.add("d-none");
      }
    }
  }

  catalogGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart-btn");
    if (!btn) return;

    e.preventDefault();
    const id = parseInt(btn.getAttribute("data-id"));
    
    // Шукаємо дані про товар в нашому масиві PRODUCTS_DATA
    const productData = PRODUCTS_DATA.find(p => p.id === id);
    if (!productData) return;

    // Отримуємо поточний кошик зі сховища браузера
    let cart = JSON.parse(localStorage.getItem("elite_kicks_cart")) || [];

    // Перевіряємо, чи є вже такий товар у кошику
    // (за замовчуванням ставимо розмір 42 і колір Orange, як у вашому шаблоні)
    const existingItem = cart.find(item => item.id === id && item.size === 42 && item.color === "Orange");

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productData.id,
        name: productData.name,
        brand: productData.brand,
        category: productData.category,
        priceUAH: productData.priceUAH,
        priceUSD: productData.priceUSD,
        img: productData.img,
        size: 42,
        color: "Orange",
        quantity: 1
      });
    }

    // Зберігаємо оновлений масив назад у пам'ять браузера
    localStorage.setItem("elite_kicks_cart", JSON.stringify(cart));

    // Оновлюємо лічильник на кнопці кошика
    updateCatalogCartBadge();
    
    if (cartToast) {
      cartToast.show();
    } else {
      alert("Товар успішно додано до кошика!");
    }
  });

  // Викликаємо при завантаженні сторінки каталогу, щоб відобразити старі товари, якщо вони були
  updateCatalogCartBadge();

  // Початковий запуск каталогу
  renderCatalog();
});