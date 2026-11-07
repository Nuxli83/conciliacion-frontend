export interface MonthlyMetrics {
    currentMonth: string;
    totalMatchedAmount: number;
    totalPendingAmount: number;
    totalInvoicesProcessed: number;
    matchEfficiencyPercentage: number;
  }
  
  export interface ReconciliationSummary {
    totalBankTransactions: number;
    totalInvoices: number;
    successfullyMatched: number;
    pendingTransactions: number;
    pendingInvoices: number;
    totalAmountMatched: number;
    warnings: string[];
  }
  
  export interface ReconciliationHistory {
    id: string;
    executionDate: string;
    totalTransactions: number;
    matchedTransactions: number;
    pendingTransactions: number;
    totalAmount: number;
    status: string;
  }


  export interface PendingInvoice {
    uuid: string;
    issuerRfc: string;
    issueDate: string;
    totalAmount: number;
  }
  
  export interface PendingBankTransaction {
    description: string;
    transactionDate: string;
    amount: number;
  }
  
  export interface PendingConciliationData {
    invoices: PendingInvoice[];
    bankTransactions: PendingBankTransaction[];
  }