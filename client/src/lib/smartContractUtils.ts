import { ethers } from 'ethers';
import { toast } from '@/hooks/use-toast';

// Basic ABI for our Trade Finance Smart Contract
const tradeFinanceABI = [
  // Invoice Management
  "function createInvoice(string invoiceId, uint256 amount, address payable exporter, address importer, uint256 dueDate) external",
  "function approveInvoice(string invoiceId) external",
  "function payInvoice(string invoiceId) external payable",
  "function getInvoiceStatus(string invoiceId) external view returns (uint8)",
  
  // Letter of Credit
  "function createLetterOfCredit(string lcId, address importer, address payable exporter, uint256 amount, string terms) external payable",
  "function approveLCDocuments(string lcId) external",
  "function rejectLCDocuments(string lcId, string reason) external",
  "function releaseLCPayment(string lcId) external",
  
  // Supply Chain Finance
  "function createSupplyChainFinancing(string scfId, address payable supplier, address buyer, uint256 amount, uint256 interestRate, uint256 duration) external",
  "function approveSupplyChainFinancing(string scfId) external payable",
  "function repaySupplyChainFinancing(string scfId) external payable",
  
  // Events
  "event InvoiceCreated(string invoiceId, uint256 amount, address exporter, address importer, uint256 dueDate)",
  "event InvoiceApproved(string invoiceId, address approver)",
  "event InvoicePaid(string invoiceId, uint256 amount, address payer)",
  "event LetterOfCreditCreated(string lcId, address importer, address exporter, uint256 amount)",
  "event LetterOfCreditDocumentsApproved(string lcId, address approver)",
  "event LetterOfCreditDocumentsRejected(string lcId, string reason)",
  "event LetterOfCreditPaymentReleased(string lcId, uint256 amount)",
  "event SupplyChainFinancingCreated(string scfId, address supplier, address buyer, uint256 amount, uint256 interestRate)",
  "event SupplyChainFinancingApproved(string scfId, address approver, uint256 amount)",
  "event SupplyChainFinancingRepaid(string scfId, address payer, uint256 amount)"
];

// Smart contract address (would be deployed on a real network)
// For demo purposes, we'll use a placeholder address
const TRADE_FINANCE_CONTRACT_ADDRESS = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';

// Enum for Invoice statuses that matches our smart contract
export enum InvoiceStatus {
  CREATED = 0,
  APPROVED = 1,
  PAID = 2,
  REJECTED = 3,
  EXPIRED = 4
}

// Enum for Letter of Credit statuses
export enum LCStatus {
  CREATED = 0,
  DOCUMENTS_SUBMITTED = 1,
  DOCUMENTS_APPROVED = 2,
  DOCUMENTS_REJECTED = 3,
  PAYMENT_RELEASED = 4,
  EXPIRED = 5
}

// Types
export type Invoice = {
  id: string;
  amount: string;
  exporter: string;
  importer: string;
  dueDate: number;
  status: InvoiceStatus;
};

export type LetterOfCredit = {
  id: string;
  importer: string;
  exporter: string;
  amount: string;
  terms: string;
  status: LCStatus;
  rejectReason?: string;
};

export type SupplyChainFinancing = {
  id: string;
  supplier: string;
  buyer: string;
  amount: string;
  interestRate: string;
  duration: number;
  isApproved: boolean;
  isRepaid: boolean;
};

let provider: any = null;
let signer: any = null;
let tradeFinanceContract: any = null;

/**
 * Initialize Ethereum connection and contract
 */
export const initializeEthereum = async (): Promise<boolean> => {
  try {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: 'MetaMask not installed',
        description: 'Please install MetaMask to use blockchain features',
        variant: 'destructive',
      });
      return false;
    }
    
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Create ethers provider and signer
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    
    // Create contract instance
    tradeFinanceContract = new ethers.Contract(
      TRADE_FINANCE_CONTRACT_ADDRESS,
      tradeFinanceABI,
      signer
    );
    
    console.log('Ethereum connection initialized');
    return true;
    
  } catch (error: any) {
    console.error('Failed to initialize Ethereum connection:', error);
    toast({
      title: 'Connection Error',
      description: error.message || 'Failed to connect to blockchain',
      variant: 'destructive',
    });
    return false;
  }
};

/**
 * Create an invoice on the blockchain
 */
export const createInvoice = async (
  invoiceId: string,
  amount: string,
  exporterAddress: string,
  importerAddress: string,
  dueDate: number
): Promise<boolean> => {
  try {
    if (!tradeFinanceContract || !signer) {
      const initialized = await initializeEthereum();
      if (!initialized) return false;
    }
    
    // Convert amount to Wei (smallest Ethereum unit)
    const amountInWei = ethers.parseEther(amount);
    
    // Call the smart contract
    const tx = await tradeFinanceContract.createInvoice(
      invoiceId, 
      amountInWei, 
      exporterAddress, 
      importerAddress, 
      dueDate
    );
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    if (receipt.status === 1) {
      toast({
        title: 'Invoice Created',
        description: `Invoice ${invoiceId} has been created on the blockchain`,
        variant: 'default',
      });
      return true;
    } else {
      throw new Error('Transaction failed');
    }
    
  } catch (error: any) {
    console.error('Failed to create invoice:', error);
    toast({
      title: 'Invoice Creation Failed',
      description: error.message || 'Failed to create invoice on blockchain',
      variant: 'destructive',
    });
    return false;
  }
};

