const productTable = document.getElementById("prodTable");

getOrder();

function getOrder() {
  axios
    .get(`/orders`)
    .then((response) => {
      renderProducts(response.data);
    })
    .catch((error) => {
      console.error("Error al obtener usuarios.\n", error);
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
                                          <button class="btn btn-danger btn-sm btn-delete" >Delete
                                              <i class="fa-solid fa-trash"></i>
                                          </button>
                                          <button class="btn btn-primary btn-sm btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal" >Edit
                                              <i class="fa-solid fa-edit"></i>
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
          console.error("Error al eliminar usuario.\n", error);
        });
    });
  });
  const editButtons = document.querySelectorAll(".btn-edit");
  editButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      console.log(products[index]);
    });
  });
}
