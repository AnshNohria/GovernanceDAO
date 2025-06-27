//SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {Box} from "src/Box.sol";
import {GovToken} from "src/GovToken.sol";
import {TimeLock} from "src/Timelock.sol";
import {MyGovernor} from "src/MyGovernor.sol";

contract InteractWithGovernance is Script {
    // These addresses will be updated after deployment
    address constant BOX_ADDRESS = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
    address constant GOVTOKEN_ADDRESS = 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512;
    address constant TIMELOCK_ADDRESS = 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0;
    address constant GOVERNOR_ADDRESS = 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);

        // Initialize contracts
        Box box = Box(BOX_ADDRESS);
        GovToken govToken = GovToken(GOVTOKEN_ADDRESS);
        MyGovernor governor = MyGovernor(payable(GOVERNOR_ADDRESS));

        console2.log("=== Governance Integration Test ===");
        console2.log("Deployer:", deployer);
        console2.log("Box current value:", box.retrieve());
        console2.log("Gov token balance:", govToken.balanceOf(deployer));
        console2.log("Voting power:", govToken.getVotes(deployer));

        // Create a proposal
        uint256 newValue = 42;
        string memory description = "Change Box value to 42";
        
        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);
        
        targets[0] = address(box);
        values[0] = 0;
        calldatas[0] = abi.encodeWithSignature("store(uint256)", newValue);

        uint256 proposalId = governor.propose(targets, values, calldatas, description);
        console2.log("Created proposal with ID:", proposalId);
        console2.log("Proposal state:", uint256(governor.state(proposalId)));

        vm.stopBroadcast();
        
        console2.log("=== Integration test completed ===");
        console2.log("Next steps:");
        console2.log("1. Wait for voting delay to pass");
        console2.log("2. Cast vote on proposal");
        console2.log("3. Wait for voting period to end");
        console2.log("4. Queue and execute proposal");
    }
}
