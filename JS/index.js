const menuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
        const isOpen = !mobileMenu.classList.contains("hidden");

        mobileMenu.classList.toggle("hidden");
        menuButton.setAttribute("aria-expanded", String(!isOpen));

        menuButton.innerHTML = isOpen ?
            '<i class="fa-solid fa-bars"></i>' :
            '<i class="fa-solid fa-xmark"></i>';
    });
}


// ========================================
// PRODUCT SEARCH & FILTERS
// ========================================

const searchInput = document.getElementById("product-search");
const filterButtons = document.querySelectorAll("[data-filter]");
const products = document.querySelectorAll("#products article");

const sizeFilter = document.getElementById("size-filter");
const maxPriceInput = document.getElementById("max-price");
const noProducts = document.getElementById("no-products");

let activeCategory = "all";

// Filter products
function filterProducts() {
    const searchValue = searchInput ?
        searchInput.value.toLowerCase().trim() :
        "";

    const selectedSize = sizeFilter ? sizeFilter.value : "all";
    const maxPrice = maxPriceInput ? maxPriceInput.value : "";

    products.forEach((product) => {
        const name = product.dataset.name.toLowerCase();
        const category = product.dataset.category;
        const size = product.dataset.size;
        const price = Number(product.dataset.price);

        const matchesSearch = name.includes(searchValue);

        const matchesCategory =
            activeCategory === "all" ||
            category === activeCategory;

        const matchesSize =
            selectedSize === "all" ||
            size === selectedSize;

        const matchesPrice =
            maxPrice === "" ||
            price <= Number(maxPrice);

        const isVisible =
            matchesSearch &&
            matchesCategory &&
            matchesSize &&
            matchesPrice;

        product.classList.toggle("hidden", !isVisible);
    });

    // No products message
    const visibleProducts = [...products].filter(
        product => !product.classList.contains("hidden")
    );
    // Update products counter
    const productsCount = document.getElementById("products-count");

    if (productsCount) {
        const count = visibleProducts.length;

        productsCount.textContent =
            `${count} ${count === 1 ? "item" : "items"} available`;
    }

    if (noProducts) {
        noProducts.classList.toggle(
            "hidden",
            visibleProducts.length !== 0
        );
    }
}

// Search event
if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
}

// Size event
if (sizeFilter) {
    sizeFilter.addEventListener("change", filterProducts);
}

// Price event
if (maxPriceInput) {
    maxPriceInput.addEventListener("input", filterProducts);
}

// Category filter events
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeCategory = button.dataset.filter;

        filterButtons.forEach((item) => {
            item.classList.remove("bg-[#252522]", "text-white");
            item.classList.add(
                "border",
                "border-[#252522]/15",
                "text-[#252522]"
            );
        });

        button.classList.remove(
            "border",
            "border-[#252522]/15",
            "text-[#252522]"
        );

        button.classList.add("bg-[#252522]", "text-white");

        filterProducts();
    });
});



// ========================================
// PRODUCT IMAGE GALLERY
// ========================================

const mainProductImage = document.getElementById("main-product-image");
const productThumbnails = document.querySelectorAll(".product-thumbnail");

if (mainProductImage && productThumbnails.length > 0) {
    productThumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener("click", () => {
            const newImage = thumbnail.dataset.image;

            if (newImage) {
                mainProductImage.src = newImage;
            }
        });
    });
}

// ========================================
// PRODUCT SIZE SELECTION
// ========================================

const sizeOptions = document.querySelectorAll(".size-option");

sizeOptions.forEach((button) => {
    button.addEventListener("click", () => {

        // Reset all sizes
        sizeOptions.forEach((option) => {
            option.classList.remove("bg-[#252522]", "text-white");
            option.classList.add("border", "border-[#252522]/20");
        });

        // Activate selected size
        button.classList.remove("border", "border-[#252522]/20");
        button.classList.add("bg-[#252522]", "text-white");
    });
});


// ========================================
// PRODUCT QUANTITY
// ========================================

const quantityDisplay = document.getElementById("product-quantity");
const decreaseButton = document.getElementById("decrease-quantity");
const increaseButton = document.getElementById("increase-quantity");

if (quantityDisplay && decreaseButton && increaseButton) {
    let quantity = 1;

    increaseButton.addEventListener("click", () => {
        quantity++;
        quantityDisplay.textContent = quantity;
    });

    decreaseButton.addEventListener("click", () => {
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
        }
    });
}



// ========================================
// ADD PRODUCT TO CART
// ========================================

const addToCartButton = document.getElementById("add-to-cart");

