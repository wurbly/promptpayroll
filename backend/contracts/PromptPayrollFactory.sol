// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PromptPayroll.sol";

contract PromptPayrollFactory {
    address[] public deployedContracts;

    function createNewContract(string calldata newCompanyName) external {
        PromptPayroll promptPayroll = new PromptPayroll(newCompanyName, msg.sender);
        deployedContracts.push(address(promptPayroll));
    }

    function getDeployedContracts()
        public
        view
        returns (address[] memory _deployedContracts)
    {
        return deployedContracts;
    }
}
