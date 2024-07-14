// Obtengo los datos del form de productos
const userName = document.getElementById("prodName");
const userEmail = document.getElementById("prodEmail");
const userPass = document.getElementById("prodPass");
const productForm = document.getElementById("prodForm");
const formBtm = document.getElementById("btnAdd");

// Obtengo los elementos que quiero editar del documento
const formTitle = document.getElementById("modalTitle");
const productTable = document.getElementById("prodTable");
const formButton = document.getElementById("modalSubmit");

formBtm.addEventListener("click", () => {
  productForm.reset();
});

// Creo una variable para saber si estoy editando o no
let isEditing = null;

// Obtengo los productos de la API
getProducts();

function getProducts() {
  axios
    .get(`/users`)
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
                                    <td>${product.username}</td>
                                    <td>${product.email}</td>
                                    <td>${product.password}</td>
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
        .delete(`/users/${products[index].id}`)
        .then(() => {
          getProducts();
        })
        .catch((error) => {
          console.error("Error al eliminar usuario.\n", error);
        });
    });
  });
  const editButtons = document.querySelectorAll(".btn-edit");
  editButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      userName.value = products[index].username;
      userEmail.value = products[index].email;
      userPass.value = products[index].password;
      // productImage.value = products[index].image;
      isEditing = products[index].id;
      formTitle.innerText = "Edit User";
      formButton.innerText = "Save Changes";
    });
  });
}

productForm.addEventListener("submit", (event) => {
  if (isEditing) {
    axios
      .put(`/users/${isEditing}`, {
        username: userName.value,
        email: userEmail.value,
        password: userPass.value,
        // image: productImage.value,
      })
      .then(() => {
        getProducts();
        isEditing = null;
      })
      .catch((error) => {
        console.error("Error al editar usuaro.\n", error);
      });
  } else {
    axios
      .post(`/users`, {
        username: userName.value,
        email: userEmail.value,
        password: userPass.value,
        // image: productImage.value,
      })
      .then(() => {
        getProducts();
      })
      .catch((error) => {
        console.error("Error al agregar ususario.\n", error);
      });
  }
});
