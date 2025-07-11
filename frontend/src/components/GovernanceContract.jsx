import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CreateProposal from './CreateProposal';
import ProposalList from './ProposalList';
import BoxContract from './BoxContract';

// Import contract addresses (will be generated by deployment script)
import CONTRACT_ADDRESSES from '../addresses.json';

// Contract ABIs (simplified for demo)
const GOVERNOR_ABI = [
  "function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description) public returns (uint256)",
  "function castVote(uint256 proposalId, uint8 support) public returns (uint256)",
  "function castVoteWithReason(uint256 proposalId, uint8 support, string calldata reason) public returns (uint256)",
  "function state(uint256 proposalId) public view returns (uint8)",
  "function proposalSnapshot(uint256 proposalId) public view returns (uint256)",
  "function proposalDeadline(uint256 proposalId) public view returns (uint256)",
  "function getVotes(address account, uint256 blockNumber) public view returns (uint256)",
  "function votingDelay() public view returns (uint256)",
  "function votingPeriod() public view returns (uint256)",
  "function quorum(uint256 blockNumber) public view returns (uint256)",
  "function queue(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash) public returns (uint256)",
  "function execute(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash) public payable returns (uint256)",
  "event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)"
];

const GOVTOKEN_ABI = [
  "function balanceOf(address account) public view returns (uint256)",
  "function delegate(address delegatee) public",
  "function delegates(address account) public view returns (address)",
  "function getVotes(address account) public view returns (uint256)"
];

const BOX_ABI = [
  "function store(uint256 value) public",
  "function retrieve() public view returns (uint256)",
  "function owner() public view returns (address)"
];

const GovernanceContract = ({ provider, signer, account, onDisconnect }) => {
  const [governorContract, setGovernorContract] = useState(null);
  const [govTokenContract, setGovTokenContract] = useState(null);
  const [boxContract, setBoxContract] = useState(null);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [votingPower, setVotingPower] = useState('0');
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeContracts();
  }, [signer]);

  const initializeContracts = async () => {
    if (!signer) return;

    try {
      // Initialize contracts (using placeholder addresses for now)
      // In a real deployment, you'd use the actual deployed contract addresses
      const governor = new ethers.Contract(CONTRACT_ADDRESSES.GOVERNOR, GOVERNOR_ABI, signer);
      const govToken = new ethers.Contract(CONTRACT_ADDRESSES.GOVTOKEN, GOVTOKEN_ABI, signer);
      const box = new ethers.Contract(CONTRACT_ADDRESSES.BOX, BOX_ABI, signer);

      setGovernorContract(governor);
      setGovTokenContract(govToken);
      setBoxContract(box);

      // Load user data
      await loadUserData(govToken);
      await loadProposals(governor);
      
      setLoading(false);
    } catch (error) {
      console.error('Error initializing contracts:', error);
      setLoading(false);
    }
  };

  const loadUserData = async (govToken) => {
    try {
      const balance = await govToken.balanceOf(account);
      const votes = await govToken.getVotes(account);
      
      setTokenBalance(ethers.formatEther(balance));
      setVotingPower(ethers.formatEther(votes));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadProposals = async (governor) => {
    try {
      // In a real app, you'd query events or maintain a list of proposal IDs
      // For demo purposes, we'll show placeholder data
      setProposals([
        {
          id: 1,
          title: "Update Box Value to 777",
          description: "Proposal to update the box contract value to 777",
          status: "Active",
          forVotes: "1000",
          againstVotes: "50",
          abstainVotes: "25"
        }
      ]);
    } catch (error) {
      console.error('Error loading proposals:', error);
    }
  };

  const createProposal = async (proposalData) => {
    if (!governorContract) return;

    try {
      const { targets, values, calldatas, description } = proposalData;
      
      const tx = await governorContract.propose(targets, values, calldatas, description);
      await tx.wait();
      
      // Reload proposals
      await loadProposals(governorContract);
      
      return { success: true, message: 'Proposal created successfully!' };
    } catch (error) {
      console.error('Error creating proposal:', error);
      return { success: false, message: error.message };
    }
  };

  const castVote = async (proposalId, support, reason = '') => {
    if (!governorContract) return;

    try {
      let tx;
      if (reason) {
        tx = await governorContract.castVoteWithReason(proposalId, support, reason);
      } else {
        tx = await governorContract.castVote(proposalId, support);
      }
      
      await tx.wait();
      
      // Reload proposals
      await loadProposals(governorContract);
      
      return { success: true, message: 'Vote cast successfully!' };
    } catch (error) {
      console.error('Error casting vote:', error);
      return { success: false, message: error.message };
    }
  };

  const delegateTokens = async (delegatee) => {
    if (!govTokenContract) return;

    try {
      const tx = await govTokenContract.delegate(delegatee);
      await tx.wait();
      
      // Reload user data
      await loadUserData(govTokenContract);
      
      return { success: true, message: 'Tokens delegated successfully!' };
    } catch (error) {
      console.error('Error delegating tokens:', error);
      return { success: false, message: error.message };
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Loading governance data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Account Info</h2>
            <p><strong>Address:</strong> {account}</p>
            <p><strong>Token Balance:</strong> {tokenBalance} GOV</p>
            <p><strong>Voting Power:</strong> {votingPower} GOV</p>
          </div>
          <button className="button" onClick={onDisconnect}>
            Disconnect
          </button>
        </div>
        
        {votingPower === '0' && tokenBalance !== '0' && (
          <div className="status info">
            <p>You have tokens but no voting power. Delegate to yourself to activate voting power.</p>
            <button 
              className="button" 
              onClick={() => delegateTokens(account)}
            >
              Self-Delegate
            </button>
          </div>
        )}
      </div>

      <div className="grid">
        <CreateProposal 
          onCreateProposal={createProposal}
          boxContract={boxContract}
        />
        
        <ProposalList 
          proposals={proposals}
          onVote={castVote}
          votingPower={votingPower}
        />
      </div>

      <BoxContract 
        boxContract={boxContract}
        provider={provider}
      />
    </div>
  );
};

export default GovernanceContract;
