import React, { useState } from 'react';

const ProposalList = ({ proposals, onVote, votingPower }) => {
  const [voting, setVoting] = useState({});
  const [status, setStatus] = useState('');

  const handleVote = async (proposalId, support) => {
    setVoting({ ...voting, [proposalId]: true });
    setStatus('');

    try {
      const result = await onVote(proposalId, support);
      
      if (result.success) {
        setStatus({ type: 'success', message: result.message });
      } else {
        setStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to cast vote' });
    }

    setVoting({ ...voting, [proposalId]: false });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'pending';
      case 'active': return 'active';
      case 'succeeded': return 'succeeded';
      case 'executed': return 'executed';
      default: return 'pending';
    }
  };

  const getVoteLabel = (support) => {
    switch (support) {
      case 0: return 'Against';
      case 1: return 'For';
      case 2: return 'Abstain';
      default: return 'Unknown';
    }
  };

  return (
    <div className="card">
      <h2>Active Proposals</h2>
      
      {status && (
        <div className={`status ${status.type}`}>
          {status.message}
        </div>
      )}

      {proposals.length === 0 ? (
        <p>No proposals found. Create the first proposal!</p>
      ) : (
        proposals.map((proposal) => (
          <div key={proposal.id} className="proposal-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <h3>{proposal.title}</h3>
              <span className={`proposal-status ${getStatusColor(proposal.status)}`}>
                {proposal.status}
              </span>
            </div>
            
            <p>{proposal.description}</p>
            
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem' }}>
                <span>👍 For: {proposal.forVotes}</span>
                <span>👎 Against: {proposal.againstVotes}</span>
                <span>🤷 Abstain: {proposal.abstainVotes}</span>
              </div>
            </div>

            {proposal.status === 'Active' && votingPower !== '0' && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="button"
                  onClick={() => handleVote(proposal.id, 1)}
                  disabled={voting[proposal.id]}
                  style={{ background: '#28a745' }}
                >
                  {voting[proposal.id] ? 'Voting...' : 'Vote For'}
                </button>
                
                <button
                  className="button"
                  onClick={() => handleVote(proposal.id, 0)}
                  disabled={voting[proposal.id]}
                  style={{ background: '#dc3545' }}
                >
                  {voting[proposal.id] ? 'Voting...' : 'Vote Against'}
                </button>
                
                <button
                  className="button"
                  onClick={() => handleVote(proposal.id, 2)}
                  disabled={voting[proposal.id]}
                  style={{ background: '#6c757d' }}
                >
                  {voting[proposal.id] ? 'Voting...' : 'Abstain'}
                </button>
              </div>
            )}

            {votingPower === '0' && (
              <div className="status info" style={{ marginTop: '10px' }}>
                You need voting power to participate in this proposal.
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ProposalList;
