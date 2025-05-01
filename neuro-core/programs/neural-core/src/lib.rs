use anchor_lang::prelude::*;
use anchor_lang::solana_program::pubkey::Pubkey;
use std::collections::HashMap;

declare_id!("NEURO1111111111111111111111111111111111111");

#[program]
pub mod neural_core {
    use super::*;

    pub fn initialize_neural_network(
        ctx: Context<InitializeNeuralNetwork>,
        config: NeuralNetworkConfig,
    ) -> Result<()> {
        let network = &mut ctx.accounts.neural_network;
        network.authority = ctx.accounts.authority.key();
        network.config = config;
        network.neurons = HashMap::new();
        network.synapses = HashMap::new();
        network.memory_cells = HashMap::new();
        network.last_updated = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn create_neuron(
        ctx: Context<CreateNeuron>,
        neuron_type: NeuronType,
        config: NeuronConfig,
    ) -> Result<()> {
        let neuron = &mut ctx.accounts.neuron;
        let network = &mut ctx.accounts.neural_network;

        neuron.authority = ctx.accounts.authority.key();
        neuron.neuron_type = neuron_type;
        neuron.config = config;
        neuron.activation_threshold = 0.5;
        neuron.plasticity_factor = 0.1;
        neuron.last_activated = 0;
        neuron.connections = HashMap::new();

        network.neurons.insert(neuron.key(), neuron.clone());
        Ok(())
    }

    pub fn form_synapse(
        ctx: Context<FormSynapse>,
        source: Pubkey,
        target: Pubkey,
        weight: f64,
        context: Vec<u8>,
    ) -> Result<()> {
        let synapse = &mut ctx.accounts.synapse;
        let network = &mut ctx.accounts.neural_network;

        synapse.source = source;
        synapse.target = target;
        synapse.weight = weight;
        synapse.context = context;
        synapse.last_activated = 0;

        network.synapses.insert(synapse.key(), synapse.clone());
        Ok(())
    }

    pub fn activate_neuron(
        ctx: Context<ActivateNeuron>,
        input_signals: Vec<f64>,
        context: Vec<u8>,
    ) -> Result<()> {
        let neuron = &mut ctx.accounts.neuron;
        let network = &mut ctx.accounts.neural_network;

        // Calculate weighted sum of inputs
        let weighted_sum: f64 = input_signals.iter().sum();
        
        // Apply activation function
        let activation = sigmoid(weighted_sum);
        
        if activation > neuron.activation_threshold {
            neuron.last_activated = Clock::get()?.unix_timestamp;
            
            // Propagate signal to connected neurons
            for (target, synapse) in &neuron.connections {
                if let Some(target_neuron) = network.neurons.get(target) {
                    // Update synapse weight based on Hebbian learning
                    let delta_weight = neuron.plasticity_factor * activation * target_neuron.last_activation;
                    synapse.weight += delta_weight;
                }
            }
        }

        Ok(())
    }

    pub fn form_memory(
        ctx: Context<FormMemory>,
        memory_data: Vec<u8>,
        context: Vec<u8>,
    ) -> Result<()> {
        let memory_cell = &mut ctx.accounts.memory_cell;
        let network = &mut ctx.accounts.neural_network;

        memory_cell.data = memory_data;
        memory_cell.context = context;
        memory_cell.last_accessed = Clock::get()?.unix_timestamp;
        memory_cell.access_count = 0;

        network.memory_cells.insert(memory_cell.key(), memory_cell.clone());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeNeuralNetwork<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8 + 8 + 8 + 8)]
    pub neural_network: Account<'info, NeuralNetwork>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateNeuron<'info> {
    #[account(mut)]
    pub neural_network: Account<'info, NeuralNetwork>,
    #[account(init, payer = authority, space = 8 + 32 + 1 + 8 + 8 + 8 + 8)]
    pub neuron: Account<'info, Neuron>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FormSynapse<'info> {
    #[account(mut)]
    pub neural_network: Account<'info, NeuralNetwork>,
    #[account(init, payer = authority, space = 8 + 32 + 32 + 8 + 8 + 8)]
    pub synapse: Account<'info, Synapse>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ActivateNeuron<'info> {
    #[account(mut)]
    pub neural_network: Account<'info, NeuralNetwork>,
    #[account(mut)]
    pub neuron: Account<'info, Neuron>,
}

#[derive(Accounts)]
pub struct FormMemory<'info> {
    #[account(mut)]
    pub neural_network: Account<'info, NeuralNetwork>,
    #[account(init, payer = authority, space = 8 + 8 + 8 + 8 + 8)]
    pub memory_cell: Account<'info, MemoryCell>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NeuralNetwork {
    pub authority: Pubkey,
    pub config: NeuralNetworkConfig,
    pub neurons: HashMap<Pubkey, Neuron>,
    pub synapses: HashMap<Pubkey, Synapse>,
    pub memory_cells: HashMap<Pubkey, MemoryCell>,
    pub last_updated: i64,
}

#[account]
pub struct Neuron {
    pub authority: Pubkey,
    pub neuron_type: NeuronType,
    pub config: NeuronConfig,
    pub activation_threshold: f64,
    pub plasticity_factor: f64,
    pub last_activated: i64,
    pub connections: HashMap<Pubkey, Synapse>,
}

#[account]
pub struct Synapse {
    pub source: Pubkey,
    pub target: Pubkey,
    pub weight: f64,
    pub context: Vec<u8>,
    pub last_activated: i64,
}

#[account]
pub struct MemoryCell {
    pub data: Vec<u8>,
    pub context: Vec<u8>,
    pub last_accessed: i64,
    pub access_count: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct NeuralNetworkConfig {
    pub network_type: NetworkType,
    pub learning_rate: f64,
    pub memory_capacity: u64,
    pub context_sensitivity: f64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct NeuronConfig {
    pub processing_power: u64,
    pub memory_capacity: u64,
    pub context_sensitivity: f64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum NeuronType {
    Sensory,
    Interneuron,
    Motor,
    Memory,
    Regulatory,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum NetworkType {
    Feedforward,
    Recurrent,
    Convolutional,
    Transformer,
    Spiking,
}

fn sigmoid(x: f64) -> f64 {
    1.0 / (1.0 + (-x).exp())
} 