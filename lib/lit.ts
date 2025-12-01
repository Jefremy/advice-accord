import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { encryptFile, decryptToFile } from "@lit-protocol/encryption";
import { AuthSig } from "@lit-protocol/types";

const client = new LitJsSdk.LitNodeClient({
    litNetwork: "datil-dev",
});

class LitManager {
    public client: LitJsSdk.LitNodeClient;
    private chain: string = "sepolia";

    constructor() {
        this.client = client;
    }

    async connect() {
        if (!this.client.ready) {
            await this.client.connect();
        }
    }

    /**
     * Encrypts a file (or string) using Lit Protocol.
     * Access Control: Only the 'owner' address can decrypt.
     */
    async encryptFile(file: File, ownerAddress: string, authSig: AuthSig) {
        await this.connect();

        const accessControlConditions = [
            {
                contractAddress: "",
                standardContractType: "",
                chain: this.chain,
                method: "",
                parameters: [":userAddress"],
                returnValueTest: {
                    comparator: "=",
                    value: ownerAddress,
                },
            },
        ];

        // 1. Encrypt the file content
        // Lit v6 uses checkAndSignAuthMessage usually, but here we assume authSig is passed
        // We use the zip encryption for files
        const { ciphertext, dataToEncryptHash } = await encryptFile(
            {
                file,
                accessControlConditions,
                authSig,
                chain: this.chain,
            },
            this.client
        );

        return {
            ciphertext,
            dataToEncryptHash,
            accessControlConditions
        };
    }

    /**
     * Decrypts a file.
     */
    async decryptFile(ciphertext: string, dataToEncryptHash: string, accessControlConditions: any[], authSig: AuthSig) {
        await this.connect();

        const decryptedFile = await decryptToFile(
            {
                accessControlConditions,
                ciphertext,
                dataToEncryptHash,
                authSig,
                chain: this.chain,
            },
            this.client
        );

        return decryptedFile;
    }
}

export const litManager = new LitManager();
