import React from 'react';
import '../styles/PriceListTable.css';

// Static data - I WILL REPLACE WITH API CALL LATER
const priceListData = [
  {
    articleNo: '1234567890',
    product: 'This is a test product with fifty characters this!',
    inPrice: '900500',
    price: '1500800',
    unit: 'km/h',
    description: 'This is the description with fifty characters this…'
  }
];

const PriceListTable = () => {
  return (
    <div className="price-list-container">
      <div className="search-section">
        <div className="search-group">
          <input 
            type="text" 
            placeholder="Search Article No." 
            className="search-input"
            // TODO: Connect to backend search API
          />
          <button className="search-btn">🔍</button>
        </div>
        <div className="search-group">
          <input 
            type="text" 
            placeholder="Search Product ..." 
            className="search-input"
            // TODO: Connect to backend search API
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>


      <div className="action-buttons">
        <button className="btn">New Product </button>
        <button className="btn">Print List </button>
        <button className="btn">Advanced mode </button>
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
              <th></th> 
            </tr>
          </thead>
          <tbody>
            {priceListData.map((item, index) => (
              <tr key={index}>
                <td>{item.articleNo}</td>
                <td>{item.product}</td>
                <td>{item.inPrice}</td>
                <td>{item.price}</td>
                <td>{item.unit}</td>
                <td>{item.description}</td>
                <td className="ellipsis-cell">⋯</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceListTable;