// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
    @title PromptPayroll
    @author wurbs
    @dev Requires minimum employee salary of around 0.0001ETH to work properly
    due to floating point limitations.
    WIP.
*/

import "./Ownable.sol";
import "./PromptPayrollEvents.sol";

contract PromptPayroll is Ownable, PromptPayrollEvents {
    string public companyName;

    struct Employee {
        uint id;
        bool isActive;
        uint salary;
        uint balance;
        uint lastWithdrawal; // time of last withdrawal, or start of month if no withdrawals were made.
    }

    mapping(address => Employee) public employees;
    address payable[] public employeeAddresses;
    uint public monthStart;
    uint public monthDuration;

    constructor(string memory newCompanyName, address newOwner) {
        companyName = newCompanyName;
        transferOwnership(newOwner);
        emit CompanyOpened(companyName, newOwner);
    }

    function changeCompanyName(
        string calldata newCompanyName
    ) external onlyOwner {
        string memory previousName = companyName;
        companyName = newCompanyName;
        emit CompanyNameChanged(previousName, companyName);
    }

    function addEmployee(
        address payable employeeAddress,
        uint salary
    ) external onlyOwner {
        employees[employeeAddress] = Employee(
            employeeAddresses.length,
            true,
            salary,
            0,
            0
        );
        employeeAddresses.push(employeeAddress);
        emit EmployeeAdded(
            employeeAddresses.length - 1,
            employeeAddress,
            salary
        );
    }

    function getEmployeeId(
        address employeeAddress
    ) public view returns (uint id) {
        return employees[employeeAddress].id;
    }

    function getEmployees()
        public
        view
        returns (address payable[] memory allEmployees)
    {
        return employeeAddresses;
    }

    function getActiveEmployees()
        public
        view
        returns (address payable[] memory activeEmployees)
    {
        uint activeCount = 0;
        for (uint i = 0; i < employeeAddresses.length; i++) {
            if (employees[employeeAddresses[i]].isActive) {
                activeCount++;
            }
        }

        activeEmployees = new address payable[](activeCount);
        uint index = 0;
        for (uint i = 0; i < employeeAddresses.length; i++) {
            if (employees[employeeAddresses[i]].isActive) {
                activeEmployees[index++] = employeeAddresses[i];
            }
        }
    }

    function totalSalaries() public view returns (uint total) {
        total = 0;
        for (uint i = 0; i < employeeAddresses.length; i++) {
            if (employees[employeeAddresses[i]].isActive) {
                total += employees[employeeAddresses[i]].salary;
            }
        }
    }

    // Used before salary is issued, or if accrued salary is negligible (less than 1 wei)
    function deactivateEmployee(uint employeeId) external onlyOwner {
        employees[employeeAddresses[employeeId]].isActive = false;
        emit EmployeeDeactivated(employeeId, employeeAddresses[employeeId]);
    }

    function updateSalary(
        uint employeeId,
        uint newSalary
    ) external payable onlyOwner {
        require(
            newSalary != employees[employeeAddresses[employeeId]].salary,
            "Salary is the same."
        );
        uint previousSalary = employees[employeeAddresses[employeeId]].salary;
        employees[employeeAddresses[employeeId]].salary = newSalary;

        if (previousSalary > newSalary) {
            uint diff = previousSalary - newSalary;
            employees[employeeAddresses[employeeId]].balance -= diff;
            (bool success, ) = msg.sender.call{value: diff}("");
            require(success, "Excess salary refund failed");
        } else if (previousSalary < newSalary) {
            uint diff = newSalary - previousSalary;
            require(
                msg.value == diff,
                "You didn't top up the salary increment!"
            );
            employees[employeeAddresses[employeeId]].balance += diff;
        }

        emit SalaryUpdated(employeeId, previousSalary, newSalary);
    }

    function depositSalaries(uint daysInMonth) external payable onlyOwner {
        // Check that correct total salary is deposited
        require(msg.value == totalSalaries(), "Wrong total salary deposited");

        // Clear unclaimed balances for all active employees
        for (uint i = 0; i < employeeAddresses.length; i++) {
            if (employees[employeeAddresses[i]].balance > 0) {
                if (employees[employeeAddresses[i]].isActive) {
                    uint remainingBal = employees[employeeAddresses[i]].balance;
                    employees[employeeAddresses[i]].balance = 0;
                    (bool success, ) = employeeAddresses[i].call{
                        value: remainingBal
                    }("");
                    require(success, "End of month payment unsuccessful");
                    employees[employeeAddresses[i]].lastWithdrawal = block
                        .timestamp;
                }
            }
        }

        // Deposit fresh salaries
        for (uint i = 0; i < employeeAddresses.length; i++) {
            if (employees[employeeAddresses[i]].isActive) {
                employees[employeeAddresses[i]].balance = employees[
                    employeeAddresses[i]
                ].salary;
                employees[employeeAddresses[i]].lastWithdrawal = block
                    .timestamp;
            }
        }

        // Set month start and no. of days
        monthStart = block.timestamp;
        monthDuration = (daysInMonth) * 1 days;

        emit SalariesDeposited(msg.value, daysInMonth, block.timestamp);
    }

    function withdrawableSalary(
        address employeeAddress
    ) public view returns (uint withdrawable) {
        withdrawable =
            ((block.timestamp - employees[employeeAddress].lastWithdrawal) *
                employees[employeeAddress].salary) /
            monthDuration;
    }

    function withdrawSalary() public onlyEmployee {
        uint withdrawable = withdrawableSalary(msg.sender);
        require(withdrawable > 0, "No salary available to withdraw!");
        // This should logically never happen
        require(
            withdrawable <= employees[msg.sender].balance,
            "Your balance is insufficient"
        );

        employees[msg.sender].lastWithdrawal = block.timestamp;
        employees[msg.sender].balance -= withdrawable;
        (bool success, ) = msg.sender.call{value: withdrawable}("");
        require(success, "Withdrawal unsuccessful");

        emit SalaryWithdrawal(
            employees[msg.sender].id,
            withdrawable,
            block.timestamp
        );
    }

    function terminateEmployee(uint employeeId) external onlyOwner {
        require(
            employees[employeeAddresses[employeeId]].isActive,
            "Employee is not active."
        );
        // Flip from active to inactive.
        employees[employeeAddresses[employeeId]].isActive = false;

        // Get employee / employer balance and pay.
        // Salary is multiplied first because (elapsedTime/monthDuration) will result in rounding to 0.
        // This requires a minimum salary of around 0.0001 ETH.
        uint dueBalance = ((block.timestamp -
            employees[employeeAddresses[employeeId]].lastWithdrawal) *
            employees[employeeAddresses[employeeId]].salary) / monthDuration;

        employees[employeeAddresses[employeeId]].lastWithdrawal = block
            .timestamp;

        uint unspentBalance = employees[employeeAddresses[employeeId]].salary -
            dueBalance;

        (bool dueSuccess, ) = employeeAddresses[employeeId].call{
            value: dueBalance
        }("");
        require(dueSuccess, "Payment to employee failed");

        (bool unspentSuccess, ) = payable(msg.sender).call{
            value: unspentBalance
        }("");
        require(unspentSuccess, "Withdrawal of unspent salary failed");

        emit EmployeeTerminated(employeeId, dueBalance, unspentBalance);
    }

    function viewBalance(
        address employeeAddress
    ) public view returns (uint balance) {
        return employees[employeeAddress].balance;
    }

    function totalBalances() public view returns (uint total) {
        total = 0;
        for (uint i = 0; i < employeeAddresses.length; i++) {
            if (employees[employeeAddresses[i]].isActive) {
                total += viewBalance(employeeAddresses[i]);
            }
        }
    }

    function changeAddress(address payable newAddress) external onlyEmployee {
        uint employeeId = getEmployeeId(msg.sender);
        Employee memory employee = employees[msg.sender];

        employees[newAddress] = employee;
        employeeAddresses[employeeId] = newAddress;

        employees[msg.sender].isActive = false;
        employees[msg.sender].balance = 0;
        employees[msg.sender].lastWithdrawal = 0;

        emit EmployeeAddressChanged(employeeId, msg.sender, newAddress);
    }

    function closeCompany() external onlyOwner {
        // Pay all employee payments due
        for (uint i = 0; i < employeeAddresses.length; i++) {
            if (employees[employeeAddresses[i]].isActive) {
                uint dueBalance = ((block.timestamp -
                    employees[employeeAddresses[i]].lastWithdrawal) *
                    employees[employeeAddresses[i]].salary) / monthDuration;

                (bool success, ) = employeeAddresses[i].call{value: dueBalance}(
                    ""
                );
                require(success, "Payment of due balances failed.");
            }
        }
        // Withdraw unspent balances
        (bool withdrawSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(withdrawSuccess, "Withdrawal of unspent balances failed");

        string memory previousCompanyName = companyName;
        companyName = "This company has been closed.";

        emit CompanyClosed(previousCompanyName, block.timestamp);
    }

    function isEmployee(
        address employeeAddress
    ) public view returns (bool employee) {
        for (uint i = 0; i < employeeAddresses.length; i++) {
            if (
                employeeAddress == employeeAddresses[i] &&
                employees[employeeAddress].isActive
            ) return true;
        }
    }

    modifier onlyEmployee() {
        require(isEmployee(msg.sender), "You are not an active employee!");
        _;
    }
}
