// simple, readable variable names
const products = [
    // Baskets (re-using bouquet images as placeholders)
    { id: "b1", name: "Basket 1", cat: "basket", price: 1200, img: "bouquet1.jpg" },
    { id: "b2", name: "Basket 2", cat: "basket", price: 1500, img: "bouquet2.jpg" },
    { id: "b3", name: "Basket 3", cat: "basket", price: 1100, img: "bouquet3.jpg" },
    { id: "b4", name: "Basket 4", cat: "basket", price: 1800, img: "bouquet4.jpg" },
    { id: "b5", name: "Basket 5", cat: "basket", price: 1400, img: "bouquet5.jpg" },
  
    // Bouquets
    { id: "q1", name: "Bouquet 1", cat: "bouquet", price: 900, img: "bouquet1.jpg" },
    { id: "q2", name: "Bouquet 2", cat: "bouquet", price: 1100, img: "bouquet2.jpg" },
    { id: "q3", name: "Bouquet 3", cat: "bouquet", price: 1300, img: "bouquet3.jpg" },
    { id: "q4", name: "Bouquet 4", cat: "bouquet", price: 1600, img: "bouquet4.jpg" },
    { id: "q5", name: "Bouquet 5", cat: "bouquet", price: 1000, img: "bouquet5.jpg" },
  
    // Boxes
    { id: "x1", name: "Box 1", cat: "box", price: 700, img: "box1.jpg" },
    { id: "x2", name: "Box 2", cat: "box", price: 850, img: "box2.jpg" },
    { id: "x3", name: "Box 3", cat: "box", price: 950, img: "box3.jpg" },
    { id: "x4", name: "Box 4", cat: "box", price: 1200, img: "box4.jpg" },
    { id: "x5", name: "Box 5", cat: "box", price: 1400, img: "box5.jpg" }
  ];
  
  const productList = document.getElementById("productList");
  const searchInput = document.getElementById("searchInput");
  const catSelect = document.getElementById("catSelect");
  const searchBtn = document.getElementById("searchBtn");
  
  const cartBtn = document.getElementById("cartBtn");
  const cartSidebar = document.getElementById("cartSidebar");
  const closeCart = document.getElementById("closeCart");
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const cartCountEl = document.getElementById("cartCount");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const clearCartBtn = document.getElementById("clearCart");
  
  let cart = JSON.parse(localStorage.getItem("ww_cart") || "[]");
  
  // render year
  document.getElementById("year").textContent = new Date().getFullYear();
  
  // render products initially
  function renderProducts(list) {
    productList.innerHTML = "";
    list.forEach(p => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <div class="product-img"><img src="${p.img}" alt="${p.name}" /></div>
        <div class="prod-title">${p.name}</div>
        <div class="price">PKR ${p.price.toLocaleString()}</div>
        <div style="color:var(--muted);font-size:13px">Category: ${p.cat}</div>
        <div class="actions">
          <button class="btn add" data-id="${p.id}">Add to Cart</button>
          <button class="btn info" onclick="showInfo('${p.id}')">Details</button>
        </div>
      `;
      productList.appendChild(div);
    });
    // attach add to cart handlers
    document.querySelectorAll(".add").forEach(btn =>
      btn.addEventListener("click", e => addToCart(e.target.dataset.id))
    );
  }
  
  function showInfo(id){
    const p = products.find(x=>x.id===id);
    alert(`${p.name}\nCategory: ${p.cat}\nPrice: PKR ${p.price}`);
  }
  
  // search/filter
  function doSearch() {
    const text = searchInput.value.trim().toLowerCase();
    const cat = catSelect.value;
    const filtered = products.filter(p => {
      const matchCat = cat === "all" ? true : p.cat === cat;
      const matchText = text === "" ? true : (p.name + " " + p.cat).toLowerCase().includes(text);
      return matchCat && matchText;
    });
    renderProducts(filtered);
  }
  
  searchBtn.addEventListener("click", doSearch);
  searchInput.addEventListener("keyup", (e)=>{ if(e.key==="Enter") doSearch(); });
  catSelect.addEventListener("change", doSearch);
  
  // cart functions
  function saveCart(){
    localStorage.setItem("ww_cart", JSON.stringify(cart));
    renderCart();
  }
  
  function addToCart(id){
    const p = products.find(x=>x.id===id);
    if(!p) return;
    const found = cart.find(c=>c.id===id);
    if(found) found.qty += 1; else cart.push({ id:p.id, name:p.name, price:p.price, img:p.img, qty:1});
    saveCart();
    flashMessage(`${p.name} added to cart`);
  }
  
  function renderCart(){
    cartItemsEl.innerHTML = "";
    let total = 0;
    cart.forEach(item=>{
      total += item.price*item.qty;
      const r = document.createElement("div");
      r.className = "cart-row";
      r.innerHTML = `
        <img src="${item.img}" />
        <div style="flex:1">
          <div style="font-weight:600">${item.name}</div>
          <div style="color:var(--muted)">PKR ${item.price.toLocaleString()} x ${item.qty}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <button class="small" data-id="${item.id}">+</button>
          <button class="small dec" data-id="${item.id}">-</button>
        </div>
      `;
      cartItemsEl.appendChild(r);
    });
  
    // add handlers for + and -
    cartItemsEl.querySelectorAll(".small").forEach(b => {
      b.addEventListener("click", e => {
        const id = e.target.dataset.id;
        const it = cart.find(x=>x.id===id);
        if(!it) return;
        it.qty += 1;
        saveCart();
      });
    });
    cartItemsEl.querySelectorAll(".dec").forEach(b => {
      b.addEventListener("click", e => {
        const id = e.target.dataset.id;
        const it = cart.find(x=>x.id===id);
        if(!it) return;
        it.qty -= 1;
        if(it.qty <= 0) cart = cart.filter(x=>x.id !== id);
        saveCart();
      });
    });
  
    cartTotalEl.textContent = `PKR ${total.toLocaleString()}`;
    cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);
  }
  
  // cart open/close
  cartBtn.addEventListener("click", ()=>{ cartSidebar.classList.toggle("hidden"); renderCart(); });
  closeCart.addEventListener("click", ()=>cartSidebar.classList.add("hidden"));
  checkoutBtn.addEventListener("click", ()=> {
    if(cart.length===0) { alert("Cart is empty"); return; }
    // simple checkout simulation
    alert("Thank you! Order placed. Our team will contact you for delivery details.");
    cart = [];
    saveCart();
    cartSidebar.classList.add("hidden");
  });
  clearCartBtn.addEventListener("click", ()=>{ cart = []; saveCart(); });
  
  // small UI helpers
  function flashMessage(txt){
    const el = document.createElement("div");
    el.textContent = txt;
    el.style = "position:fixed;left:50%;transform:translateX(-50%);top:18px;background:#111;color:#fff;padding:8px 12px;border-radius:8px;z-index:999";
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),1500);
  }
  
  // init
  renderProducts(products);
  renderCart();
  saveCart();
  