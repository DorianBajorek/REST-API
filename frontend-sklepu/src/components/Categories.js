import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Błąd pobierania danych z serwera:', error);
      });
  }, []);

  return (
    <div>
      {/* <h2>Lista Kategorii</h2>
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            {category.name}
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default Categories;
