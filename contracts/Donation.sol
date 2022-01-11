// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Donation {
    address owner;
    address[] public sponsors;
    uint256 totalAmount;
    mapping(address => uint256) public payments;

    constructor() {
        owner = msg.sender;
    }

    modifier _ownerOnly(){
        require(msg.sender == owner, 'only owner can do this');
        _;
    }

    function withdraw(address payable recipient, uint256 amount) external _ownerOnly {
//        require(amount <= this.getBalance(), "amount exceeds Donation contract balance");
        recipient.transfer(amount);
    }

    function getBalance() external view returns(uint) {
        return address(this).balance;
    }
    function getOwner() external view returns(address){
        return owner;
    }
    function getSponsors() external view returns(address[] memory){
        return sponsors;
    }
    function getTotalAmount() external view returns(uint){
        return totalAmount;
    }

    receive() external payable {
        if (payments[msg.sender] == 0) {
            sponsors.push(msg.sender);
        }
        payments[msg.sender] += msg.value;
        totalAmount += msg.value;
    }
}
