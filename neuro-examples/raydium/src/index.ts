import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { RaydiumAgent } from './raydium-agent';

async function main() {
    // Configure connection to Solana
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    console.log('Connected to Solana mainnet');

    // Generate a wallet keypair (in a real app, this would be user-provided)
    const wallet = Keypair.generate();
    console.log(`Created wallet: ${wallet.publicKey.toString()}`);

    // Create Raydium agent
    const agent = new RaydiumAgent({
        connection,
        wallet,
        slippageBps: 50 // 0.5% slippage
    });

    // Initialize the agent
    await agent.start();
    console.log('Raydium agent initialized');

    // Define token mints and pool for liquidity provision
    const SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
    const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    const SOL_USDC_POOL = new PublicKey('58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2');

    // Add liquidity to the pool
    try {
        console.log('\nAdding liquidity: 1 SOL + 15 USDC to SOL/USDC pool');
        const result = await agent.addLiquidity(
            SOL_USDC_POOL,
            SOL_MINT,
            USDC_MINT,
            1 * 1e9, // 1 SOL in lamports
            15 * 1e6 // 15 USDC (6 decimals)
        );

        if (result.success) {
            console.log('\nLiquidity addition successful!');
            console.log(`Transaction ID: ${result.transactionId}`);
            console.log(`Pool ID: ${result.poolId}`);
            console.log(`Token A amount: ${result.tokenAAmount! / 1e9} SOL`);
            console.log(`Token B amount: ${result.tokenBAmount! / 1e6} USDC`);
            if (result.lpTokens) {
                console.log(`LP tokens received: ${result.lpTokens}`);
            }
        } else {
            console.error(`Failed to add liquidity: ${result.error}`);
        }

    } catch (error) {
        console.error('Failed to add liquidity:', error);
    }

    // Stop the agent
    await agent.stop();
    console.log('\nRaydium agent stopped');
}

// Execute the example
main().catch(err => {
    console.error('Example failed with error:', err);
    process.exit(1);
}); 