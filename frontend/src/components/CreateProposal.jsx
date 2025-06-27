import React, { useState } from 'react';
import { ethers } from 'ethers';

const CreateProposal = ({ onCreateProposal, boxContract }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [boxValue, setBoxValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      // Create proposal to update box value
      const targets = [boxContract?.target || '0x0000000000000000000000000000000000000000'];
      const values = [0];
      const calldatas = [
        ethers.Interface.from(['function store(uint256 value)']).encodeFunctionData('store', [boxValue])
      ];
      const fullDescription = `${title}\n\n${description}`;

      const result = await onCreateProposal({
        targets,
        values,
        calldatas,
        description: fullDescription
      });

      if (result.success) {
        setStatus({ type: 'success', message: result.message });
        setTitle('');
        setDescription('');
        setBoxValue('');
      } else {
        setStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to create proposal' });
    }

    setLoading(false);
  };

  return (
    <div className="card">
      <h2>Create Proposal</h2>
      
      {status && (
        <div className={`status ${status.type}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Proposal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          required
        />
        
        <textarea
          placeholder="Proposal Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea"
          required
        />
        
        <input
          type="number"
          placeholder="New Box Value"
          value={boxValue}
          onChange={(e) => setBoxValue(e.target.value)}
          className="input"
          required
        />
        
        <button 
          type="submit" 
          className="button"
          disabled={loading || !title || !description || !boxValue}
        >
          {loading ? 'Creating...' : 'Create Proposal'}
        </button>
      </form>

      <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
        <p><strong>Note:</strong> This demo creates proposals to update the Box contract value. In a real DAO, you could create proposals for any governance action.</p>
      </div>
    </div>
  );
};

export default CreateProposal;