/**
 * Approve an invoice on the blockchain
 */
export const approveInvoice = async (invoiceId: string): Promise<boolean> => {
  try {
    if (!tradeFinanceContract || !signer) {
      const initialized = await initializeEthereum();
      if (!initialized) return false;
    }
    
    // Call the smart contract
    const tx = await tradeFinanceContract.approveInvoice(invoiceId);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    if (receipt.status === 1) {
      toast({
        title: 'Invoice Approved',
        description: `Invoice ${invoiceId} has been approved`,
        variant: 'default',
      });
      return true;
    } else {
      throw new Error('Transaction failed');
    }
    
  } catch (error: any) {
    console.error('Failed to approve invoice:', error);
    toast({
      title: 'Invoice Approval Failed',
      description: error.message || 'Failed to approve invoice on blockchain',
      variant: 'destructive',
    });
    return false;
  }
};

/**
 * Pay an invoice on the blockchain
 */
export const payInvoice = async (invoiceId: string, amount: string): Promise<boolean> => {
  try {
    if (!tradeFinanceContract || !signer) {
      const initialized = await initializeEthereum();
      if (!initialized) return false;
    }
    
    // Convert amount to Wei
    const amountInWei = ethers.parseEther(amount);
    
    // Call the smart contract with value
    const tx = await tradeFinanceContract.payInvoice(invoiceId, {
      value: amountInWei
    });
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    if (receipt.status === 1) {
      toast({
        title: 'Invoice Paid',
        description: `Invoice ${invoiceId} has been paid`,
        variant: 'default',
      });
      return true;
    } else {
      throw new Error('Transaction failed');
    }
    
  } catch (error: any) {
    console.error('Failed to pay invoice:', error);
    toast({
      title: 'Invoice Payment Failed',
      description: error.message || 'Failed to pay invoice on blockchain',
      variant: 'destructive',
    });
    return false;
  }
};

/**
 * Create a letter of credit on the blockchain
 */
export const createLetterOfCredit = async (
  lcId: string,
  importerAddress: string,
  exporterAddress: string,
  amount: string,
  terms: string
): Promise<boolean> => {
  try {
    if (!tradeFinanceContract || !signer) {
      const initialized = await initializeEthereum();
      if (!initialized) return false;
    }
    
    // Convert amount to Wei
    const amountInWei = ethers.parseEther(amount);
    
    // Call the smart contract with value
    const tx = await tradeFinanceContract.createLetterOfCredit(
      lcId,
      importerAddress,
      exporterAddress,
      amountInWei,
      terms,
      {
        value: amountInWei
      }
    );
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    if (receipt.status === 1) {
      toast({
        title: 'Letter of Credit Created',
        description: `LC ${lcId} has been created on the blockchain`,
        variant: 'default',
      });
      return true;
    } else {
      throw new Error('Transaction failed');
    }
    
  } catch (error: any) {
    console.error('Failed to create letter of credit:', error);
    toast({
      title: 'LC Creation Failed',
      description: error.message || 'Failed to create LC on blockchain',
      variant: 'destructive',
    });
    return false;
  }
};

/**
 * Create a supply chain financing on the blockchain
 */
export const createSupplyChainFinancing = async (
  scfId: string,
  supplierAddress: string,
  buyerAddress: string,
  amount: string,
  interestRate: number,
  duration: number
): Promise<boolean> => {
  try {
    if (!tradeFinanceContract || !signer) {
      const initialized = await initializeEthereum();
      if (!initialized) return false;
    }
    
    // Convert amount to Wei
    const amountInWei = ethers.parseEther(amount);
    
    // Convert interest rate to basis points (1% = 100 basis points)
    const interestRateBps = Math.round(interestRate * 100);
    
    // Call the smart contract
    const tx = await tradeFinanceContract.createSupplyChainFinancing(
      scfId,
      supplierAddress,
      buyerAddress,
      amountInWei,
      interestRateBps,
      duration
    );
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    if (receipt.status === 1) {
      toast({
        title: 'Supply Chain Financing Created',
        description: `SCF ${scfId} has been created on the blockchain`,
        variant: 'default',
      });
      return true;
    } else {
      throw new Error('Transaction failed');
    }
    
  } catch (error: any) {
    console.error('Failed to create supply chain financing:', error);
    toast({
      title: 'SCF Creation Failed',
      description: error.message || 'Failed to create SCF on blockchain',
      variant: 'destructive',
    });
    return false;
  }
};

/**
 * Get the current Ethereum account address
 */
export const getCurrentAddress = async (): Promise<string | null> => {
  try {
    if (!provider) {
      const initialized = await initializeEthereum();
      if (!initialized) return null;
    }
    
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length === 0) {
      return null;
    }
    
    return accounts[0];
  } catch (error) {
    console.error('Failed to get current address:', error);
    return null;
  }
};

// Define the window ethereum property
declare global {
  interface Window {
    ethereum: any;
  }
}