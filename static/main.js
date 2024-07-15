const display = document.getElementById("viewProd");

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

function renderProducts(products) {
  display.innerHTML = "";
  products.forEach((product) => {
    display.innerHTML += `<div class="card" style="width: 18rem;">
                                        <img src="${product.image}" class="card-img-top" alt="${product.productname}">
                                        <div class="card-body">
                                            <h5 class="card-title">${product.productname}</h5>
                                            <p class="card-text">${product.description}</p>
                                            <p class="card-text">$ ${product.price}</p>
                                            <a href="#" class="btn btn-primary">Add to Cart</a>
                                        </div>
                                    </div>`;
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
  axios
    .post(`/users`, {
      username: userName.value,
      email: userEmail.value,
      password: userPass.value,
      image: productImage.value,
    })
    .then(() => {
      getProducts();
    })
    .catch((error) => {
      console.error("Error al agregar ususario.\n", error);
    });
});
