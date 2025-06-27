import React, { useState, useEffect } from 'react';

const BoxContract = ({ boxContract, provider }) => {
  const [currentValue, setCurrentValue] = useState('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoxValue();
  }, [boxContract]);

  const loadBoxValue = async () => {
    if (!boxContract) return;

    try {
      // For demo purposes, we'll show a placeholder value
      // In a real app, you'd call: const value = await boxContract.retrieve();
      setCurrentValue('0');
      setLoading(false);
    } catch (error) {
      console.error('Error loading box value:', error);
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>📦 Box Contract Status</h2>
      
      {loading ? (
        <p>Loading box value...</p>
      ) : (
        <div>
          <div style={{ fontSize: '2rem', textAlign: 'center', margin: '20px 0' }}>
            Current Value: <strong>{currentValue}</strong>
          </div>
          
          <div className="status info">
            <p>
              <strong>How it works:</strong> The Box contract stores a single value that can only be updated through governance proposals. 
              Create a proposal to change this value, and if it passes, the new value will be displayed here.
            </p>
          </div>
          
          <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '15px' }}>
            <p><strong>Contract Features:</strong></p>
            <ul>
              <li>Only the TimeLock contract (controlled by governance) can update the value</li>
              <li>Anyone can read the current value</li>
              <li>All changes must go through the DAO voting process</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoxContract;
