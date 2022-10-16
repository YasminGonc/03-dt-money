import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../lib/axios";

interface Transactions {
    id: number;
    description: string;
    type: 'income' | 'outcome';
    price: number;
    category: string;
    createdAt: string;
}

interface CreateTransactionInput {
    description: string;
    price: number;
    category: string;
    type: 'income' | 'outcome';
}

interface TransactionContextType{
    transactions: Transactions[];
    fetchTransactions: (query?: string) => Promise<void>;
    createTransaction: (data: CreateTransactionInput) => Promise<void>;
}

export const TransactionContext = createContext({} as TransactionContextType);

interface TransactionsProviderProps {
    children: ReactNode;
}

export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transactions[]>([]);

    async function fetchTransactions(query?: string) {
        const response = await api.get('transctions', {
            params: {
                _sort: 'createdAt',
                _order: 'desc',
                q: query,
            }
        });

        setTransactions(response.data);
    }

    async function createTransaction(data: CreateTransactionInput) {
        const { description, price, category, type } = data;

        const response = await api.post('transctions', {
            description,
            price,
            category,
            type,
            createdAt: new Date(),
        });

        setTransactions(state => [response.data, ...state]);

    }

    useEffect(() => {
        fetchTransactions();
    }, []);
    
    return(
        <TransactionContext.Provider value={{ transactions, fetchTransactions, createTransaction }}>
            {children}
        </TransactionContext.Provider>
    )
}