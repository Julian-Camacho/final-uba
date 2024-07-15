// Obtengo los datos del form de productos
const productName = document.getElementById("prodName");
const procutsCategory = document.getElementById("prodCat");
const productGender = document.getElementById("prodGen");
const productDescription = document.getElementById("prodDesc");
const productPrice = document.getElementById("prodPrice");
const productImage = document.getElementById("prodImg");
const productForm = document.getElementById("prodForm");
const formBtm = document.getElementById("btnAdd");

// Obtengo los elementos que quiero editar del documento
const formTitle = document.getElementById("modalTitle");
const productTable = document.getElementById("prodTable");
const formButton = document.getElementById("modalSubmit");

formBtm.addEventListener("click", () => {
  productForm.reset();
  formTitle.innerText = "Add Product";
  formButton.innerText = "Add Product";
});

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
                                    <td><img class="table-img" src="${product.image}" alt="${product.productname}"></td>
                                    <td>${product.productname}</td>
                                    <td>${product.category}</td>
                                    <td>${product.gender}</td>
                                    <td>${product.description}</td>
                                    <td>$ ${product.price}</td>
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
        .delete(`/products/${products[index].id}`)
        .then(() => {
          getProducts();
        })
        .catch((error) => {
          console.error("Error al eliminar producto\n", error);
        });
    });
  });
  const editButtons = document.querySelectorAll(".btn-edit");
  editButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      productName.value = products[index].productname;
      procutsCategory.value = products[index].category;
      productGender.value = products[index].gender;
      productDescription.value = products[index].description;
      productPrice.value = products[index].price;
      productImage.value = products[index].image;
      isEditing = products[index].id;
      formTitle.innerText = "Edit Product";
      formButton.innerText = "Save Changes";
    });
  });
}

productForm.addEventListener("submit", (event) => {
  if (isEditing) {
    axios
      .put(`/products/${isEditing}`, {
        productname: productName.value,
        category: procutsCategory.value,
        gender: productGender.value,
        description: productDescription.value,
        price: productPrice.value,
        image: productImage.value,
      })
      .then(() => {
        getProducts();
        isEditing = null;
      })
      .catch((error) => {
        console.error("Error al editar producto\n", error);
      });
  } else {
    const image = productImage.value
      ? productImage.value
      : "https://th.bing.com/th/id/OIP.Qu25kEoAAjUn2nl90z0jzAAAAA?rs=1&pid=ImgDetMain";
    axios
      .post(`/products`, {
        productname: productName.value,
        category: procutsCategory.value,
        gender: productGender.value,
        description: productDescription.value,
        price: productPrice.value,
        image: image,
      })
      .then(() => {
        getProducts();
      })
      .catch((error) => {
        console.error("Error al agregar producto\n", error);
      });
  }
});
