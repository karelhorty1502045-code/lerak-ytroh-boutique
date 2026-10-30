const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const menu=$("#mobileMenu"),nav=$("#mainNav");
menu.addEventListener("click",()=>nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
const products=$$(".product"),filterButtons=$$(".filter");
let active="all",cart=[];
const format=n=>new Intl.NumberFormat("fr-FR").format(n)+" FCFA";
function filterProducts(){
 const term=$("#search").value.trim().toLowerCase();
 let count=0;
 products.forEach(p=>{
  const cat=active==="all"||p.dataset.category===active;
  const match=(p.dataset.name+" "+p.dataset.search).toLowerCase().includes(term);
  p.hidden=!(cat&&match);if(!p.hidden)count++;
 });
}
function setFilter(value){
 active=value;
 filterButtons.forEach(b=>b.classList.toggle("active",b.dataset.filter===value));
 filterProducts();
}
filterButtons.forEach(b=>b.addEventListener("click",()=>setFilter(b.dataset.filter)));
$$(".categories button").forEach(b=>b.addEventListener("click",()=>{
 const map={makeup:"beauty",skincare:"beauty",perfume:"beauty",clothes:"fashion",shoes:"fashion",wigs:"hair",bags:"fashion",accessories:"accessories",watches:"accessories",hair:"hair"};
 setFilter(map[b.dataset.category]||"all");$("#products").scrollIntoView({behavior:"smooth"});
}));
$("#search").addEventListener("input",filterProducts);
$("#sort").addEventListener("change",e=>{
 const grid=$("#productGrid");
 const sorted=[...products].sort((a,b)=>e.target.value==="price-up"?+a.dataset.price- +b.dataset.price:e.target.value==="price-down"?+b.dataset.price- +a.dataset.price:0);
 sorted.forEach(p=>grid.appendChild(p));
});
$$(".heart").forEach(b=>b.addEventListener("click",()=>{b.classList.toggle("selected");b.textContent=b.classList.contains("selected")?"♥":"♡"}));
const panel=$("#cartPanel"),overlay=$("#overlay");
function openCart(){panel.classList.add("open");overlay.classList.add("open")}
function closeCart(){panel.classList.remove("open");overlay.classList.remove("open")}
$("#showCart").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);overlay.addEventListener("click",closeCart);
function renderCart(){
 const qty=cart.reduce((s,x)=>s+x.qty,0),total=cart.reduce((s,x)=>s+x.price*x.qty,0);
 $("#cartCount").textContent=qty;$("#cartQty").textContent="("+qty+")";$("#subtotal").textContent=format(total);$("#checkout").disabled=!cart.length;
 const box=$("#cartItems");box.innerHTML="";
 if(!cart.length){box.innerHTML="<p>Votre panier est vide.</p>";return}
 cart.forEach((item,index)=>{
  const line=document.createElement("div");line.className="cart-line";
  const info=document.createElement("div");
  const title=document.createElement("b");title.textContent=item.name;
  const opt=document.createElement("small");opt.textContent=item.option+" · "+format(item.price);
  const controls=document.createElement("div");controls.className="qty-controls";
  const minus=document.createElement("button");minus.textContent="−";minus.addEventListener("click",()=>{item.qty--;if(item.qty<=0)cart.splice(index,1);renderCart()});
  const amount=document.createElement("span");amount.textContent=item.qty;
  const plus=document.createElement("button");plus.textContent="+";plus.addEventListener("click",()=>{if(item.qty<20)item.qty++;renderCart()});
  const remove=document.createElement("button");remove.className="remove";remove.textContent="Retirer";remove.addEventListener("click",()=>{cart.splice(index,1);renderCart()});
  controls.append(minus,amount,plus,remove);info.append(title,opt,controls);
  const sum=document.createElement("b");sum.textContent=format(item.price*item.qty);
  line.append(info,sum);box.append(line);
 });
}
$$(".add").forEach(btn=>btn.addEventListener("click",()=>{
 const card=btn.closest(".product"),options=btn.dataset.options.split("|"),label=options[0].split(":")[0];
 const selected=prompt("Choisissez "+label+" :\n"+options.slice(1).map((x,i)=>(i+1)+". "+x).join("\n"),options[0].split(":")[1]);
 if(selected===null)return;
 const value=selected.trim();
 if(!options.slice(1).includes(value)){alert("Option non reconnue. Veuillez choisir exactement une option proposée.");return}
 const old=cart.find(x=>x.name===btn.dataset.name&&x.option===label+": "+value);
 if(old)old.qty=Math.min(20,old.qty+1);else cart.push({name:btn.dataset.name,price:+btn.dataset.price,qty:1,option:label+": "+value});
 renderCart();openCart();
}));
$("#checkout").addEventListener("click",()=>{
 if(!cart.length)return;
 const lines=cart.map(x=>"- "+x.name+" ("+x.option+") x"+x.qty+" : "+format(x.price*x.qty)).join("\n");
 const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
 const msg="Bonjour Lerak Ytroh, je souhaite commander :\n"+lines+"\nSous-total : "+format(total)+"\nLivraison : à confirmer selon ma zone. Merci de confirmer la disponibilité et les modalités.";
 window.open("https://wa.me/24176314177?text="+encodeURIComponent(msg),"_blank");
});
$("#contactForm").addEventListener("submit",e=>{
 e.preventDefault();if(!e.currentTarget.reportValidity())return;
 const msg="Bonjour Lerak Ytroh.\nNom : "+$("#clientName").value+"\nContact : "+$("#clientContact").value+"\nDemande : "+$("#clientMessage").value;
 window.open("https://wa.me/24176314177?text="+encodeURIComponent(msg),"_blank");
});
$("#year").textContent=new Date().getFullYear();
