"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const clientId = "BBRANkZMvm0GElPZwZrxQaUBCYyOXfCSfPFpkjr0iGnfYalp2UMwmfskCPBToGM0IHAXAW1YLjHylkMmHmFOaaI";

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7", // Sepolia Testnet
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    displayName: "Ethereum Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
});

const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
});

interface Web3AuthContextType {
    provider: IProvider | null;
    loggedIn: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    userInfo: any;
    isReady: boolean;
}

const Web3AuthContext = createContext<Web3AuthContextType | null>(null);

export const Web3AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [provider, setProvider] = useState<IProvider | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                await web3auth.initModal();
                setProvider(web3auth.provider);

                if (web3auth.connected) {
                    setLoggedIn(true);
                    const user = await web3auth.getUserInfo();
                    setUserInfo(user);
                }
            } catch (error) {
                console.error("Web3Auth Init Error:", error);
            } finally {
                setIsReady(true);
            }
        };

        init();
    }, []);

    const login = async () => {
        if (!isReady) {
            console.log("Web3Auth not ready yet");
            return;
        }
        try {
            const web3authProvider = await web3auth.connect();
            setProvider(web3authProvider);
            if (web3auth.connected) {
                setLoggedIn(true);
                const user = await web3auth.getUserInfo();
                setUserInfo(user);
            }
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    const logout = async () => {
        try {
            await web3auth.logout();
            setProvider(null);
            setLoggedIn(false);
            setUserInfo(null);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <Web3AuthContext.Provider value={{ provider, loggedIn, login, logout, userInfo, isReady }}>
            {children}
        </Web3AuthContext.Provider>
    );
};

export const useWeb3Auth = () => {
    const context = useContext(Web3AuthContext);
    if (!context) {
        throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
    }
    return context;
};
