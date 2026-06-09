document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Зміна валюти за кліком (Toggle Currency)
  const currencyToggle = document.getElementById("currencyToggle");
  const currencyText = document.getElementById("currencyText");

  currencyToggle.addEventListener("click", () => {
    if (currencyText.textContent === "UAH") {
      currencyText.textContent = "USD";
    } else {
      currencyText.textContent = "UAH";
    }
  });

  // 2. Імітація роботи відправки форми новин у футері
  const newsletterForm = document.getElementById("newsletterForm");
  const subscribeSuccess = document.getElementById("subscribeSuccess");

  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input[type="email"]');
    
    if (input.value.trim() !== "") {
      // Показуємо успішне сповіщення (імітуємо стейт з React)
      subscribeSuccess.classList.remove("d-none");
      input.value = ""; // Очищаємо інпут

      // Приховуємо за 4 секунди
      setTimeout(() => {
        subscribeSuccess.classList.add("d-none");
      }, 4000);
    }
  });

  // 3. Перемикання активного пункту навігації (імітація currentView)
  const navButtons = document.querySelectorAll(".nav-links .nav-btn");
  navButtons.forEach(button => {
    button.addEventListener("click", () => {
      navButtons.forEach(btn => btn.classList.remove("active-link"));
      button.classList.add("active-link");
    });
  });



function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("elite_kicks_cart")) || [];

  const totalCount = cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  const badge = document.getElementById("cartCount");

  if (badge) {
    badge.textContent = totalCount;
  }
}
updateCartBadge()
 document.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-cart-btn");

  if (!btn) return;

  const product = {
    id: Number(btn.dataset.id),
    name: btn.dataset.name,
    priceUAH: Number(btn.dataset.price),
    img: btn.dataset.img,
    quantity: 1
  };

  let cart = JSON.parse(localStorage.getItem("elite_kicks_cart")) || [];

  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("elite_kicks_cart", JSON.stringify(cart));

  updateCartBadge();

  alert("Товар додано в кошик");
});

});
