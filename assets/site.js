/* ============================================================
   AHANKARAKA — site.js
   Global components (injected) + behaviour + page renderers.
   Pure static; works from file:// and http.
   ============================================================ */
(function () {
  "use strict";
  var S = window.STORE || {};
  var P = S.products || [];
  var CARD = "assets/img/card/", WEB = "assets/img/web/";

  // ---------- utils ----------
  function inr(n){ return "₹" + Number(n).toLocaleString("en-IN"); }
  function $(s,r){ return (r||document).querySelector(s); }
  function $all(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
  function byId(sku){ return P.find(function(p){return p.sku===sku;}); }
  function param(k){ return new URLSearchParams(location.search).get(k); }
  function colMeta(id){ return (S.collections||[]).find(function(c){return c.id===id;}); }
  function catLabel(id){ var c=(S.cats||[]).find(function(x){return x.id===id;}); return c?c.label:id; }
  var rel = ""; // relative prefix (root)

  var SVG = {
    search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>',
    heart:'<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    bag:'<svg viewBox="0 0 24 24"><path d="M6 8h12l1 13H5z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>',
    menu:'<svg viewBox="0 0 24 24"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>',
    check:'<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
    ship:'<svg viewBox="0 0 24 24"><rect x="1" y="5" width="14" height="12"/><path d="M15 9h4l3 3v5h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    shield:'<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    gift:'<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="13"/><path d="M3 12h18M12 8v13"/><path d="M12 8S9 3 7 5s3 3 5 3 7 1 5-3-5 3-5 3z"/></svg>',
    leaf:'<svg viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 4 13c0-6 8-9 16-9 0 8-3 16-9 16z"/></svg>'
  };

  // ============================================================
  //  COMPONENT INJECTION
  // ============================================================
  function headerHTML(){
    var cols = (S.collections||[]).map(function(c){
      return '<li><a href="collection.html?collection='+c.id+'">'+c.name+'</a></li>';
    }).join("");
    var types = (S.cats||[]).map(function(c){
      return '<li><a class="sm" href="collection.html?cat='+c.id+'">'+c.label+'</a></li>';
    }).join("");
    return ''+
    '<div class="announce"><span id="annText">Complimentary insured shipping &amp; signature gift wrapping · Every piece crafted to order</span></div>'+
    '<header class="header" id="hdr"><div class="container">'+
      '<div class="htop">'+
        '<div class="left">'+
          '<button class="icon-btn burger m-only" id="burger" aria-label="Menu">'+SVG.menu+'</button>'+
          '<span class="region m-only-hide">India · INR ₹</span>'+
        '</div>'+
        '<a class="logo" href="index.html" aria-label="AHANKARAKA"><img src="assets/logo/horizontal.svg" alt="AHANKARAKA" style="height:38px;display:block"></a>'+
        '<div class="right">'+
          '<button class="icon-btn" id="searchOpen" aria-label="Search">'+SVG.search+'</button>'+
          '<a class="icon-btn m-only-hide" href="wishlist.html" aria-label="Wishlist">'+SVG.heart+'<span class="badge-count" data-wishcount>0</span></a>'+
          '<a class="icon-btn m-only-hide" href="#" aria-label="Account">'+SVG.user+'</a>'+
          '<button class="icon-btn" id="cartOpen" aria-label="Cart">'+SVG.bag+'<span class="badge-count" data-cartcount>0</span></button>'+
        '</div>'+
      '</div>'+
      '<nav class="hnav">'+
        '<div class="has-mega"><a href="collections.html">Collections <span style="font-size:8px">▾</span></a>'+
          '<div class="mega"><div class="mega-in">'+
            '<div><h5>Browse by Collection</h5><ul>'+cols+'<li><a class="sm" href="collections.html">View all collections →</a></li></ul></div>'+
            '<div><h5>Browse by Type</h5><ul>'+types+'</ul></div>'+
            '<div><h5>By Occasion</h5><ul>'+
              '<li><a class="sm" href="collection.html?occ=Bridal">Bridal</a></li>'+
              '<li><a class="sm" href="collection.html?occ=Festive">Festive</a></li>'+
              '<li><a class="sm" href="collection.html?occ=Gifting">Gifting</a></li>'+
              '<li><a class="sm" href="collection.html?occ=Daily">Everyday</a></li>'+
              '<li><a class="sm" href="collection.html?collection=signature">New &amp; Signature</a></li>'+
            '</ul></div>'+
            '<a class="mega-tile" href="collection.html?collection=bridal"><img src="'+WEB+'img_06.jpg" alt=""><span class="cap"><span>Featured</span><b>The Bridal Maharani</b></span></a>'+
          '</div></div>'+
        '</div>'+
        '<div class="has-mega"><a href="world.html">The World <span style="font-size:8px">▾</span></a>'+
          '<div class="mega"><div class="mega-in">'+
            '<div><h5>The World of AHANKARAKA</h5><ul>'+
              '<li><a href="world.html#about">About AHANKARAKA</a></li>'+
              '<li><a href="world.html#philosophy">Brand Philosophy</a></li>'+
              '<li><a href="world.html#craft">Craftsmanship</a></li></ul></div>'+
            '<div><h5>&nbsp;</h5><ul>'+
              '<li><a href="world.html#materials">Materials &amp; Quality</a></li>'+
              '<li><a href="world.html#sustainability">Sustainability</a></li>'+
              '<li><a href="world.html#founder">Founder Story</a></li></ul></div>'+
            '<div></div>'+
            '<a class="mega-tile" href="world.html#founder"><img src="'+WEB+'img_08.jpg" alt=""><span class="cap"><span>Read</span><b>Our Philosophy</b></span></a>'+
          '</div></div>'+
        '</div>'+
        '<a href="journal.html">Journal</a>'+
        '<a href="contact.html">Consultation</a>'+
        '<a href="support.html">Help</a>'+
      '</nav>'+
    '</div></header>';
  }

  function footerHTML(){
    return ''+
    '<footer class="footer">'+
      '<div class="nl"><div class="container">'+
        '<h3>Join the world of AHANKARAKA</h3>'+
        '<form id="nlFoot"><input type="email" placeholder="Your email — for first looks &amp; stories" required><button>Subscribe</button></form>'+
      '</div></div>'+
      '<div class="container"><div class="cols">'+
        '<div class="fbrand"><a class="logo" href="index.html" aria-label="AHANKARAKA"><img src="assets/logo/horizontal-white.svg" alt="AHANKARAKA" style="height:46px;display:block"></a>'+
          '<p>Hand-finished temple, kemp &amp; antique-gold jewellery — adornment as a quiet declaration of self.</p>'+
          '<div class="socials">'+
            '<a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6"/></svg></a>'+
            '<a href="#" aria-label="Pinterest"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9 19c-1-3 1-7 1-7"/></svg></a>'+
            '<a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="4"/><polygon points="10 9 16 12 10 15"/></svg></a>'+
            '<a href="#" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 21l2-5.5A8.5 8.5 0 1 1 21 11.5z"/></svg></a>'+
          '</div>'+
        '</div>'+
        '<div><h4>Discover</h4><ul>'+
          '<li><a href="collections.html">Collections</a></li>'+
          '<li><a href="collection.html?collection=signature">The Signature</a></li>'+
          '<li><a href="collection.html?collection=bridal">Bridal</a></li>'+
          '<li><a href="journal.html">Journal</a></li></ul></div>'+
        '<div><h4>The World</h4><ul>'+
          '<li><a href="world.html#about">About</a></li>'+
          '<li><a href="world.html#philosophy">Philosophy</a></li>'+
          '<li><a href="world.html#craft">Craftsmanship</a></li>'+
          '<li><a href="world.html#materials">Materials</a></li>'+
          '<li><a href="world.html#sustainability">Sustainability</a></li></ul></div>'+
        '<div><h4>Support</h4><ul>'+
          '<li><a href="support.html#faq">FAQ</a></li>'+
          '<li><a href="contact.html">Contact &amp; Consultation</a></li>'+
          '<li><a href="support.html#size">Size Guide</a></li>'+
          '<li><a href="support.html#care">Care Guide</a></li>'+
          '<li><a href="support.html#shipping">Shipping &amp; Returns</a></li></ul></div>'+
        '<div><h4>Contact</h4><ul>'+
          '<li><a href="https://wa.me/919000000000">WhatsApp</a></li>'+
          '<li><a href="mailto:hello@ahankaraka.in">hello@ahankaraka.in</a></li>'+
          '<li><a href="tel:+919000000000">+91 90000 00000</a></li>'+
          '<li>The Studio, Chennai</li>'+
          '<li>Mon–Sat · 10–8 IST</li></ul></div>'+
      '</div></div>'+
      '<div class="bottom"><div class="container">'+
        '<span>© <span id="yr">2026</span> AHANKARAKA. Crafted in India.</span>'+
        '<span><a href="legal.html">Privacy</a><a href="legal.html">Terms</a><a href="legal.html">Cookies</a></span>'+
      '</div></div>'+
    '</footer>';
  }

  function overlaysHTML(){
    return ''+
    // search overlay
    '<div class="search-ov" id="searchOv"><div class="dim" data-search-close></div>'+
      '<div class="panel"><div class="panel-in">'+
        '<div class="search-bar">'+SVG.search+'<input id="searchInput" placeholder="Search pieces, collections, stories…" autocomplete="off"><button class="x" data-search-close>Close</button></div>'+
        '<div class="search-res" id="searchRes"></div>'+
      '</div></div>'+
    '</div>'+
    // scrim + cart drawer
    '<div class="scrim" id="scrim"></div>'+
    '<aside class="drawer" id="cartDrawer">'+
      '<div class="drawer-head"><h3>Your Cart</h3><button class="x" id="cartClose">&times;</button></div>'+
      '<div class="drawer-body" id="cartBody"></div>'+
      '<div class="drawer-foot" id="cartFoot">'+
        '<div class="row tot"><span>Subtotal</span><b id="cartTotal">₹0</b></div>'+
        '<div class="ship">Shipping &amp; gift wrapping calculated at checkout.</div>'+
        '<button class="btn btn-fill" id="checkoutBtn">Proceed to Checkout</button>'+
        '<small>Secure · Authenticity assured · Easy returns</small>'+
      '</div>'+
    '</aside>'+
    // quick view modal
    '<div class="modal" id="modal"><div class="mscrim" data-modal-close></div><div class="box" id="modalBox"></div></div>'+
    // mobile menu
    '<div class="mmenu" id="mmenu">'+
      '<div class="mm-head"><img src="assets/logo/horizontal.svg" alt="AHANKARAKA" style="height:28px"><button class="x" id="mmClose">&times;</button></div>'+
      '<div class="mm-body">'+
        '<details><summary>Collections</summary><div class="sub">'+
          (S.collections||[]).map(function(c){return '<a href="collection.html?collection='+c.id+'">'+c.name+'</a>';}).join("")+
          '<a href="collections.html">View all →</a></div></details>'+
        '<details><summary>The World</summary><div class="sub">'+
          '<a href="world.html#about">About</a><a href="world.html#philosophy">Philosophy</a><a href="world.html#craft">Craftsmanship</a><a href="world.html#materials">Materials</a><a href="world.html#founder">Founder Story</a></div></details>'+
        '<a href="journal.html">Journal</a>'+
        '<a href="contact.html">Consultation</a>'+
        '<a href="support.html">Help</a>'+
        '<a href="wishlist.html">Wishlist</a>'+
      '</div>'+
    '</div>'+
    '<div class="toast" id="toast"></div>';
  }

  // ============================================================
  //  PRODUCT CARD
  // ============================================================
  function card(p){
    var onw = wish().indexOf(p.sku) > -1 ? " on" : "";
    var tag = p.avail === "Made to Order" ? '<span class="tag">Made to Order</span>' : '';
    var cm = colMeta(p.col);
    return '<article class="pcard" data-sku="'+p.sku+'">'+
      '<div class="media">'+tag+
        '<a href="product.html?sku='+p.sku+'"><img loading="lazy" src="'+CARD+p.img+'.jpg" alt="'+p.name.replace(/"/g,'')+'"></a>'+
        '<button class="wish'+onw+'" data-wish="'+p.sku+'" aria-label="Save">'+SVG.heart+'</button>'+
        '<button class="quick" data-quick="'+p.sku+'">Quick View</button>'+
      '</div>'+
      '<a href="product.html?sku='+p.sku+'" class="body">'+
        '<span class="col">'+(cm?cm.name:p.sub)+'</span>'+
        '<span class="title">'+p.name+'</span>'+
        '<span class="price">'+inr(p.price)+'</span>'+
      '</a>'+
    '</article>';
  }
  function renderCards(list, c){ c.innerHTML = list.map(card).join(""); }

  // ============================================================
  //  CART
  // ============================================================
  var CK="ahx_cart", WK="ahx_wish";
  function cart(){ try{return JSON.parse(localStorage.getItem(CK))||{};}catch(e){return {};} }
  function saveCart(c){ localStorage.setItem(CK,JSON.stringify(c)); paint(); }
  function addCart(sku,n){ var c=cart(); c[sku]=(c[sku]||0)+(n||1); saveCart(c); var p=byId(sku); toast((p?p.sub:"Piece")+" added to your cart"); openCart(); }
  function cartN(){ var c=cart(),t=0; for(var k in c)t+=c[k]; return t; }
  function cartSum(){ var c=cart(),t=0; for(var k in c){var p=byId(k); if(p)t+=p.price*c[k];} return t; }
  // wishlist
  function wish(){ try{return JSON.parse(localStorage.getItem(WK))||[];}catch(e){return [];} }
  function toggleWish(sku){ var w=wish(),i=w.indexOf(sku); if(i>-1){w.splice(i,1);toast("Removed from wishlist");}else{w.push(sku);toast("Saved to your wishlist");} localStorage.setItem(WK,JSON.stringify(w)); paint();
    $all('[data-wish="'+sku+'"]').forEach(function(b){b.classList.toggle("on",wish().indexOf(sku)>-1);});
    var pw=$('.pdp-buy .wishbtn'); if(pw&&pw.dataset.sku===sku)pw.classList.toggle("on",wish().indexOf(sku)>-1);
    if($("#wishGrid")) renderWishlist();
  }

  function paint(){
    $all("[data-cartcount]").forEach(function(b){var n=cartN(); b.textContent=n; b.style.display=n?"grid":"none";});
    $all("[data-wishcount]").forEach(function(b){var n=wish().length; b.textContent=n; b.style.display=n?"grid":"none";});
    var body=$("#cartBody"); if(!body)return;
    var c=cart(), keys=Object.keys(c);
    if(!keys.length){
      body.innerHTML='<div class="cart-empty"><svg viewBox="0 0 24 24"><path d="M6 8h12l1 13H5z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg><p>Your cart is empty.</p><a class="btn btn-ghost" href="collections.html" style="margin-top:16px">Discover Collections</a></div>';
      $("#cartFoot").style.display="none"; return;
    }
    $("#cartFoot").style.display="block";
    body.innerHTML=keys.map(function(k){var p=byId(k); if(!p)return ""; var cm=colMeta(p.col);
      return '<div class="citem"><img src="'+CARD+p.img+'.jpg" alt="">'+
        '<div class="cb"><span class="col">'+(cm?cm.name:p.sub)+'</span><b>'+p.name+'</b>'+
        '<div class="qty"><button data-dec="'+k+'">−</button><span>'+c[k]+'</span><button data-inc="'+k+'">+</button></div></div>'+
        '<div style="text-align:right;display:flex;flex-direction:column;justify-content:space-between"><span class="pr">'+inr(p.price*c[k])+'</span><button class="rm" data-rm="'+k+'">Remove</button></div></div>';
    }).join("");
    $("#cartTotal").textContent=inr(cartSum());
  }
  function openCart(){ $("#cartDrawer").classList.add("open"); $("#scrim").classList.add("open"); }
  function closeCart(){ $("#cartDrawer").classList.remove("open"); $("#scrim").classList.remove("open"); }

  // ---------- toast ----------
  var tt;
  function toast(m){ var t=$("#toast"); if(!t)return; t.innerHTML=SVG.check+"<span>"+m+"</span>"; t.classList.add("show"); clearTimeout(tt); tt=setTimeout(function(){t.classList.remove("show");},2600); }

  // ============================================================
  //  QUICK VIEW
  // ============================================================
  function quick(sku){ var p=byId(sku); if(!p)return; var cm=colMeta(p.col);
    var mto = p.avail==="Made to Order";
    $("#modalBox").innerHTML='<button class="mclose" data-modal-close>&times;</button>'+
      '<div class="mimg"><img src="'+WEB+p.img+'.jpg" alt=""></div>'+
      '<div class="minfo"><span class="col">'+(cm?cm.name:p.sub)+'</span><h3>'+p.name+'</h3>'+
        '<div class="price">'+inr(p.price)+'</div>'+
        '<p>A hand-finished '+p.sub.toLowerCase()+' in antique-gold, set with '+p.mat.toLowerCase()+' by our master artisans — made to be worn, and remembered.</p>'+
        '<div class="meta"><div><span>Reference</span><b>'+p.sku+'</b></div>'+
          '<div><span>Material</span><b>'+p.mat+'</b></div>'+
          '<div><span>Occasion</span><b>'+p.occ+'</b></div>'+
          '<div><span>Availability</span><b>'+p.avail+'</b></div></div>'+
        '<button class="btn btn-fill" data-add="'+p.sku+'" style="justify-content:center">Add to Cart — '+inr(p.price)+'</button>'+
        '<a class="link-arrow" href="product.html?sku='+p.sku+'" style="align-self:center;margin-top:6px">View full details →</a>'+
      '</div>';
    $("#modal").classList.add("open");
  }
  function closeModal(){ var m=$("#modal"); if(m)m.classList.remove("open"); }

  // ============================================================
  //  SEARCH (predictive)
  // ============================================================
  function openSearch(){ $("#searchOv").classList.add("open"); setTimeout(function(){$("#searchInput").focus();},120); searchRender(""); }
  function closeSearch(){ $("#searchOv").classList.remove("open"); }
  function searchRender(q){
    q=(q||"").toLowerCase().trim();
    var res=$("#searchRes");
    var prods, cols, sugg;
    if(q.length<2){
      sugg=["Temple haaram","Kemp choker","Peacock jhumka","Bridal set","Maang tikka"];
      cols=(S.collections||[]).slice(0,4);
      prods=P.filter(function(p){return p.col==="signature";}).slice(0,4);
      res.innerHTML=
        '<div><h6>Popular</h6><div class="sug">'+sugg.map(function(s){return '<a href="#" data-sq="'+s+'">'+s+'</a>';}).join("")+'</div></div>'+
        '<div><h6>Collections</h6><div class="sug">'+cols.map(function(c){return '<a href="collection.html?collection='+c.id+'">'+c.name+'</a>';}).join("")+'</div></div>'+
        '<div><h6>Signature Pieces</h6><div class="sres-prod">'+prods.map(prodRow).join("")+'</div></div>';
      return;
    }
    prods=P.filter(function(p){return (p.name+" "+p.sub+" "+p.sku+" "+p.mat).toLowerCase().indexOf(q)>-1;});
    cols=(S.collections||[]).filter(function(c){return (c.name+" "+c.tagline).toLowerCase().indexOf(q)>-1;});
    var typeMatch=(S.cats||[]).filter(function(c){return c.label.toLowerCase().indexOf(q)>-1;});
    res.innerHTML=
      '<div><h6>Suggestions</h6><div class="sug">'+
        (cols.concat(typeMatch).slice(0,5).map(function(c){var href=c.label?'collection.html?cat='+c.id:'collection.html?collection='+c.id; return '<a href="'+href+'">'+(c.name||c.label)+'</a>';}).join("")||'<span style="color:var(--muted);font-size:13px">No collections</span>')+
      '</div></div>'+
      '<div><h6>'+cols.length+' Collection'+(cols.length===1?"":"s")+'</h6><div class="sug">'+
        (cols.map(function(c){return '<a href="collection.html?collection='+c.id+'">'+c.name+'</a>';}).join("")||'<span style="color:var(--muted);font-size:13px">—</span>')+
      '</div></div>'+
      '<div><h6>'+prods.length+' Product'+(prods.length===1?"":"s")+'</h6><div class="sres-prod">'+
        (prods.slice(0,5).map(prodRow).join("")||'<span style="color:var(--muted);font-size:13px">No pieces match — try “jhumka”, “kemp” or “haaram”.</span>')+
        (prods.length>5?'<a class="link-arrow" href="collection.html?cat=all&q='+encodeURIComponent(q)+'" style="margin-top:6px">View all '+prods.length+' results →</a>':'')+
      '</div></div>';
  }
  function prodRow(p){ return '<a href="product.html?sku='+p.sku+'"><img src="'+CARD+p.img+'.jpg" alt=""><span><b>'+p.name+'</b><br><span>'+inr(p.price)+'</span></span></a>'; }

  // ============================================================
  //  HERO / CAROUSEL / REVEAL
  // ============================================================
  function initHero(){ var sl=$all(".hero-slide"); if(sl.length<2)return; var dots=$all(".hero-dots button"); var i=0,timer;
    function go(n){ sl[i].classList.remove("active"); if(dots[i])dots[i].classList.remove("active"); i=(n+sl.length)%sl.length; sl[i].classList.add("active"); if(dots[i])dots[i].classList.add("active"); }
    dots.forEach(function(d,x){d.addEventListener("click",function(){go(x);reset();});});
    function reset(){clearInterval(timer);timer=setInterval(function(){go(i+1);},5600);} reset();
  }
  function initCarousel(){ $all(".carousel").forEach(function(c){ var t=$(".carousel-track",c),pv=$(".prev",c),nx=$(".next",c);
    function step(){return Math.min(t.clientWidth*.8,640);}
    if(pv)pv.addEventListener("click",function(){t.scrollBy({left:-step(),behavior:"smooth"});});
    if(nx)nx.addEventListener("click",function(){t.scrollBy({left:step(),behavior:"smooth"});});
  }); }
  function initReveal(){ if(!("IntersectionObserver" in window)){$all(".reveal").forEach(function(n){n.classList.add("in");});return;}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:.1});
    $all(".reveal").forEach(function(n){io.observe(n);});
  }
  function initSlimHeader(){ var h=$("#hdr"); if(!h)return; window.addEventListener("scroll",function(){h.classList.toggle("slim",window.scrollY>120);}); }

  // ============================================================
  //  PAGE: HOME
  // ============================================================
  function initHome(){
    var f=$("#railSignature"); if(f) renderCards(P.filter(function(p){return p.col==="signature";}).slice(0,10), f);
    var a=$("#railArrivals"); if(a){ var seen={},pick=[]; P.forEach(function(p){ if((seen[p.cat]||0)<2){pick.push(p);seen[p.cat]=(seen[p.cat]||0)+1;} }); renderCards(pick.slice(0,10),a); }
    var fc=$("#homeCollections"); if(fc){ renderColTiles((S.collections||[]).slice(0,3), fc); }
  }
  function renderColTiles(cols,c){ c.innerHTML=cols.map(function(m){
    return '<a class="col-tile" href="collection.html?collection='+m.id+'"><img src="'+WEB+m.hero+'.jpg" alt=""><span class="cap"><span>'+m.count+' pieces</span><h3>'+m.name+'</h3><p>'+m.tagline+'</p><span class="go">Explore →</span></span></a>';
  }).join(""); }

  // ============================================================
  //  PAGE: COLLECTIONS LANDING
  // ============================================================
  function initCollectionsLanding(){ var g=$("#allCollections"); if(!g)return; renderColTiles(S.collections||[], g);
    var fr=$("#crossRail"); if(fr) renderCards(P.filter(function(p){return p.col==="signature";}).slice(0,8), fr);
  }

  // ============================================================
  //  PAGE: COLLECTION DETAIL / SHOP
  // ============================================================
  function initCollection(){ var grid=$("#shopGrid"); if(!grid)return;
    var colId=param("collection"), cat=param("cat"), occ=param("occ"), q0=param("q")||"";
    var st={sort:"featured",price:"all",mat:"all",avail:"all",q:q0,page:1,per:24};
    // hero/story
    var cm=colId?colMeta(colId):null;
    var heroTitle, heroSub, heroImg, intro;
    if(cm){ heroTitle=cm.name; heroSub=cm.tagline; heroImg=cm.hero; intro=cm.story; }
    else if(cat&&cat!=="all"){ heroTitle=catLabel(cat); heroSub="The "+catLabel(cat)+" edit"; heroImg=(S.land[0]||"img_03"); intro="Every piece in our "+catLabel(cat).toLowerCase()+" is hand-finished and made to be lived in — chosen, not just bought."; }
    else if(occ){ heroTitle=occ==="Daily"?"Everyday":occ; heroSub="Adornment for the occasion"; heroImg=(S.land[1]||"img_22"); intro="Pieces chosen for "+occ.toLowerCase()+" moments — considered, comfortable and quietly resolved."; }
    else { heroTitle="All Jewellery"; heroSub="The complete house of AHANKARAKA"; heroImg=(S.land[0]||"img_03"); intro="Five hundred and seventy-five hand-finished pieces — temple, kemp and antique-gold adornment, each made to order with intention."; }
    var hero=$("#colHero"); if(hero){ hero.innerHTML='<img src="'+WEB+heroImg+'.jpg" alt=""><div class="ch"><span class="eyebrow">'+(cm?"Collection":"Browse")+'</span><h1>'+heroTitle+'</h1><p>'+heroSub+'</p></div>'; }
    var ci=$("#colIntro"); if(ci) ci.innerHTML='<p>'+intro+'</p>';
    var bc=$("#colCrumb"); if(bc) bc.innerHTML='<a href="index.html">Home</a><span>/</span><a href="collections.html">Collections</a><span>/</span><b>'+heroTitle+'</b>';

    function base(){ var list=P.slice();
      if(colId) list=list.filter(function(p){return p.col===colId;});
      if(cat&&cat!=="all") list=list.filter(function(p){return p.cat===cat;});
      if(occ) list=list.filter(function(p){return p.occ===occ;});
      return list;
    }
    function build(){
      var list=base();
      if(st.q){var q=st.q.toLowerCase(); list=list.filter(function(p){return (p.name+" "+p.sub+" "+p.sku+" "+p.mat).toLowerCase().indexOf(q)>-1;});}
      if(st.mat!=="all") list=list.filter(function(p){return p.mat===st.mat;});
      if(st.avail!=="all") list=list.filter(function(p){return p.avail===st.avail;});
      if(st.price!=="all"){var r=st.price.split("-"); list=list.filter(function(p){return p.price>=+r[0]&&(r[1]===""||p.price<=+r[1]);});}
      if(st.sort==="low")list.sort(function(a,b){return a.price-b.price;});
      else if(st.sort==="high")list.sort(function(a,b){return b.price-a.price;});
      else if(st.sort==="name")list.sort(function(a,b){return a.name.localeCompare(b.name);});
      return list;
    }
    function render(){
      var list=build(), show=list.slice(0,st.page*st.per);
      if(!list.length) grid.innerHTML='<div class="no-results"><h3>Nothing here yet</h3><p>Try removing a filter or exploring another collection.</p></div>';
      else renderCards(show,grid);
      $("#shopCount").textContent=list.length+" piece"+(list.length===1?"":"s");
      $("#loadMore").style.display=show.length<list.length?"inline-flex":"none";
    }
    // facets
    var matOpts=(S.materials||[]).map(function(m){var n=base().filter(function(p){return p.mat===m;}).length; return n?'<label><input type="radio" name="mat" value="'+m+'"> '+m+' <span class="c">'+n+'</span></label>':"";}).join("");
    var facets=$("#facetBox");
    if(facets){ facets.innerHTML=
      '<div class="fblock"><h4>Refine</h4><label><input type="radio" name="mat" value="all" checked> All Materials</label>'+matOpts+'</div>'+
      '<div class="fblock"><h4>Price</h4>'+
        ['all|All Prices','0-2000|Under ₹2,000','2000-4000|₹2,000 – ₹4,000','4000-8000|₹4,000 – ₹8,000','8000-|₹8,000 & Above']
          .map(function(o){var v=o.split("|");return '<label><input type="radio" name="price" value="'+v[0]+'"'+(v[0]==="all"?" checked":"")+'> '+v[1]+'</label>';}).join("")+
      '</div>'+
      '<div class="fblock"><h4>Availability</h4>'+
        ['all|All','In Stock|In Stock','Made to Order|Made to Order'].map(function(o){var v=o.split("|");return '<label><input type="radio" name="avail" value="'+v[0]+'"'+(v[0]==="all"?" checked":"")+'> '+v[1]+'</label>';}).join("")+
      '</div>'+
      '<a class="clear" id="clearF">Clear all</a>';
      facets.addEventListener("change",function(e){var n=e.target.name; if(n==="mat")st.mat=e.target.value; if(n==="price")st.price=e.target.value; if(n==="avail")st.avail=e.target.value; st.page=1; render();});
      facets.addEventListener("click",function(e){ if(e.target.id==="clearF"){st.mat="all";st.price="all";st.avail="all";st.q="";$("#shopSearch").value=""; $all('input[name=mat][value=all],input[name=price][value=all],input[name=avail][value=all]').forEach(function(r){r.checked=true;}); st.page=1; render(); }});
    }
    $("#sortSel").addEventListener("change",function(e){st.sort=e.target.value;st.page=1;render();});
    var ss=$("#shopSearch"); if(ss){ss.value=q0; var t; ss.addEventListener("input",function(e){clearTimeout(t);t=setTimeout(function(){st.q=e.target.value.trim();st.page=1;render();},200);});}
    $("#loadMore").addEventListener("click",function(){st.page++;render();});
    render();
  }

  // ============================================================
  //  PAGE: PRODUCT (PDP)
  // ============================================================
  function initProduct(){ var host=$("#pdp"); if(!host)return;
    var p=byId(param("sku"))||P[0]; var cm=colMeta(p.col);
    document.title=p.name+" — AHANKARAKA";
    // gallery images: assigned + a few others for variety
    var idx=(S.all||[]).indexOf(p.img); var gal=[p.img];
    for(var k=1;k<4;k++){ gal.push((S.all||[])[(idx+k*7)%(S.all||[]).length]); }
    var onw=wish().indexOf(p.sku)>-1?" on":"";
    var mto=p.avail==="Made to Order";
    $("#pdpCrumb").innerHTML='<a href="index.html">Home</a><span>/</span><a href="collection.html?collection='+p.col+'">'+(cm?cm.name:"Collection")+'</a><span>/</span><b>'+p.name+'</b>';
    host.innerHTML=
      '<div class="pdp-gallery">'+
        '<div class="pdp-thumbs">'+gal.map(function(g,i){return '<img class="'+(i===0?"active":"")+'" data-g="'+g+'" src="'+CARD+g+'.jpg" alt="">';}).join("")+'</div>'+
        '<div class="pdp-main"><img id="pdpMain" src="'+WEB+p.img+'.jpg" alt="'+p.name.replace(/"/g,'')+'"></div>'+
      '</div>'+
      '<div class="pdp-info">'+
        '<span class="col">'+(cm?cm.name:p.sub)+'</span>'+
        '<h1>'+p.name+'</h1>'+
        '<div class="price">'+inr(p.price)+'</div>'+
        '<p class="story">A hand-finished '+p.sub.toLowerCase()+' rendered in warm antique-gold and set with '+p.mat.toLowerCase()+'. Designed in our Chennai studio in the temple tradition, and made to be worn at the centre of your most meaningful days.</p>'+
        '<div class="avail'+(mto?" mto":"")+'"><span class="dot"></span>'+p.avail+(mto?' · ships in 2–3 weeks':' · ready to ship')+'</div>'+
        '<div class="pdp-buy"><button class="btn btn-fill" data-add="'+p.sku+'">Add to Cart</button>'+
          '<button class="wishbtn'+onw+'" data-wish="'+p.sku+'" aria-label="Save">'+SVG.heart+'</button></div>'+
        '<div class="trustline">'+
          '<span>'+SVG.shield+'Authenticity assured</span><span>'+SVG.ship+'Free insured shipping</span><span>'+SVG.gift+'Signature gift wrap</span>'+
        '</div>'+
        '<details class="acc" open><summary>Product Details</summary><div class="ac-body">Reference '+p.sku+'. A '+p.sub.toLowerCase()+' from the '+(cm?cm.name:"")+' collection, hand-finished in antique-gold polish over a skin-friendly alloy. Lightweight and secure for all-day wear.</div></details>'+
        '<details class="acc"><summary>Specifications</summary><div class="ac-body"><ul><li>Collection: '+(cm?cm.name:"—")+'</li><li>Type: '+p.sub+'</li><li>Occasion: '+p.occ+'</li><li>Finish: 22K-look antique gold polish</li><li>Closure / wear: secure, comfort-fit</li></ul></div></details>'+
        '<details class="acc"><summary>Material Information</summary><div class="ac-body">'+p.mat+', individually hand-set. Nickel-conscious base alloy. See our <a href="world.html#materials" style="border-bottom:1px solid var(--gold)">Materials &amp; Quality</a> guide.</div></details>'+
        '<details class="acc"><summary>Care &amp; Warranty</summary><div class="ac-body">Store in the pouch provided, away from moisture and perfume. Backed by our 1-year polish warranty. Read the full <a href="support.html#care" style="border-bottom:1px solid var(--gold)">Care Guide</a>.</div></details>'+
      '</div>';
    // related
    var rel=P.filter(function(x){return x.col===p.col&&x.sku!==p.sku;}).slice(0,4);
    if(rel.length<4) rel=rel.concat(P.filter(function(x){return x.cat===p.cat&&x.sku!==p.sku&&rel.indexOf(x)<0;})).slice(0,4);
    var rg=$("#relatedGrid"); if(rg) renderCards(rel,rg);
    // sticky bar fill
    var sb=$("#stickyBuy"); if(sb){ sb.querySelector(".sb-l").innerHTML='<img src="'+CARD+p.img+'.jpg" alt=""><div><b>'+p.name+'</b><div class="sp">'+inr(p.price)+'</div></div>';
      sb.querySelector("[data-add]").setAttribute("data-add",p.sku);
      window.addEventListener("scroll",function(){ var info=$(".pdp-buy"); if(!info)return; var r=info.getBoundingClientRect(); sb.classList.toggle("show", r.bottom<0); }); }
    // thumb switch
    host.addEventListener("click",function(e){ var t=e.target.closest("[data-g]"); if(t){ $("#pdpMain").src=WEB+t.dataset.g+".jpg"; $all(".pdp-thumbs img").forEach(function(i){i.classList.toggle("active",i===t);}); }});
  }

  // ============================================================
  //  PAGE: WISHLIST
  // ============================================================
  function renderWishlist(){ var g=$("#wishGrid"); if(!g)return; var w=wish(); var list=w.map(byId).filter(Boolean);
    $("#wishCount")&&($("#wishCount").textContent=list.length+" item"+(list.length===1?"":"s"));
    if(!list.length){ g.innerHTML='<div class="no-results"><h3>Nothing saved yet</h3><p>Tap the ♡ on any piece to keep it here.</p><a class="btn btn-ghost" href="collections.html" style="margin-top:18px">Discover Collections</a></div>'; if($("#wishYml"))$("#wishYml").style.display="none"; return; }
    renderCards(list,g);
    var y=$("#wishRail"); if(y) renderCards(P.filter(function(p){return p.col==="signature"&&w.indexOf(p.sku)<0;}).slice(0,8),y);
  }

  // ============================================================
  //  PAGE: CHECKOUT
  // ============================================================
  function initCheckout(){ var sum=$("#coSummary"); if(!sum)return;
    var c=cart(), keys=Object.keys(c);
    if(!keys.length){ location.replace("collections.html"); return; }
    var items=keys.map(function(k){ var p=byId(k); if(!p)return ""; var cm=colMeta(p.col);
      return '<div class="sum-item"><img src="'+CARD+p.img+'.jpg" alt=""><div class="si-b"><b>'+p.name+'</b><span>'+(cm?cm.name:p.sub)+' · Qty '+c[k]+'</span></div><div class="si-p">'+inr(p.price*c[k])+'</div></div>';
    }).join("");
    var total=cartSum();
    sum.innerHTML='<h3>Order Summary</h3>'+items+
      '<div class="sum-row"><span>Subtotal</span><span>'+inr(total)+'</span></div>'+
      '<div class="sum-row"><span>Shipping</span><span>Complimentary</span></div>'+
      '<div class="sum-row"><span>Gift wrapping</span><span>Included</span></div>'+
      '<div class="sum-row tot"><span>Total</span><b>'+inr(total)+'</b></div>'+
      '<div class="co-trust"><span>'+SVG.shield+'100% secure, encrypted payment</span><span>'+SVG.ship+'Free insured shipping across India</span><span>'+SVG.check+'Easy 7-day returns</span></div>';
    $all(".pay-method").forEach(function(m){ m.addEventListener("click",function(){
      $all(".pay-method").forEach(function(x){x.classList.remove("active");});
      m.classList.add("active"); var r=m.querySelector('input[type=radio]'); if(r)r.checked=true;
    }); });
  }
  function placeOrder(){
    var sel=$(".pay-method.active .pm-head b"); var method=sel?sel.textContent.trim():"your selected method";
    var ono="AHK"+Math.floor(100000+Math.random()*900000);
    localStorage.removeItem(CK); paint();
    var main=$("#coMain");
    if(main){ main.innerHTML='<div class="co-confirm"><div class="tick">'+SVG.check+'</div>'+
      '<span class="eyebrow">Thank You</span><h1>Your order is confirmed</h1>'+
      '<div class="ordno">Order '+ono+'</div>'+
      '<p style="color:var(--ink-2)">A confirmation has been sent to your email. Your pieces will be hand-crafted and dispatched with insured shipping — made-to-order items in 2–3 weeks, in-stock pieces within 2–4 days. Payment via '+method+'.</p>'+
      '<div class="mt"><a class="btn btn-fill" href="collections.html">Continue Shopping</a> &nbsp; <a class="btn btn-ghost" href="index.html">Back to Home</a></div></div>';
      window.scrollTo({top:0,behavior:"smooth"}); document.title="Order Confirmed — AHANKARAKA"; }
  }

  // ============================================================
  //  GLOBAL EVENTS
  // ============================================================
  document.addEventListener("click",function(e){
    var add=e.target.closest("[data-add]"); if(add){addCart(add.getAttribute("data-add"));return;}
    var q=e.target.closest("[data-quick]"); if(q){quick(q.getAttribute("data-quick"));return;}
    var w=e.target.closest("[data-wish]"); if(w){e.preventDefault();toggleWish(w.getAttribute("data-wish"));return;}
    var inc=e.target.closest("[data-inc]"); if(inc){var c=cart();c[inc.dataset.inc]++;saveCart(c);return;}
    var dec=e.target.closest("[data-dec]"); if(dec){var c2=cart();if(--c2[dec.dataset.dec]<=0)delete c2[dec.dataset.dec];saveCart(c2);return;}
    var rm=e.target.closest("[data-rm]"); if(rm){var c3=cart();delete c3[rm.dataset.rm];saveCart(c3);return;}
    if(e.target.closest("#cartOpen")){openCart();return;}
    if(e.target.id==="cartClose"||e.target.id==="scrim"){closeCart();return;}
    if(e.target.closest("#searchOpen")){openSearch();return;}
    if(e.target.closest("[data-search-close]")){closeSearch();return;}
    var sq=e.target.closest("[data-sq]"); if(sq){e.preventDefault();$("#searchInput").value=sq.dataset.sq;searchRender(sq.dataset.sq);return;}
    if(e.target.closest("[data-modal-close]")){closeModal();return;}
    if(e.target.closest("#burger")){$("#mmenu").classList.add("open");return;}
    if(e.target.id==="mmClose"){$("#mmenu").classList.remove("open");return;}
    if(e.target.closest(".mmenu a")){$("#mmenu").classList.remove("open");}
    if(e.target.id==="checkoutBtn"){closeCart();location.href="checkout.html";return;}
  });
  document.addEventListener("input",function(e){ if(e.target.id==="searchInput")searchRender(e.target.value); });
  document.addEventListener("submit",function(e){
    if(e.target.id==="coForm"){ e.preventDefault(); placeOrder(); return; }
    if(e.target.id==="nlFoot"||e.target.classList.contains("nl-form")){e.preventDefault();e.target.reset();toast("Welcome to the world of AHANKARAKA");}
  });
  document.addEventListener("keydown",function(e){ if(e.key==="Escape"){closeModal();closeCart();closeSearch();$("#mmenu").classList.remove("open");} });

  // ---------- boot ----------
  document.addEventListener("DOMContentLoaded",function(){
    var h=$("#ahx-header"); if(h)h.innerHTML=headerHTML();
    var f=$("#ahx-footer"); if(f)f.innerHTML=footerHTML();
    var b=document.createElement("div"); b.innerHTML=overlaysHTML(); while(b.firstChild)document.body.appendChild(b.firstChild);
    $("#yr")&&($("#yr").textContent="2026");
    paint(); initSlimHeader(); initHero(); initCarousel(); initReveal();
    initHome(); initCollectionsLanding(); initCollection(); initProduct(); renderWishlist(); initCheckout();
  });
})();
