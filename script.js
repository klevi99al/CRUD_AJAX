function fetchProducts() {
  fetch('http://localhost:3000/products')
    .then(response => response.json())
    .then(data => {
      const productTableBody = document.getElementById('productTableBody');
      productTableBody.innerHTML = '';

      data.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${product.id}</td>
          <td>${product.emertimi}</td>
          <td>${product.njesia}</td>
          <td>${formatDate(product.data_skadences)}</td>
          <td>${product.cmimi}</td>
          <td>${product.lloj === 'I' ? 'Importuar' : 'Vendor'}</td>
          <td>${product.ka_tvsh ? 'Yes' : 'No'}</td>
          <td>${product.tipi}</td>
          <td>${product.barkod_kod}</td>
          <td>
            <button class="edit-button" onclick="editProduct(${product.id})">Edit</button>
            <button class="delete-button" onclick="deleteProduct(${product.id})">Delete</button>
          </td>
        `;
        productTableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      const productTableBody = document.getElementById('productTableBody');
      productTableBody.innerHTML = '<tr><td colspan="10">Error fetching products. Please try again later.</td></tr>';
    });
}


// Add a new product
document.getElementById('createForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = {
    emertimi: document.getElementById('emertimi').value,
    njesia: document.getElementById('njesia').value,
    data_skadences: document.getElementById('data_skadences').value,
    cmimi: parseFloat(document.getElementById('cmimi').value),
    lloj: document.querySelector('input[name="lloj"]:checked').value === 'Importuar' ? 'I' : 'V',
    ka_tvsh: document.getElementById('ka_tvsh').checked,
    tipi: document.getElementById('tipi').value,
    barkod_kod: document.getElementById('barkod_kod').value
  };

  fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Product added successfully:', data);
    alert('Product added successfully!');
    // Reset the form
    document.getElementById('createForm').reset();
    fetchProducts(); // Refresh the product list
    window.location.href = 'index.html';
  })
  .catch(error => {
    console.error('Error adding product:', error);
    alert('Error adding product');
  });
});

function deleteProduct(productId) {
  // Alert the ID before proceeding
  alert(`Deleting product with ID ${productId}`);
  console.log(`KLEVI with ID ${productId}`);

  if (confirm('Are you sure you want to delete this product?')) {
    fetch(`http://localhost:3000/products/${productId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Product deleted successfully:', data);
      fetchProducts(); // Refresh product list after deletion
    })
    .catch(error => {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    });
  }
}

function editProduct(productId) {
  window.location.href = `update.html?id=${productId}`;
}

// Fetch the initial list of products
fetchProducts();

