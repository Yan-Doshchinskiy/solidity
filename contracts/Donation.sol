// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Donation {
    address owner;
    address[] public sponsors;
    mapping(address => uint256) public payments;

    constructor() public{
        owner = msg.sender;
    }

    modifier _ownerOnly(){
        require(msg.sender == owner);
    }

    function withdraw(address payable recipient, uint256 amount) public _ownerOnly {
        require(amount <= this.getBalance(), "amount exceeds Donation contract balance");
        recipient.transfer(amount);
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function getSponsors() external view returns(address[] memory){
        return sponsors;
    }

    receive() external payable {
        if (payments[msg.sender]) {
            sponsors.push(msg.sender);
        }
        payments[msg.sender] += msg.value;
    }
}
