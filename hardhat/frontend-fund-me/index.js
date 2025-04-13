
// In the front-end we use ES6 instead of common JS 
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi } from "./constants.js"
import { ContractAddr } from "./constants.js"

const connectBtn = document.getElementById("Connect-button")
const fundbtn = document.getElementById("fund-button")
const gtBalance = document.getElementById("balance-button")
const withdrw = document.getElementById("withdraw-button")
gtBalance.onclick = getBalance
connectBtn.onclick = connect
fundbtn.onclick = fund;
withdrw.onclick = withdraw
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        console.log(`Window.ethereum is ${window.ethereum}`)
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })  // Calling Metamask RPC
        } catch (error) {
            console.log(error);
        }
        console.log("Connected!!! ")
        connectBtn.innerHTML = "Connected"
        connectBtn.setAttribute("disabled", "true")

    } else {
        connectBtn.innerHTML = "Please install Metamask"
        connectBtn.setAttribute("disabled", "true")
    }
}

// fund function  
async function fund() {
    const ethAmount = `${document.getElementById("ethAmount").value}`
    console.log(`Funding with ${ethAmount}....`);
    if (typeof window.ethereum !== "undefined") {
        // provider  -> to interact with the blockchain
        // Contract ->  ABI and address
        // signer / wallet / someone with some gas 

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(ContractAddr, abi, signer);
        try {
            const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmount) })
            await listenTransactResponse(transactionResponse, provider)
            console.log("Done !!!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenTransactResponse(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    // listen for the transaction to finish with a receipt 
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                console.log(`Transaction with ${transactionReceipt.confirmations} confirmations`)
                resolve(); // NOTE: resolve inside the once()
            })
        } catch (error) {
            reject(error);
        }
    }
    )
}

async function getBalance(params) {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(ContractAddr);
        console.log(`balance is ${ethers.utils.formatEther(balance)}`)
    }
}

// withdraw function
async function withdraw() {
    if(typeof window.ethereum !== "undefined"){
        console.log("Withdrawing....")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(ContractAddr, abi, signer);
        try {
            const transactionResponse = await contract.withdraw()
            await listenTransactResponse(transactionResponse, provider)
            console.log("Withdtawing done... ")
        } catch (error) {
            console.log(error)
        } 
    }
}