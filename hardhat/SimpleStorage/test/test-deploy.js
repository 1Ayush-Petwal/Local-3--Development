const { ethers } = require("hardhat")
const { assert, expect } = require("chai")

describe("SimpleStorage", function () {

  let factory, contract;
  this.beforeEach(async function () {
    factory = await ethers.getContractFactory("SimpleStorage")
    contract = await factory.deploy();
  })

  it("Should start with fav number 0", async function () {
    const currentValue = await contract.reterive();
    const expectedValue = "0"
    // Using assert and expect defined funcitons from Chai ( test runner )
    assert.equal(currentValue.toString(), expectedValue)
    // for the expect alternative 
    // expect(currentValue.toString().to.equal(expectedValue))
  })


  it("Should update value on calling the store", async function () {
    const expectedValue = "7"
    const transactionResp = await contract.store(expectedValue);
    await transactionResp.wait(1)

    const currentValue = await contract.reterive()
    assert.equal(currentValue, expectedValue)
  })
})