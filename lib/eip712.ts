export const EIP712_DOMAIN = {
    name: "AdviceAccordVault",
    version: "1",
    chainId: 11155111, // Sepolia
    verifyingContract: "0x0000000000000000000000000000000000000000" // No specific verifying contract for now
};

export const VAULT_ENTRY_TYPES = {
    VaultEntry: [
        { name: 'name', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'hash', type: 'string' },
        { name: 'size', type: 'string' },
        { name: 'timestamp', type: 'string' }
    ]
};

export async function signVaultEntry(signer: any, data: { name: string, category: string, hash: string, size: string, timestamp: string }) {
    try {
        // Ethers v6 signTypedData
        const signature = await signer.signTypedData(
            EIP712_DOMAIN,
            VAULT_ENTRY_TYPES,
            data
        );
        return signature;
    } catch (error) {
        console.error("Error signing typed data:", error);
        throw error;
    }
}
