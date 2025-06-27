import React from 'react';

const WalletConnection = ({ onConnect }) => {
  return (
    <div className="connect-wallet">
      <div className="card">
        <h2>Connect Your Wallet</h2>
        <p>To participate in governance, please connect your MetaMask wallet.</p>
        <button className="button" onClick={onConnect}>
          Connect MetaMask
        </button>
      </div>
    </div>
  );
};

export default WalletConnection;
