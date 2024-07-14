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
