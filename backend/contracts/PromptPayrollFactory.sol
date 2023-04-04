// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PromptPayroll.sol";

contract PromptPayrollFactory is Ownable {
    address[] public deployedContracts;

    function createNewContract(string calldata _companyName) external {
        PromptPayroll promptPayroll = new PromptPayroll(
            _companyName,
            msg.sender
        );
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
