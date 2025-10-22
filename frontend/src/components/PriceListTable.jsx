import React, { useState, useEffect } from 'react';
import '../styles/PriceListTable.css';

export default function PriceListTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null); // for loading indicator per row

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ⚠️ Fixed: removed extra spaces in URL
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

  // Handle field update
  const handleFieldChange = async (id, field, value) => {
    setSavingId(id); // show saving state

    try {
      const response = await fetch(`https://mini-app-backend-bdlo.onrender.com/api/products/${id}`, {
        method: 'PATCH', // or 'PUT' depending on your backend
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) throw new Error('Failed to save');

      // Optimistically update UI
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, [field]: value } : product
        )
      );
    } catch (err) {
      console.error('Save error:', err);
      alert(`Failed to update ${field}: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

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
              <th>Article No.</th>
              <th>Product/Service</th>
              <th>In Price</th>
              <th>Price</th>
              <th>Unit</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                <EditableCell
                  value={item.articleNo}
                  onSave={(val) => handleFieldChange(item.id, 'articleNo', val)}
                  isSaving={savingId === item.id}
                />
                <EditableCell
                  value={item.product}
                  onSave={(val) => handleFieldChange(item.id, 'product', val)}
                  isSaving={savingId === item.id}
                />
                <EditableCell
                  value={item.inPrice}
                  onSave={(val) => handleFieldChange(item.id, 'inPrice', val)}
                  isSaving={savingId === item.id}
                  type="number"
                />
                <EditableCell
                  value={item.price}
                  onSave={(val) => handleFieldChange(item.id, 'price', val)}
                  isSaving={savingId === item.id}
                  type="number"
                />
                <EditableCell
                  value={item.unit}
                  onSave={(val) => handleFieldChange(item.id, 'unit', val)}
                  isSaving={savingId === item.id}
                />
                <EditableCell
                  value={item.description}
                  onSave={(val) => handleFieldChange(item.id, 'description', val)}
                  isSaving={savingId === item.id}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Reusable editable cell component
function EditableCell({ value, onSave, isSaving, type = 'text' }) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleBlur = () => {
    if (tempValue !== value) {
      onSave(tempValue);
    }
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setTempValue(value);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <td>
        <input
          type={type}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="editable-input"
        />
      </td>
    );
  }

  return (
    <td
      onClick={() => setEditing(true)}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      {value}
      {isSaving && <span className="saving-indicator">💾</span>}
    </td>
  );
}