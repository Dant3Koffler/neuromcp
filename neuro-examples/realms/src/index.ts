import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { VoteChoice } from '@solana/spl-governance';
import { RealmsAgent } from './realms-agent';

async function main() {
    // Configure connection to Solana
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    console.log('Connected to Solana mainnet');

    // Generate a wallet keypair (in a real app, this would be user-provided)
    const wallet = Keypair.generate();
    console.log(`Created wallet: ${wallet.publicKey.toString()}`);

    // Define realm ID (example: Mango DAO)
    const realmId = new PublicKey('DPiH3H3c7t47BMxqTxLsuPQpEC6Kne8GA9VXbxpnZxFE');

    // Create Realms agent
    const agent = new RealmsAgent({
        connection,
        wallet,
        realmId
    });

    // Initialize the agent
    await agent.start();
    console.log('Realms agent initialized');

    // Create a proposal
    try {
        console.log('\nCreating proposal...');
        const proposalResult = await agent.createProposal(
            'Update Treasury Parameters',
            'Proposal to update treasury allocation parameters',
            [new Transaction()] // Example: empty transaction, would contain actual instructions
        );

        if (proposalResult.success) {
            console.log('\nProposal created successfully!');
            console.log(`Transaction ID: ${proposalResult.transactionId}`);
            console.log(`Proposal ID: ${proposalResult.proposalId}`);

            // Cast a vote on the proposal
            console.log('\nCasting vote...');
            const voteResult = await agent.castVote(
                new PublicKey(proposalResult.proposalId!),
                VoteChoice.Yes
            );

            if (voteResult.success) {
                console.log('\nVote cast successfully!');
                console.log(`Transaction ID: ${voteResult.transactionId}`);
                console.log(`Proposal ID: ${voteResult.proposalId}`);
                console.log(`Vote: ${voteResult.vote}`);
            } else {
                console.error(`Failed to cast vote: ${voteResult.error}`);
            }
        } else {
            console.error(`Failed to create proposal: ${proposalResult.error}`);
        }

    } catch (error) {
        console.error('Failed to interact with governance:', error);
    }

    // Stop the agent
    await agent.stop();
    console.log('\nRealms agent stopped');
}

// Execute the example
main().catch(err => {
    console.error('Example failed with error:', err);
    process.exit(1);
}); 