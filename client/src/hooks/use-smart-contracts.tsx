import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import * as smartContractUtils from '@/lib/smartContractUtils';

/**
 * Hook for managing trade finance smart contract interactions
 */
export function useSmartContracts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize connection to Ethereum
  const initialize = useCallback(async () => {
    setIsLoading(true);
    const success = await smartContractUtils.initializeEthereum();
    setIsConnected(success);
    
    if (success) {
      const address = await smartContractUtils.getCurrentAddress();
      setCurrentAddress(address);
    }
    
    setIsLoading(false);
    return success;
  }, []);

  // Create a new invoice on the blockchain
  const createInvoice = useCallback(async (
    invoiceId: string,
    amount: string,
    exporterAddress: string,
    importerAddress: string,
    dueDate: number
  ) => {
    setIsLoading(true);
    
    if (!isConnected) {
      const initialized = await initialize();
      if (!initialized) {
        setIsLoading(false);
        return false;
      }
    }
    
    const success = await smartContractUtils.createInvoice(
      invoiceId,
      amount,
      exporterAddress,
      importerAddress,
      dueDate
    );
    
    setIsLoading(false);
    return success;
  }, [isConnected, initialize]);

  // Approve an invoice
  const approveInvoice = useCallback(async (invoiceId: string) => {
    setIsLoading(true);
    
    if (!isConnected) {
      const initialized = await initialize();
      if (!initialized) {
        setIsLoading(false);
        return false;
      }
    }
    
    const success = await smartContractUtils.approveInvoice(invoiceId);
    
    setIsLoading(false);
    return success;
  }, [isConnected, initialize]);

  // Pay an invoice
  const payInvoice = useCallback(async (invoiceId: string, amount: string) => {
    setIsLoading(true);
    
    if (!isConnected) {
      const initialized = await initialize();
      if (!initialized) {
        setIsLoading(false);
        return false;
      }
    }
    
    const success = await smartContractUtils.payInvoice(invoiceId, amount);
    
    setIsLoading(false);
    return success;
  }, [isConnected, initialize]);

  // Create a letter of credit
  const createLetterOfCredit = useCallback(async (
    lcId: string,
    importerAddress: string,
    exporterAddress: string,
    amount: string,
    terms: string
  ) => {
    setIsLoading(true);
    
    if (!isConnected) {
      const initialized = await initialize();
      if (!initialized) {
        setIsLoading(false);
        return false;
      }
    }
    
    const success = await smartContractUtils.createLetterOfCredit(
      lcId,
      importerAddress,
      exporterAddress,
      amount,
      terms
    );
    
    setIsLoading(false);
    return success;
  }, [isConnected, initialize]);

  // Create supply chain financing
  const createSupplyChainFinancing = useCallback(async (
    scfId: string,
    supplierAddress: string,
    buyerAddress: string,
    amount: string,
    interestRate: number,
    duration: number
  ) => {
    setIsLoading(true);
    
    if (!isConnected) {
      const initialized = await initialize();
      if (!initialized) {
        setIsLoading(false);
        return false;
      }
    }
    
    const success = await smartContractUtils.createSupplyChainFinancing(
      scfId,
      supplierAddress,
      buyerAddress,
      amount,
      interestRate,
      duration
    );
    
    setIsLoading(false);
    return success;
  }, [isConnected, initialize]);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          setCurrentAddress(null);
          setIsConnected(false);
          toast({
            title: 'Disconnected',
            description: 'Wallet has been disconnected',
            variant: 'destructive',
          });
        } else {
          setCurrentAddress(accounts[0]);
          setIsConnected(true);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Check initial connection status
      if (!isConnected && !isLoading) {
        initialize();
      }

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [isConnected, isLoading, initialize, toast]);

  return {
    isConnected,
    isLoading,
    currentAddress,
    initialize,
    createInvoice,
    approveInvoice,
    payInvoice,
    createLetterOfCredit,
    createSupplyChainFinancing,
  };
}