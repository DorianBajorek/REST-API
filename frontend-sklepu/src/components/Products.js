import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (selectedCategory) {
      axios.get(`http://localhost:3001/products/${selectedCategory}`)
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error('Błąd pobierania danych z serwera:', error);
        });
    } else {
      axios.get('http://localhost:3001/products')
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error('Błąd pobierania danych z serwera:', error);
        });
    }
  
    axios.get('http://localhost:3001/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Błąd pobierania kategorii z serwera:', error);
      });
  }, [selectedCategory]);

  const increaseTotalPrice = (price, name) => {
    setTotalPrice(prevTotalPrice => prevTotalPrice + price);
    setCartItems(prevCartItems => [...prevCartItems, { name, price }]);
  };

  const handlePay = () => {
    alert(`Dzięki za zakup! Zapłacono ${totalPrice} PLN za: ${cartItems.map(item => item.name).join(', ')}`);
    setTotalPrice(0);
    setCartItems([]);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filterProductsByCategory = (category) => {
    switch (category) {
      case 'Ciuchy':
        return products.filter(product => ['buty', 'koszulka', 'spodenki'].includes(product.name));
      case 'Akcesoria':
        return products.filter(product => ['Zegarek Garmin', 'Opaska HRV'].includes(product.name));
      default:
        return products;
    }
  };
  
  const filteredProducts = selectedCategory ? filterProductsByCategory(selectedCategory) : products;

  return (
    <div>
      <select onChange={handleCategoryChange}>
        <option value="">Wybierz kategorie</option>
        {categories.map(category => (
          <option key={category.id} value={category.name}>{category.name}</option>
        ))}
      </select>
      <ul>
        {filteredProducts.map(product => (
          <li key={product.id}>
            <h4>{product.name} - {product.price} PLN</h4>
            <button onClick={() => increaseTotalPrice(product.price, product.name)}>Dodaj do koszyka</button>
          </li>
        ))}
      </ul>
      <p>Suma wartości produktów: {totalPrice} PLN</p>
      {cartItems.length > 0 && (
        <div>
          <h3>Koszyk:</h3>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>{item.name} - {item.price} PLN</li>
            ))}
          </ul>
          <button onClick={handlePay}>Zapłać</button>
        </div>
      )}
    </div>
  );
};

export default Products;