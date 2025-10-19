// PriceListTable.jsx
import React, { useState, useEffect } from 'react';
import '../styles/PriceListTable.css';

export default function PriceListTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
  try {
    // Use your live backend URL on Render
    const response = await fetch('https://mini-app-backend-bdlo.onrender.com/api/products');
    if (!response.ok) throw new Error('Failed to load products');
    const data = await response.json();
    setProducts(data);
  } catch (err) {
    console.error('Fetch error:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

    fetchProducts();
  }, []);

  if (loading) return <div className="price-list-container">Loading price list...</div>;
  if (error) return <div className="price-list-container">Error: {error}</div>;

  return (
    <div className="price-list-container">
      <div className="search-section">
        <div className="search-group">
          <input type="text" placeholder="Search Article No." className="search-input" />
          <button className="search-btn">🔍</button>
        </div>
        <div className="search-group">
          <input type="text" placeholder="Search Product ..." className="search-input" />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn">New Product</button>
        <button className="btn">Print List</button>
        <button className="btn">Advanced mode</button>
      </div>

      <div className="table-wrapper">
        <table className="price-table">
          <thead>
            <tr>
              <th>Article No. ↓</th>
              <th>Product/Service ↓</th>
              <th>In Price</th>
              <th>Price</th>
              <th>Unit</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                <td>{item.articleNo}</td>
                <td>{item.product}</td>
                <td>{item.inPrice}</td>
                <td>{item.price}</td>
                <td>{item.unit}</td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}