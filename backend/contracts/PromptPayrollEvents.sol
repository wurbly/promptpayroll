// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PromptPayrollEvents {
    event CompanyOpened(
        string indexed companyName,
        address indexed companyOwner
    );
    event CompanyNameChanged(
        string indexed previousName,
        string indexed newName
    );
    event EmployeeAdded(
        uint indexed employeeId,
        address indexed employeeAddress,
        uint indexed employeeSalary
    );
    event EmployeeDeactivated(
        uint indexed employeeId,
        address indexed employeeAddress
    );
    event SalaryUpdated(
        uint indexed employeeId,
        uint indexed previousSalary,
        uint indexed newSalary
    );
    event SalariesDeposited(
        uint indexed totalDeposited,
        uint indexed numberOfDays,
        uint indexed monthStartTimestamp
    );
    event EmployeeTerminated(
        uint indexed employeeId,
        uint indexed dueSalaryPaid,
        uint indexed unusedSalaryRefunded
    );
    event SalaryWithdrawal(
        uint indexed employeeId,
        uint indexed amountWithdrawn,
        uint indexed timeWithdrawn
    );
    event EmployeeAddressChanged(
        uint indexed employeeId,
        address indexed previousAddress,
        address indexed newAddress
    );
    event CompanyClosed(string indexed companyName, uint indexed timeClosed);
}
