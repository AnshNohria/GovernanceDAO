// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {Box} from "src/Box.sol";
import {GovToken} from "src/GovToken.sol";
import {TimeLock} from "src/Timelock.sol";
import {MyGovernor} from "src/MyGovernor.sol";

contract DeployGovernance is Script {
    uint256 public constant MINDELAY = 3600; // 1 hour
    address public immutable USER = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266; // Default Anvil address

    function run() external {
        vm.startBroadcast();

        // Deploy contracts
        Box box = new Box();
        GovToken govToken = new GovToken();

        // Mint tokens to deployer
        govToken.mint(USER, 100 ether);

        // Delegate tokens to self for voting power
        govToken.delegate(USER);

        // Deploy TimeLock with empty arrays (no initial proposers/executors)
        address[] memory proposers = new address[](0);
        address[] memory executors = new address[](0);
        TimeLock timeLock = new TimeLock(MINDELAY, proposers, executors);

        // Deploy Governor
        MyGovernor governor = new MyGovernor(govToken, timeLock);

        // Setup roles
        bytes32 proposerRole = timeLock.PROPOSER_ROLE();
        bytes32 executorRole = timeLock.EXECUTOR_ROLE();
        bytes32 adminRole = timeLock.DEFAULT_ADMIN_ROLE();

        // Grant roles
        timeLock.grantRole(proposerRole, address(governor));
        timeLock.grantRole(executorRole, address(0)); // Anyone can execute
        timeLock.revokeRole(adminRole, USER); // Remove deployer admin rights

        // Transfer box ownership to TimeLock
        box.transferOwnership(address(timeLock));

        vm.stopBroadcast();

        // Log deployed addresses
        console2.log("=== Deployment Complete ===");
        console2.log("Box:", address(box));
        console2.log("GovToken:", address(govToken));
        console2.log("TimeLock:", address(timeLock));
        console2.log("Governor:", address(governor));
        console2.log("===========================");

        // Create addresses.json for frontend
        string memory json = string(
            abi.encodePacked(
                "{\n",
                '  "BOX": "',
                vm.toString(address(box)),
                '",\n',
                '  "GOVTOKEN": "',
                vm.toString(address(govToken)),
                '",\n',
                '  "TIMELOCK": "',
                vm.toString(address(timeLock)),
                '",\n',
                '  "GOVERNOR": "',
                vm.toString(address(governor)),
                '"\n',
                "}"
            )
        );

        vm.writeFile("frontend/src/addresses.json", json);
        console2.log("Contract addresses saved to frontend/src/addresses.json");
    }
}
