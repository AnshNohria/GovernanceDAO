# Governance DAO

A decentralized autonomous organization (DAO) built with Foundry and React. This project demonstrates how to create a governance system where token holders can propose and vote on changes to a smart contract.

## Features

- **ERC20 Governance Token**: Token holders have voting power
- **Governor Contract**: Handles proposal creation and voting
- **TimeLock**: Enforces delays on governance decisions
- **Box Contract**: Example contract that can be governed by the DAO
- **React Frontend**: User-friendly interface for interacting with the DAO

## Smart Contracts

- `GovToken.sol`: ERC20 token with voting capabilities
- `MyGovernor.sol`: Main governance contract based on OpenZeppelin Governor
- `TimeLock.sol`: TimeLock controller for delayed execution
- `Box.sol`: Simple storage contract controlled by governance

## Quick Start

### Prerequisites

- [Foundry](https://getfoundry.sh/)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MetaMask](https://metamask.io/) browser extension

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AnshNohria/GovernanceDAO.git
cd foundry-dao
```

2. **Important**: Initialize git submodules (required for dependencies):
```bash
git submodule update --init --recursive
```

3. Install Foundry dependencies:
```bash
forge install
```

4. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

**Alternative**: Use the setup script for automatic setup:
```bash
chmod +x setup.sh
./setup.sh
```

### Development

1. Start a local blockchain:
```bash
anvil
```

2. Deploy the contracts:
```bash
forge script script/DeployGovernance.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
```

3. Start the frontend:
```bash
cd frontend
npm run dev
```

4. Open your browser to `http://localhost:3000`

5. Connect MetaMask to the local network:
   - Network: `http://localhost:8545`
   - Chain ID: `31337`
   - Import the test account with private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

### Testing

Run the test suite:
```bash
forge test
```

Run tests with verbosity:
```bash
forge test -vvv
```

### Troubleshooting

**Build fails with "Source not found" errors:**
- Ensure git submodules are initialized: `git submodule update --init --recursive`
- Run `forge install` to install dependencies
- Check that `lib/` directory contains `forge-std` and `openzeppelin-contracts`

**GitHub Actions failing:**
- The CI workflow automatically handles submodule initialization
- Ensure the `.gitmodules` file is committed to the repository

### How It Works

1. **Token Distribution**: The governance token (GOV) is minted to users
2. **Delegation**: Users must delegate their tokens to activate voting power
3. **Proposal Creation**: Token holders can create proposals to change the Box value
4. **Voting**: Token holders vote on proposals during the voting period
5. **Execution**: Successful proposals are queued and executed after the timelock delay

### Frontend Features

- **Wallet Connection**: Connect MetaMask to interact with the DAO
- **Proposal Creation**: Create new governance proposals
- **Voting Interface**: Vote on active proposals
- **Real-time Updates**: See current proposal status and voting results
- **Box Contract Monitor**: View the current Box value

### Project Structure

```
foundry-dao/
├── src/                    # Smart contracts
├── test/                   # Contract tests
├── script/                 # Deployment scripts
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   └── addresses.json  # Contract addresses (generated)
│   └── package.json
├── foundry.toml           # Foundry configuration
└── README.md
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### License

This project is licensed under the MIT License - see the LICENSE file for details.

### Acknowledgments

- Built with [Foundry](https://getfoundry.sh/)
- Uses [OpenZeppelin](https://openzeppelin.com/) contracts
- Frontend built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Blockchain interaction via [ethers.js](https://docs.ethers.org/)
