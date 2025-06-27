// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "lib/forge-std/src/Test.sol";
import {console2} from "lib/forge-std/src/console2.sol";
import {Box} from "src/Box.sol";
import {MyGovernor} from "src/MyGovernor.sol";
import {GovToken} from "src/GovToken.sol";
import {TimeLock} from "src/Timelock.sol";

contract GovernorTest is Test {
    Box public box;
    GovToken public govToken;
    TimeLock public timeLock;
    MyGovernor public governor;
    address public immutable USER = makeAddr("user");
    uint256 public constant MINDELAY = 3600;
    address[] _proposers;
    address[] _executors;
    bytes[] functioncalldata;
    address[] functiontargets;
    uint256[] functionvalues;

    function setUp() public {
        box = new Box();
        govToken = new GovToken();
        govToken.mint(USER, 100 ether);

        vm.startPrank(USER);
        govToken.delegate(USER);
        timeLock = new TimeLock(MINDELAY, _proposers, _executors);
        governor = new MyGovernor(govToken, timeLock);
        bytes32 proposer_role = timeLock.PROPOSER_ROLE();
        bytes32 executor_role = timeLock.EXECUTOR_ROLE();
        bytes32 admin_role = timeLock.TIMELOCK_ADMIN_ROLE();
        timeLock.grantRole(proposer_role, address(governor));
        timeLock.grantRole(executor_role, address(0));
        timeLock.revokeRole(admin_role, address(USER));
        vm.stopPrank();
        box.transferOwnership(address(timeLock));
    }

    function testcantupdatethebox() public {
        vm.expectRevert();
        box.store(1);
    }

    function testUpdatetheboxstore() public {
        // Setup proposal
        uint256 valueToStore = 777;
        string memory description = "Store 777 in Box";
        bytes memory callData = abi.encodeWithSignature("store(uint256)", valueToStore);

        functiontargets.push(address(box));
        functionvalues.push(0);
        functioncalldata.push(callData);

        // Create proposal
        vm.prank(USER);
        uint256 proposalId = governor.propose(functiontargets, functionvalues, functioncalldata, description);
        assertEq(uint256(governor.state(proposalId)), 0); // Pending

        // Wait for voting delay
        vm.warp(block.timestamp + governor.votingDelay() + 1);
        vm.roll(block.number + governor.votingDelay() + 1);
        assertEq(uint256(governor.state(proposalId)), 1); // Active
        string memory reason = "I like this proposal";
        // Cast vote
        vm.prank(USER);
        governor.castVoteWithReason(proposalId, 1, reason);

        // Wait for voting period
        vm.warp(block.timestamp + governor.votingPeriod() + 1);
        vm.roll(block.number + governor.votingPeriod() + 1);
        assertEq(uint256(governor.state(proposalId)), 4); // Succeeded

        // Queue
        bytes32 descriptionHash = keccak256(bytes(description));
        governor.queue(functiontargets, functionvalues, functioncalldata, descriptionHash);
        assertEq(uint256(governor.state(proposalId)), 5); // Queued

        // Wait timelock delay
        vm.warp(block.timestamp + MINDELAY + 1);
        vm.roll(block.number + 1);

        governor.execute(functiontargets, functionvalues, functioncalldata, descriptionHash);
        assertEq(uint256(governor.state(proposalId)), 7); // Executed

        // Verify
        assertEq(box.retrieve(), valueToStore);
    }
}
