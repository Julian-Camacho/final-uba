const productTable = document.getElementById("prodTable");
const totalDisplay = document.getElementById("total");
const checkoutBtn = document.getElementById("checkout");

getOrder();

function getOrder() {
  axios
    .get(`/orders`)
    .then((response) => {
      renderProducts(response.data);
      handleTotal(response.data);
    })
    .catch((error) => {
      console.error("Error al obtener orden de compra.\n", error);
    });
}

function renderProducts(products) {
  productTable.innerHTML = "";
  products.forEach((product) => {
    productTable.innerHTML += `<tr>
                                      <td><img class="table-img"  src="${product.product_image}" alt="${product.product_name}"></td>
                                      <td>${product.product_name}</td>
                                      <td>${product.product_price}</td>
                                      <td>${product.quantity}</td>
                                      <td>
                                          <button class="btn btn-primary btn-sm btn-edit">
                                            <i class="fa-solid fa-plus"></i>
                                          </button>
                                          <button class="btn btn-primary btn-sm btn-edit-minus">
                                            <i class="fa-solid fa-minus"></i>
                                          </button>
                                          <button class="btn btn-danger btn-sm btn-delete" >    
                                            <i class="fa-solid fa-trash"></i>
                                          </button>
                                      </td>
                                  </tr>`;
  });
  const deleteButtons = document.querySelectorAll(".btn-delete");
  deleteButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      axios
        .delete(`/orders/${products[index].id}`)
        .then(() => {
          getOrder();
        })
        .catch((error) => {
          console.error("Error al eliminar producto del carrito.\n", error);
        });
    });
  });
  const editButtons = document.querySelectorAll(".btn-edit");
  editButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      console.log(products[index].id);

      axios
        .put(`/orders/${products[index].id}`, {
          quantity: products[index].quantity + 1,
        })
        .then(() => {
          getOrder();
        })
        .catch((error) => {
          console.error("Error al agregar producto al carrito.\n", error);
        });
    });
  });
  const editMinusButtons = document.querySelectorAll(".btn-edit-minus");
  editMinusButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (products[index].quantity > 1) {
        axios
          .put(`/orders/${products[index].id}`, {
            quantity: products[index].quantity - 1,
          })
          .then(() => {
            getOrder();
          })
          .catch((error) => {
            console.error("Error al agregar producto al carrito.\n", error);
          });
      } else {
        axios
          .delete(`/orders/${products[index].id}`)
          .then(() => {
            getOrder();
          })
          .catch((error) => {
            console.error("Error al eliminar producto del carrito.\n", error);
          });
      }
    });
  });
}

function handleTotal(products) {
  let total = 0;
  products.forEach((product) => {
    total += product.product_price * product.quantity;
  });
  totalDisplay.innerHTML = total.toFixed(2);
}
