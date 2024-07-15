const display = document.getElementById("viewProd");
const alertDisplay = document.getElementById("alertCont");

getMensProducts();

function getMensProducts() {
  axios
    .get("/products")
    .then((response) => {
      renderProducts(response.data);
    })
    .catch((error) => {
      console.error("Error al obtener productos.\n", error);
    });
}

function handleCart(product) {
  const prodId = product.id;
  const prodName = product.productname;
  const prodPrice = product.price;
  const prodImage = product.image;
  const prodQty = 1;
  const prodTotal = prodPrice * prodQty;

  axios
    .post(`/orders`, {
      product_id: prodId,
      product_name: prodName,
      product_price: prodPrice,
      product_image: prodImage,
      quantity: prodQty,
      total: prodTotal,
    })
    .then(() => {
      alertDisplay.innerHTML = `<div class="alert alert-success d-flex align-items-center" role="alert">
                                  <i class="fa-regular fa-circle-check"></i>
                                  <div>
                                    El producto fue agregado al carrito.
                                  </div>
                                </div>`;
      setTimeout(() => {
        alertDisplay.innerHTML = "";
      }, 1500);
    })
    .catch((error) => {
      console.error("Error al agregar producto al carrito.\n", error);
    });
}

function renderProducts(products) {
  display.innerHTML = "";
  products.forEach((product) => {
    display.innerHTML += `<div class="card" style="width: 18rem;">
                                        <img src="${product.image}" class="card-img-top" alt="${product.productname}">
                                        <div class="card-body">
                                            <h5 class="card-title">${product.productname}</h5>
                                            <p class="card-text">${product.description}</p>
                                            <p class="card-text">$ ${product.price}</p>
                                            <button class="btn btn-primary cart-btn" cartData="${product.id}">Add to Cart</button>
                                        </div>
                                    </div>`;
  });

  const cartBtn = document.querySelectorAll(".cart-btn");

  cartBtn.forEach((button) => {
    const prodID = button.getAttribute("cartData");
    button.addEventListener("click", () => {
      axios
        .get(`/products/${prodID}`)
        .then((response) => {
          handleCart(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener productos.\n", error);
        });
    });
  });
}

const userName = document.getElementById("prodName");
const userEmail = document.getElementById("prodEmail");
const userPass = document.getElementById("prodPass");
const productForm = document.getElementById("prodForm");
const formBtm = document.getElementById("btnAdd");
const productImage = document.getElementById("prodImg");

formBtm.addEventListener("click", () => {
  productForm.reset();
});

productForm.addEventListener("submit", (event) => {
  const image = productImage.value
    ? productImage.value
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  axios
    .post(`/users`, {
      username: userName.value,
      email: userEmail.value,
      password: userPass.value,
      image: image,
    })
    .then(() => {
      getProducts();
    })
    .catch((error) => {
      console.error("Error al agregar ususario.\n", error);
    });
});
