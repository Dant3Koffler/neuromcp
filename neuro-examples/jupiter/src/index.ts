import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { JupiterAgent } from './jupiter-agent';

async function main() {
    // Configure connection to Solana
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    console.log('Connected to Solana mainnet');

    // Generate a wallet keypair (in a real app, this would be user-provided)
    const wallet = Keypair.generate();
    console.log(`Created wallet: ${wallet.publicKey.toString()}`);

    // Create Jupiter agent
    const agent = new JupiterAgent({
        connection,
        wallet,
        slippageBps: 50 // 0.5% slippage
    });

    // Initialize the agent
    await agent.start();
    console.log('Jupiter agent initialized');

    // Define token mints for the swap
    const SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
    const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

    // Execute a swap
    try {
        console.log('\nExecuting swap: 0.1 SOL -> USDC');
        const result = await agent.executeSwap(
            SOL_MINT,
            USDC_MINT,
            0.1 * 1e9 // 0.1 SOL in lamports
        );

        if (result.success) {
            console.log('\nSwap successful!');
            console.log(`Transaction ID: ${result.transactionId}`);
            console.log(`Input amount: ${result.inputAmount! / 1e9} SOL`);
            console.log(`Output amount: ${result.outputAmount! / 1e6} USDC`);
            console.log(`Route: ${result.route}`);
        } else {
            console.error(`Swap failed: ${result.error}`);
        }

    } catch (error) {
        console.error('Failed to execute swap:', error);
    }

    // Stop the agent
    await agent.stop();
    console.log('\nJupiter agent stopped');
}

// Execute the example
main().catch(err => {
    console.error('Example failed with error:', err);
    process.exit(1);
}); 