if (addToCartButton) {
    addToCartButton.addEventListener("click", () => {
        const nameElement = document.getElementById("product-name");
        const priceElement = document.getElementById("product-price");
        const imageElement = document.getElementById("main-product-image");
        const quantityElement = document.getElementById("product-quantity");

        if (!nameElement || !priceElement || !imageElement || !quantityElement) {
            return;
        }

        const productName = nameElement.textContent.trim();
        const productPrice = Number(priceElement.textContent);
        const productImage = imageElement.src;
        const quantity = Number(quantityElement.textContent);

        const selectedSize = document.querySelector(".size-option.bg-\\[\\#252522\\]");

        if (!selectedSize) {
            alert("Please select a size first.");
            return;
        }

        const size = selectedSize.dataset.size;

        const cartItem = {
            id: `${productName}-${size}`,
            name: productName,
            price: productPrice,
            image: productImage,
            size: size,
            quantity: quantity
        };

        let cart = JSON.parse(localStorage.getItem("rewear-cart")) || [];

        const existingItem = cart.find(item => item.id === cartItem.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem("rewear-cart", JSON.stringify(cart));

        alert("Product added to cart!");
    });
}

// ========================================
// CART PAGE
// ========================================

const cartItemsContainer = document.getElementById("cart-items");
const emptyCartMessage = document.getElementById("empty-cart");

if (cartItemsContainer) {

    let cart = JSON.parse(localStorage.getItem("rewear-cart")) || [];

    function renderCart() {

        cartItemsContainer.innerHTML = "";

        let subtotal = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            emptyCartMessage.classList.remove("hidden");
        } else {
            emptyCartMessage.classList.add("hidden");
        }

        cart.forEach((item, index) => {

            const itemTotal = item.price * item.quantity;

            subtotal += itemTotal;
            totalItems += item.quantity;

            const cartItem = document.createElement("article");

            cartItem.className =
                "flex flex-col sm:flex-row gap-5 border-b border-[#252522]/10 pb-6";

            cartItem.innerHTML = `
                <img
                    src="${item.image}"
                    alt="${item.name}"
                    class="w-full sm:w-32 h-40 object-cover rounded-xl"
                >

                <div class="flex-1">

                    <div class="flex justify-between gap-4">

                        <div>
                            <h3 class="font-semibold text-lg">
                                ${item.name}
                            </h3>

                            <p class="text-sm text-[#85816F] mt-2">
                                Size: ${item.size}
                            </p>
                        </div>

                        <span class="font-semibold">
                            ${item.price} MAD
                        </span>

                    </div>

                    <div class="flex justify-between items-center mt-6">

                        <div class="flex items-center border border-[#252522]/15 rounded-lg">

    <button
        type="button"
        class="decrease-cart-quantity px-3 py-1"
        data-index="${index}">
        -
    </button>

    <span class="px-3 text-sm">
        ${item.quantity}
    </span>

    <button
        type="button"
        class="increase-cart-quantity px-3 py-1"
        data-index="${index}">
        +
    </button>

</div>

                        <button
                            type="button"
                            class="remove-cart-item text-sm text-red-600 hover:underline"
                            data-index="${index}"
                        >
                            Remove
                        </button>

                    </div>

                    <p class="text-sm font-medium mt-4">
                        Total: ${itemTotal} MAD
                    </p>

                </div>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        // Update summary
        document.getElementById("cart-subtotal").textContent =
            `${subtotal} MAD`;

        document.getElementById("cart-total").textContent =
            `${subtotal} MAD`;

        document.getElementById("cart-items-count").textContent =
            `${totalItems} ${totalItems === 1 ? "Item" : "Items"}`;
    }

    // Remove product
    // Cart actions
    cartItemsContainer.addEventListener("click", (event) => {

        const removeButton = event.target.closest(".remove-cart-item");
        const increaseButton = event.target.closest(".increase-cart-quantity");
        const decreaseButton = event.target.closest(".decrease-cart-quantity");

        if (removeButton) {
            const index = Number(removeButton.dataset.index);
            cart.splice(index, 1);
        }

        if (increaseButton) {
            const index = Number(increaseButton.dataset.index);
            cart[index].quantity++;
        }

        if (decreaseButton) {
            const index = Number(decreaseButton.dataset.index);

            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            }
        }

        localStorage.setItem("rewear-cart", JSON.stringify(cart));

        renderCart();
    });
    renderCart();
}



// ========================================
// CHECKOUT PAGE
// ========================================

const checkoutItems = document.getElementById("checkout-items");

if (checkoutItems) {
    const cart = JSON.parse(localStorage.getItem("rewear-cart")) || [];

    let subtotal = 0;

    checkoutItems.innerHTML = "";

    cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;

        subtotal += itemTotal;

        const product = document.createElement("div");

        product.className = "flex gap-4";

        product.innerHTML = `
            <img
                src="${item.image}"
                alt="${item.name}"
                class="w-20 h-24 object-cover rounded-lg"
            >

            <div class="flex-1">
                <h3 class="font-medium text-sm">${item.name}</h3>

                <p class="text-xs text-[#85816F] mt-2">
                    Size: ${item.size}
                </p>

                <p class="text-xs text-[#85816F] mt-1">
                    Quantity: ${item.quantity}
                </p>

                <p class="font-semibold text-sm mt-2">
                    ${itemTotal} MAD
                </p>
            </div>
        `;

        checkoutItems.appendChild(product);
    });

    document.getElementById("checkout-subtotal").textContent =
        `${subtotal} MAD`;

    document.getElementById("checkout-total").textContent =
        `${subtotal} MAD`;
}

// ========================================
// CHECKOUT FORM VALIDATION
// ========================================

const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {
    checkoutForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("customer-name").value.trim();
        const phone = document.getElementById("customer-phone").value.trim();
        const city = document.getElementById("customer-city").value.trim();
        const address = document.getElementById("customer-address").value.trim();

        const cart = JSON.parse(localStorage.getItem("rewear-cart")) || [];

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        if (!name || !phone || !city || !address) {
            alert("Please complete all fields.");
            return;
        }

        const moroccanPhoneRegex = /^(06|07|\+2126|\+2127)\d{8}$/;

        if (!moroccanPhoneRegex.test(phone.replace(/\s/g, ""))) {
            alert("Please enter a valid Moroccan phone number.");
            return;
        }

        // Generate order
        const order = {
            id: "RW-" + Date.now(),
            customer: {
                name,
                phone,
                city,
                address
            },
            products: cart,
            total: cart.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            ),
            paymentMethod: "Cash on Delivery",
            status: "Pending",
            createdAt: new Date().toISOString()
        };

        // Save order
        const orders = JSON.parse(localStorage.getItem("rewear-orders")) || [];

        orders.push(order);

        localStorage.setItem("rewear-orders", JSON.stringify(orders));

        // Clear cart
        localStorage.removeItem("rewear-cart");

        // Redirect to confirmation page
        window.location.href = "order-success.html";
    });
}