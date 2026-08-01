const products = [
  {id:1,name:"Urban Runner",category:"men",price:49.99,old:69.99,color:"#7c4b2d",badge:"-28%"},
  {id:2,name:"Classic Brown",category:"men",price:58.00,old:74.00,color:"#b56824",badge:"NEW"},
  {id:3,name:"Play Day",category:"kids",price:39.00,old:49.00,color:"#f5a623",badge:"-20%"},
  {id:4,name:"City Oxford",category:"men",price:64.00,old:79.00,color:"#8b4f29",badge:"HOT"},
  {id:5,name:"Sky Sprint",category:"women",price:55.00,old:70.00,color:"#36a9d6",badge:"-21%"},
  {id:6,name:"Night Pace",category:"women",price:52.00,old:65.00,color:"#e84949",badge:"NEW"},
  {id:7,name:"Daily Low",category:"women",price:46.00,old:59.00,color:"#c68c5f",badge:"-22%"},
  {id:8,name:"Mini Motion",category:"kids",price:34.00,old:45.00,color:"#ff8f1f",badge:"-24%"}
];

let cart = JSON.parse(localStorage.getItem("sparkCart") || "[]");
let currentFilter = "all";

const grid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

function money(value){ return `$${value.toFixed(2)}`; }

function renderProducts(query = ""){
  const q = query.trim().toLowerCase();
  const filtered = products.filter(p =>
    (currentFilter === "all" || p.category === currentFilter) &&
    p.name.toLowerCase().includes(q)
  );

  grid.innerHTML = filtered.length ? filtered.map(p => `
    <article class="product-card">
      <div class="product-image" style="--shoe-color:${p.color}">
        <span class="badge">${p.badge}</span>
        <button class="wish" aria-label="Add ${p.name} to wishlist">♡</button>
      </div>
      <div class="product-info">
        <span class="category">${p.category} shoes</span>
        <h3>${p.name}</h3>
        <div class="rating">★★★★★ <span style="color:#999">(24)</span></div>
        <div class="price-row">
          <div><span class="price">${money(p.price)}</span><span class="old-price">${money(p.old)}</span></div>
          <button class="add-cart" data-id="${p.id}" aria-label="Add ${p.name} to cart">+</button>
        </div>
      </div>
    </article>
  `).join("") : `<p>No products found.</p>`;
}

function saveCart(){
  localStorage.setItem("sparkCart", JSON.stringify(cart));
}

function addToCart(id){
  const product = products.find(p => p.id === id);
  const item = cart.find(i => i.id === id);
  if(item) item.qty += 1;
  else cart.push({...product, qty:1});
  saveCart();
  renderCart();
  showToast(`${product.name} added to cart`);
}

function removeFromCart(id){
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function renderCart(){
  cartCount.textContent = cart.reduce((sum,item)=>sum+item.qty,0);
  if(!cart.length){
    cartItems.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    cartTotal.textContent = "$0.00";
    return;
  }
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-thumb">👟</div>
      <div>
        <h4>${item.name}</h4>
        <p>${item.qty} × ${money(item.price)}</p>
      </div>
      <button class="remove-item" data-remove="${item.id}" aria-label="Remove ${item.name}">×</button>
    </div>
  `).join("");
  const total = cart.reduce((sum,item)=>sum + item.price*item.qty,0);
  cartTotal.textContent = money(total);
}

function openCart(){
  drawer.classList.add("open");
  overlay.classList.add("show");
  drawer.setAttribute("aria-hidden","false");
}
function closeCart(){
  drawer.classList.remove("open");
  overlay.classList.remove("show");
  drawer.setAttribute("aria-hidden","true");
}
function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(()=>toast.classList.remove("show"),1800);
}

document.addEventListener("click", e => {
  const add = e.target.closest(".add-cart");
  const remove = e.target.closest(".remove-item");
  if(add) addToCart(Number(add.dataset.id));
  if(remove) removeFromCart(Number(remove.dataset.remove));
});

document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderProducts(document.getElementById("searchInput").value);
  });
});

document.getElementById("searchBtn").addEventListener("click",()=>renderProducts(document.getElementById("searchInput").value));
document.getElementById("searchInput").addEventListener("input",e=>renderProducts(e.target.value));
document.getElementById("cartButton").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("menuButton").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
document.getElementById("closeAnnouncement").addEventListener("click",e=>e.target.parentElement.remove());
document.getElementById("checkoutButton").addEventListener("click",()=>{
  if(!cart.length) return showToast("Your cart is empty");
  showToast("Demo checkout — connect your payment system here");
});
document.getElementById("newsletterForm").addEventListener("submit",e=>{
  e.preventDefault();
  document.getElementById("newsletterMessage").textContent = "Thank you! Your discount code is SPARK25.";
  e.target.reset();
});

renderProducts();
renderCart();
