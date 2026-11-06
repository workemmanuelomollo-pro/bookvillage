/* =============================================================
   BOOK VILLAGE — APPLICATION LOGIC
   ============================================================= */

(function () {
  'use strict';

  const STORAGE_KEYS = {
    books:   'bv_books_v1',
    cart:    'bv_cart_v1',
    session: 'bv_session_v1',
    user:    'bv_remembered_user',
    role:    'bv_remembered_role'
  };

  const AD_FEE = 19.00;
  const FALLBACK_IMG = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400';

  const INITIAL_BOOKS = [
    { id: 1,  title: 'The Midnight Library',     author: 'Matt Haig',        price: 18.99, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', sponsored: true  },
    { id: 2,  title: 'Atomic Habits',            author: 'James Clear',      price: 16.50, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400', sponsored: false },
    { id: 3,  title: 'Dune',                     author: 'Frank Herbert',    price: 15.99, image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', sponsored: true  },
    { id: 4,  title: 'Clean Code',               author: 'Robert C. Martin', price: 34.99, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400', sponsored: false },
    { id: 5,  title: 'The Silent Patient',       author: 'Alex Michaelides', price: 14.25, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', sponsored: false },
    { id: 6,  title: 'Steve Jobs',               author: 'Walter Isaacson',  price: 21.00, image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', sponsored: false },
    { id: 7,  title: 'Project Hail Mary',        author: 'Andy Weir',        price: 17.99, image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400', sponsored: false },
    { id: 8,  title: 'The Name of the Wind',     author: 'Patrick Rothfuss', price: 19.50, image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400', sponsored: false },
    { id: 9,  title: 'Educated',                 author: 'Tara Westover',    price: 15.20, image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400', sponsored: false },
    { id: 10, title: 'Thinking, Fast and Slow',  author: 'Daniel Kahneman',  price: 16.99, image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400', sponsored: false },
    { id: 11, title: 'Where the Crawdads Sing',  author: 'Delia Owens',      price: 14.99, image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400', sponsored: false },
    { id: 12, title: 'Sapiens: A Brief History', author: 'Yuval Harari',     price: 22.50, image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400', sponsored: false },
    { id: 13, title: 'The Hobbit',               author: 'J.R.R. Tolkien',   price: 13.99, image: 'https://images.unsplash.com/photo-1629992101753-56d196c8aea7?w=400', sponsored: false },
    { id: 14, title: 'Designing Data Apps',      author: 'Martin Kleppmann', price: 39.99, image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400', sponsored: false },
    { id: 15, title: 'Neuromancer',              author: 'William Gibson',   price: 14.50, image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400', sponsored: false }
  ];

  let books = [];
  let cart = [];
  let loggedInUser = null;
  let selectedRole = 'customer';
  const els = {};

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return JSON.parse(JSON.stringify(fallback));
      const parsed = JSON.parse(raw);
      return (parsed === null || parsed === undefined) ? JSON.parse(JSON.stringify(fallback)) : parsed;
    } catch (err) { return JSON.parse(JSON.stringify(fallback)); }
  }

  function saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (err) {}
  }

  function saveBooks() { saveJSON(STORAGE_KEYS.books, books); }
  function saveCart()  { saveJSON(STORAGE_KEYS.cart, cart); }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function cacheElements() {
    els.loginScreen = document.getElementById('login-screen');
    els.storeScreen = document.getElementById('store-screen');
    els.loginForm = document.getElementById('login-form');
    els.loginUsername = document.getElementById('login-username');
    els.loginPassword = document.getElementById('login-password');
    els.rememberMe = document.getElementById('remember-me');
    els.loginNameLabel = document.getElementById('login-name-label');
    els.googleBtnText = document.getElementById('google-btn-text');
    els.googleBtn = document.getElementById('btn-google');
    els.roleCustomerBtn = document.getElementById('btn-role-customer');
    els.roleAuthorBtn = document.getElementById('btn-role-author');
    els.brandHome = document.getElementById('brand-home');
    els.userDisplay = document.getElementById('user-display');
    els.authorNavBtn = document.getElementById('author-nav-btn');
    els.openCartBtn = document.getElementById('open-cart-btn');
    els.logoutBtn = document.getElementById('logout-btn');
    els.cartCount = document.getElementById('cart-count');
    els.welcomeHeading = document.getElementById('welcome-heading');
    els.welcomeSubtext = document.getElementById('welcome-subtext');
    els.authorPanel = document.getElementById('author-panel');
    els.authorForm = document.getElementById('author-form');
    els.authorBookTitle = document.getElementById('author-book-title');
    els.authorName = document.getElementById('author-name');
    els.authorBookPrice = document.getElementById('author-book-price');
    els.authorBookImage = document.getElementById('author-book-image');
    els.adCheckbox = document.getElementById('ad-checkbox');
    els.adPaymentSection = document.getElementById('ad-payment-section');
    els.publishBtn = document.getElementById('publish-btn');
    els.searchInput = document.getElementById('search-input');
    els.bookGrid = document.getElementById('book-grid');
    els.bookCount = document.getElementById('book-count');
    els.cartModal = document.getElementById('cart-modal');
    els.cartItems = document.getElementById('cart-items-container');
    els.cartTotalPrice = document.getElementById('cart-total-price');
    els.checkoutBtn = document.getElementById('checkout-btn');
    els.orderModal = document.getElementById('order-modal');
    els.orderNumber = document.getElementById('order-number');
    els.orderTotal = document.getElementById('order-total');
    els.toast = document.getElementById('toast');
  }

  function init() {
    cacheElements();
    books = loadJSON(STORAGE_KEYS.books, INITIAL_BOOKS);
    cart  = loadJSON(STORAGE_KEYS.cart, []);
    restoreRememberedCredentials();
    bindEvents();
    syncAdPayment();
    updateCartBadge();
    restoreSession();
  }

  function restoreRememberedCredentials() {
    const rememberedUser = localStorage.getItem(STORAGE_KEYS.user);
    const rememberedRole = localStorage.getItem(STORAGE_KEYS.role);
    if (rememberedRole) selectRole(rememberedRole);
    if (rememberedUser) {
      els.loginUsername.value = rememberedUser;
      els.rememberMe.checked = true;
    }
  }

  function restoreSession() {
    const session = loadJSON(STORAGE_KEYS.session, null);
    if (session && session.name) completeLogin(session.name, session.type, true);
  }

  function selectRole(role) {
    selectedRole = role;
    const isCustomer = role === 'customer';
    els.roleCustomerBtn.classList.toggle('is-active', isCustomer);
    els.roleAuthorBtn.classList.toggle('is-active', !isCustomer);
    if (isCustomer) {
      els.loginNameLabel.textContent = 'Customer Email';
      els.googleBtnText.textContent  = 'Sign in with Google as Customer';
      els.loginUsername.placeholder  = 'e.g. reader@example.com';
    } else {
      els.loginNameLabel.textContent = 'Author Pen Name';
      els.googleBtnText.textContent  = 'Sign in with Google as Author';
      els.loginUsername.placeholder  = 'e.g. Jane Doe';
    }
  }

  // Called when you click the Google Button
  function handleGoogleSignIn() {
    if (window.bookVillageFirebase && window.bookVillageFirebase.signInWithGoogle) {
      window.bookVillageFirebase.signInWithGoogle();
    } else {
      showToast('Firebase is loading, please try again in a moment.');
    }
  }

  function handleMainLogin(event) {
    event.preventDefault();
    const username = els.loginUsername.value.trim();
    if (els.rememberMe.checked) {
      localStorage.setItem(STORAGE_KEYS.user, username);
      localStorage.setItem(STORAGE_KEYS.role, selectedRole);
    } else {
      localStorage.removeItem(STORAGE_KEYS.user);
      localStorage.removeItem(STORAGE_KEYS.role);
    }
    completeLogin(username, selectedRole);
    showToast('Logged in successfully.');
  }

  function completeLogin(username, role, silent) {
    loggedInUser = {
      name: username.indexOf('@') !== -1 ? username.split('@')[0] : username,
      type: role
    };
    saveJSON(STORAGE_KEYS.session, loggedInUser);
    els.loginScreen.classList.add('hidden');
    els.storeScreen.classList.remove('hidden');

    if (role === 'author') {
      els.userDisplay.textContent = '✍️ Author: ' + loggedInUser.name;
      els.authorNavBtn.classList.remove('hidden');
      els.authorName.value = loggedInUser.name;
      els.authorPanel.style.display = 'block';
      els.welcomeHeading.textContent = 'Welcome, Author ' + loggedInUser.name + '!';
      els.welcomeSubtext.textContent = 'Use your Author Portal below to add and advertise your books directly on Book Village.';
    } else {
      els.userDisplay.textContent = '👋 Hi, ' + loggedInUser.name;
      els.authorNavBtn.classList.add('hidden');
      els.authorPanel.style.display = 'none';
      els.welcomeHeading.textContent = 'Welcome to Book Village, ' + loggedInUser.name + '!';
      els.welcomeSubtext.textContent = 'Explore handpicked titles, add them to your cart, and purchase online anytime.';
    }
    renderBooks();
    updateCartBadge();
    if (!silent) window.scrollTo({ top: 0 });
  }

  function handleLogout() {
    loggedInUser = null;
    cart = [];
    saveCart();
    localStorage.removeItem(STORAGE_KEYS.session);
    
    // Log out of Firebase too
    if (window.bookVillageFirebase && window.bookVillageFirebase.signOut) {
      window.bookVillageFirebase.signOut();
    }

    updateCartBadge();
    els.loginScreen.classList.remove('hidden');
    els.storeScreen.classList.add('hidden');
    els.loginPassword.value = '';
    showToast('Logged out successfully.');
  }

  function renderBooks() {
    const query = (els.searchInput.value || '').trim().toLowerCase();
    const filtered = books.filter(function (book) {
      if (!query) return true;
      return book.title.toLowerCase().indexOf(query) !== -1 || book.author.toLowerCase().indexOf(query) !== -1;
    });
    const sorted = filtered.slice().sort(function (a, b) { return Number(b.sponsored) - Number(a.sponsored); });
    els.bookCount.textContent = books.length;
    els.bookGrid.innerHTML = '';

    if (sorted.length === 0) {
      els.bookGrid.innerHTML = '<p class="empty-state">No books match your search.</p>';
      return;
    }

    sorted.forEach(function (book) {
      const card = document.createElement('div');
      card.className = 'book-card';
      card.innerHTML = (book.sponsored ? '<span class="sponsor-tag">SPONSORED</span>' : '') +
        '<img class="book-image" src="' + escapeHtml(book.image) + '" alt="Cover of ' + escapeHtml(book.title) + '" data-fallback="' + FALLBACK_IMG + '" />' +
        '<div><div class="book-title">' + escapeHtml(book.title) + '</div><div class="book-author">by ' + escapeHtml(book.author) + '</div></div>' +
        '<div><div class="book-price">$' + Number(book.price).toFixed(2) + '</div><button type="button" class="btn btn-primary btn-block" data-add-id="' + book.id + '">Add to Cart</button></div>';
      els.bookGrid.appendChild(card);
    });
  }

  function addToCart(bookId) {
    const book = books.find(function (b) { return b.id === bookId; });
    if (!book) return;
    const existing = cart.find(function (item) { return item.id === bookId; });
    if (existing) { existing.qty += 1; } else { cart.push({ id: book.id, title: book.title, price: book.price, qty: 1 }); }
    saveCart();
    updateCartBadge();
    showToast('Added "' + book.title + '" to cart.');
  }

  function changeQty(bookId, delta) {
    const item = cart.find(function (i) { return i.id === bookId; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(function (i) { return i.id !== bookId; });
    saveCart(); updateCartBadge(); renderCartItems();
  }

  function removeFromCart(bookId) {
    cart = cart.filter(function (item) { return item.id !== bookId; });
    saveCart(); updateCartBadge(); renderCartItems();
  }

  function updateCartBadge() {
    const totalCount = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    els.cartCount.textContent = totalCount;
  }

  function openCartModal() { renderCartItems(); openModal('cart-modal'); }

  function renderCartItems() {
    if (cart.length === 0) {
      els.cartItems.innerHTML = '<p class="cart-empty">Your shopping cart is empty.</p>';
      els.cartTotalPrice.textContent = '0.00';
      return;
    }
    els.cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(function (item) {
      const lineTotal = item.price * item.qty;
      total += lineTotal;
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = '<div><strong class="cart-item__title">' + escapeHtml(item.title) + '</strong><div class="cart-item__meta">$' + Number(item.price).toFixed(2) + ' each</div></div>' +
        '<div class="cart-item__actions"><span class="qty-controls"><button type="button" class="qty-btn" data-action="dec" data-id="' + item.id + '" aria-label="Decrease quantity">−</button><span>' + item.qty + '</span><button type="button" class="qty-btn" data-action="inc" data-id="' + item.id + '" aria-label="Increase quantity">+</button></span>' +
        '<span class="cart-item__total">$' + lineTotal.toFixed(2) + '</span><button type="button" class="btn btn-secondary btn-remove" data-action="remove" data-id="' + item.id + '" aria-label="Remove item">×</button></div>';
      els.cartItems.appendChild(row);
    });
    els.cartTotalPrice.textContent = total.toFixed(2);
  }

  function checkoutCart() {
    if (cart.length === 0) { showToast('Your cart is empty. Add some books first.'); return; }
    const total = cart.reduce(function (sum, item) { return sum + item.price * item.qty; }, 0);
    els.orderNumber.textContent = 'BV-' + Date.now().toString().slice(-6);
    els.orderTotal.textContent = total.toFixed(2);
    cart = []; saveCart(); updateCartBadge();
    closeModal('cart-modal'); openModal('order-modal');
  }

  function toggleAuthorPortal() {
    const isOpen = els.authorPanel.style.display === 'block';
    if (isOpen) { els.authorPanel.style.display = 'none'; } else { els.authorPanel.style.display = 'block'; window.scrollTo({ top: 0, behavior: 'smooth' }); }
  }

  function syncAdPayment() {
    const isSponsored = els.adCheckbox.checked;
    els.adPaymentSection.style.display = isSponsored ? 'block' : 'none';
    const paymentInputs = els.adPaymentSection.querySelectorAll('input');
    Array.prototype.forEach.call(paymentInputs, function (input) { input.required = isSponsored; });
    els.publishBtn.textContent = isSponsored ? 'Submit Book & Pay $' + AD_FEE.toFixed(0) + ' Ad Fee' : 'Publish Book (Free)';
  }

  function handlePublishAndAdvertise(event) {
    event.preventDefault();
    const title  = els.authorBookTitle.value.trim();
    const author = els.authorName.value.trim();
    const price  = parseFloat(els.authorBookPrice.value);
    const image  = els.authorBookImage.value.trim();
    const isSponsored = els.adCheckbox.checked;
    if (!title || !author || isNaN(price) || price < 0) { showToast('Please complete all book details.'); return; }
    const newBook = { id: Date.now(), title: title, author: author, price: price, image: image, sponsored: isSponsored };
    books.unshift(newBook); saveBooks(); renderBooks();
    showToast(isSponsored ? 'Published & paid $' + AD_FEE.toFixed(2) + '. "' + title + '" is now SPONSORED at the top.' : 'Book "' + title + '" published to the library.');
    els.authorForm.reset();
    els.authorName.value = loggedInUser ? loggedInUser.name : '';
    syncAdPayment();
    els.authorPanel.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showStorefront() {
    if (loggedInUser && loggedInUser.type === 'author') els.authorPanel.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openModal(modalId) { const modal = document.getElementById(modalId); if (modal) modal.style.display = 'flex'; }
  function closeModal(modalId) { const modal = document.getElementById(modalId); if (modal) modal.style.display = 'none'; }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.className = 'show';
    window.setTimeout(function () { els.toast.className = els.toast.className.replace('show', ''); }, 3000);
  }

  function bindEvents() {
    els.roleCustomerBtn.addEventListener('click', function () { selectRole('customer'); });
    els.roleAuthorBtn.addEventListener('click', function () { selectRole('author'); });
    els.googleBtn.addEventListener('click', handleGoogleSignIn);
    els.loginForm.addEventListener('submit', handleMainLogin);
    els.brandHome.addEventListener('click', showStorefront);
    els.authorNavBtn.addEventListener('click', toggleAuthorPortal);
    els.openCartBtn.addEventListener('click', openCartModal);
    els.logoutBtn.addEventListener('click', handleLogout);
    els.searchInput.addEventListener('input', renderBooks);
    els.bookGrid.addEventListener('click', function (event) {
      const btn = event.target.closest('[data-add-id]');
      if (!btn) return;
      addToCart(Number(btn.dataset.addId));
    });
    els.bookGrid.addEventListener('error', function (event) {
      const img = event.target;
      if (img.tagName === 'IMG' && img.dataset.fallback) img.src = img.dataset.fallback;
    }, true);
    els.adCheckbox.addEventListener('change', syncAdPayment);
    els.authorForm.addEventListener('submit', handlePublishAndAdvertise);
    els.checkoutBtn.addEventListener('click', checkoutCart);
    els.cartItems.addEventListener('click', function (event) {
      const control = event.target.closest('[data-action]');
      if (!control) return;
      const id = Number(control.dataset.id);
      switch (control.dataset.action) {
        case 'inc': changeQty(id, 1); break;
        case 'dec': changeQty(id, -1); break;
        case 'remove': removeFromCart(id); break;
      }
    });
    document.addEventListener('click', function (event) {
      const closer = event.target.closest('[data-close]');
      if (closer) closeModal(closer.dataset.close);
    });
    [els.cartModal, els.orderModal].forEach(function (overlay) {
      overlay.addEventListener('click', function (event) { if (event.target === overlay) overlay.style.display = 'none'; });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { closeModal('cart-modal'); closeModal('order-modal'); }
    });

    // --- THIS IS THE MAGIC CONNECTION TO FIREBASE ---
    // When Firebase successfully logs you in via redirect, this catches it.
    window.addEventListener('book-village-firebase-auth', function (event) {
      const user = event.detail;
      if (user) {
        // Firebase gave us the user info, so log them into Book Village!
        completeLogin(user.displayName || user.email, selectedRole);
        showToast('Signed in with Google: ' + (user.displayName || user.email));
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();