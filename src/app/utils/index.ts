import { ethers } from "ethers"
import { Farcast } from "../abi/contractABI"
import { FrameRequest } from "@coinbase/onchainkit"

const rpcUrl = "https://sepolia.base.org";
const contractAddress = process.env.CONTRACT_ADDRESS as string;

export const getWallet = (privateKey: any) => {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    return new ethers.Wallet(privateKey, provider);
};

export const getContract = (wallet: any) => {
    return new ethers.Contract(contractAddress, Farcast.abi, wallet);
};

export const checkAvailability = async (body: FrameRequest) => {
    const PK = process.env.HOTWALLET_PRIVATE_KEY;
    const { untrustedData } = body;

    const wallet = getWallet(PK);
    const contract = getContract(wallet);

    const data = await contract.isHashtagMinted(untrustedData.inputText);
    return data;
};

export const mintHashtags = async (body: FrameRequest) => {
    const PK = process.env.HOTWALLET_PRIVATE_KEY;
    const { untrustedData } = body;

    const wallet = getWallet(PK);
    const contract = getContract(wallet);

    const recipientAddress = process.env.RECIPIENT_ADDRESS;
    const data = await contract.safeMint(recipientAddress, untrustedData.inputText);
    return data;
};
