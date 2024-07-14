// Obtengo los datos del form de productos
const productName = document.getElementById("prodName");
const procutsCategory = document.getElementById("prodCat");
const productGender = document.getElementById("prodGen");
const productDescription = document.getElementById("prodDesc");
const productPrice = document.getElementById("prodPrice");
const productImage = document.getElementById("prodImg");
const productForm = document.getElementById("prodForm");

// Obtengo los elementos que quiero editar del documento
const formTitle = document.getElementById("modalTitle");
const productTable = document.getElementById("prodTable");
const formButton = document.getElementById("modalSubmit");

// Creo una variable para saber si estoy editando o no
let isEditing = null;

// Obtengo los productos de la API
getProducts();

function getProducts() {
  axios
    .get(`/products`)
    .then((response) => {
      renderProducts(response.data);
    })
    .catch((error) => {
      console.error("Error al obtener productos\n", error);
    });
}

function renderProducts(products) {
  productTable.innerHTML = "";
  products.forEach((product) => {
    productTable.innerHTML += `<tr>
                                    <td>${product.productname}</td>
                                    <td>${product.category}</td>
                                    <td>${product.gender}</td>
                                    <td>${product.description}</td>
                                    <td>$ ${product.price}</td>
                                    <td>
                                        <button class="btn btn-danger btn-sm" data-delete="${product.id}">Delete
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                        <button class="btn btn-primary btn-sm" data-edit="${product.id}">Edit
                                            <i class="fa-solid fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>`;
  });
}

productForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (isEditing) {
    axios
      .put(`/products/${isEditing}`, {
        productname: productName.value,
        category: procutsCategory.value,
        gender: productGender.value,
        description: productDescription.value,
        price: productPrice.value,
        // image: productImage.value,
      })
      .then(() => {
        getProducts();
        formTitle.innerHTML = "Edit Product";
        formButton.innerHTML = "Save Changes";
        isEditing = null;
      })
      .catch((error) => {
        console.error("Error al editar producto\n", error);
      });
  } else {
    axios
      .post(`/products`, {
        productname: productName.value,
        category: procutsCategory.value,
        gender: productGender.value,
        description: productDescription.value,
        price: productPrice.value,
        // image: productImage.value,
      })
      .then(() => {
        getProducts();
      })
      .catch((error) => {
        console.error("Error al agregar producto\n", error);
      });
  }
});
