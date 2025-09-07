module message_board_addr::charitable_funding {
    use std::string::String;
    use aptos_framework::object::{Self, ExtendRef};
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_std::table::{Self, Table};
    use std::signer;
    
    // ================ Error Constants ================
    /// Error code when user has insufficient funds for donation
    const E_INSUFFICIENT_FUNDS: u64 = 1;
    /// Error code when trying to interact with non-existent project
    const E_PROJECT_DOESNT_EXIST: u64 = 2;
    /// Error code when trying to create a project that already exists
    const E_PROJECT_ALREADY_EXISTS: u64 = 3;
    /// Error code when caller is not the project creator
    const E_NOT_PROJECT_CREATOR: u64 = 4;
    /// Error code when milestone is already completed
    const E_MILESTONE_ALREADY_COMPLETED: u64 = 5;

    // ================ Resource Structures ================
    
    /// Stores the milestone information
    struct Milestone has key, store, copy, drop {
        id: u64,
        title: String,
        description: String,
        funding_amount: u64,
        is_completed: bool,
        is_verified: bool,
        verification_count: u64,
    }

    /// Stores the project information
    struct Project has key, store {
        id: u64,
        title: String,
        description: String,
        total_funding_required: u64,
        current_funding: u64,
        creator: address,
        milestone_counter: u64,
        milestones: Table<u64, Milestone>
    }
    
    /// Module configuration for storing global state
    struct FundingConfig has key {
        extend_ref: ExtendRef,
        project_counter: u64,
        projects: Table<u64, Project>,
    }

    const FUNDING_OBJECT_SEED: vector<u8> = b"charitable_funding";

    // ================ Module Initialization ================
    
    fun init_module(sender: &signer) {
        let constructor_ref = &object::create_named_object(sender, FUNDING_OBJECT_SEED);
        let signer_ref = &object::generate_signer(constructor_ref);
        
        move_to(signer_ref, FundingConfig {
            extend_ref: object::generate_extend_ref(constructor_ref),
            project_counter: 0,
            projects: table::new(),
        });
    }

    // ================ Entry Functions ================
    
    /// Create a new project with basic information
    public entry fun create_project(
        sender: &signer,
        title: String,
        description: String,
        total_funding_required: u64,
    ) acquires FundingConfig {
        let sender_addr = signer::address_of(sender);
        let funding_config = borrow_global_mut<FundingConfig>(get_funding_obj_address());
        
        // Generate a new project ID
        let project_id = funding_config.project_counter;
        funding_config.project_counter = project_id + 1;
        
        // Create the project
        let project = Project {
            id: project_id,
            title,
            description,
            total_funding_required,
            current_funding: 0,
            creator: sender_addr,
            milestone_counter: 0,
            milestones: table::new(),
        };
        
        // Store the project
        table::add(&mut funding_config.projects, project_id, project);
    }
    
    /// Donate to a specific project
    public entry fun donate_to_project(
        sender: &signer,
        project_id: u64,
        amount: u64,
    ) acquires FundingConfig {
        // Verify the project exists
        let funding_config = borrow_global_mut<FundingConfig>(get_funding_obj_address());
        assert!(table::contains(&funding_config.projects, project_id), E_PROJECT_DOESNT_EXIST);
        
        // Transfer AptosCoin to module account (project)
        let module_address = get_funding_obj_address();
        coin::transfer<AptosCoin>(sender, module_address, amount);
        
        // Update the project's current funding
        let project = table::borrow_mut(&mut funding_config.projects, project_id);
        project.current_funding = project.current_funding + amount;
    }

    /// Add a milestone to a project
    public entry fun add_milestone(
        sender: &signer,
        project_id: u64,
        title: String,
        description: String,
        funding_amount: u64,
    ) acquires FundingConfig {
        let sender_addr = signer::address_of(sender);
        let funding_config = borrow_global_mut<FundingConfig>(get_funding_obj_address());
        
        // Verify the project exists
        assert!(table::contains(&funding_config.projects, project_id), E_PROJECT_DOESNT_EXIST);
        
        // Verify the sender is the project creator
        let project = table::borrow_mut(&mut funding_config.projects, project_id);
        assert!(project.creator == sender_addr, E_NOT_PROJECT_CREATOR);
        
        // Generate a new milestone ID
        let milestone_id = project.milestone_counter;
        project.milestone_counter = milestone_id + 1;
        
        // Create the milestone
        let milestone = Milestone {
            id: milestone_id,
            title,
            description,
            funding_amount,
            is_completed: false,
            is_verified: false,
            verification_count: 0,
        };
        
        // Store the milestone
        table::add(&mut project.milestones, milestone_id, milestone);
    }

    /// Mark a milestone as completed
    public entry fun complete_milestone(
        sender: &signer,
        project_id: u64,
        milestone_id: u64,
    ) acquires FundingConfig {
        let sender_addr = signer::address_of(sender);
        let funding_config = borrow_global_mut<FundingConfig>(get_funding_obj_address());
        
        // Verify the project exists
        assert!(table::contains(&funding_config.projects, project_id), E_PROJECT_DOESNT_EXIST);
        
        // Verify the sender is the project creator
        let project = table::borrow_mut(&mut funding_config.projects, project_id);
        assert!(project.creator == sender_addr, E_NOT_PROJECT_CREATOR);
        
        // Verify the milestone exists
        assert!(table::contains(&project.milestones, milestone_id), E_PROJECT_DOESNT_EXIST);
        
        // Update the milestone
        let milestone = table::borrow_mut(&mut project.milestones, milestone_id);
        assert!(!milestone.is_completed, E_MILESTONE_ALREADY_COMPLETED);
        milestone.is_completed = true;
    }

    /// Verify a milestone as a community member
    public entry fun verify_milestone(
        _sender: &signer,
        project_id: u64,
        milestone_id: u64,
    ) acquires FundingConfig {
        let funding_config = borrow_global_mut<FundingConfig>(get_funding_obj_address());
        
        // Verify the project exists
        assert!(table::contains(&funding_config.projects, project_id), E_PROJECT_DOESNT_EXIST);
        
        // Get the project
        let project = table::borrow_mut(&mut funding_config.projects, project_id);
        
        // Verify the milestone exists
        assert!(table::contains(&project.milestones, milestone_id), E_PROJECT_DOESNT_EXIST);
        
        // Update the milestone
        let milestone = table::borrow_mut(&mut project.milestones, milestone_id);
        assert!(milestone.is_completed, E_MILESTONE_ALREADY_COMPLETED);
        milestone.verification_count = milestone.verification_count + 1;
        
        // If verification count reaches 2, mark as verified
        if (milestone.verification_count >= 2) {
            milestone.is_verified = true;
        };
    }

    /// Release funds for a verified milestone
    public entry fun release_milestone_funds(
        sender: &signer,
        project_id: u64,
        milestone_id: u64,
    ) acquires FundingConfig {
        let sender_addr = signer::address_of(sender);
        let funding_config = borrow_global_mut<FundingConfig>(get_funding_obj_address());
        
        // Verify the project exists
        assert!(table::contains(&funding_config.projects, project_id), E_PROJECT_DOESNT_EXIST);
        
        // Verify the sender is the project creator
        let project = table::borrow_mut(&mut funding_config.projects, project_id);
        assert!(project.creator == sender_addr, E_NOT_PROJECT_CREATOR);
        
        // Verify the milestone exists
        assert!(table::contains(&project.milestones, milestone_id), E_PROJECT_DOESNT_EXIST);
        
        // Get the milestone
        let milestone = table::borrow(&project.milestones, milestone_id);
        
        // Check that the milestone is verified
        assert!(milestone.is_verified, E_NOT_PROJECT_CREATOR);
        
        // Get the amount to transfer
        let amount = milestone.funding_amount;
        
        // Make sure we have enough funds
        assert!(project.current_funding >= amount, E_INSUFFICIENT_FUNDS);
        
        // Update the project's current funding
        project.current_funding = project.current_funding - amount;
        
        // Transfer the funds
        coin::transfer<AptosCoin>(&get_funding_obj_signer(), sender_addr, amount);
    }
    
    // ================ View Functions ================
    
    #[view]
    /// Check if a project exists
    public fun project_exists(project_id: u64): bool acquires FundingConfig {
        let funding_config = borrow_global<FundingConfig>(get_funding_obj_address());
        table::contains(&funding_config.projects, project_id)
    }
    
    #[view]
    /// Get project details
    public fun get_project_details(project_id: u64): (String, String, u64, u64, address) acquires FundingConfig {
        let funding_config = borrow_global<FundingConfig>(get_funding_obj_address());
        assert!(table::contains(&funding_config.projects, project_id), E_PROJECT_DOESNT_EXIST);
        
        let project = table::borrow(&funding_config.projects, project_id);
        (
            project.title,
            project.description,
            project.total_funding_required,
            project.current_funding,
            project.creator
        )
    }
    
    #[view]
    /// Get the total number of projects
    public fun get_project_count(): u64 acquires FundingConfig {
        let funding_config = borrow_global<FundingConfig>(get_funding_obj_address());
        funding_config.project_counter
    }

    #[view]
    /// Get milestone details
    public fun get_milestone_details(project_id: u64, milestone_id: u64): (String, String, u64, bool, bool, u64) acquires FundingConfig {
        let funding_config = borrow_global<FundingConfig>(get_funding_obj_address());
        assert!(table::contains(&funding_config.projects, project_id), E_PROJECT_DOESNT_EXIST);
        
        let project = table::borrow(&funding_config.projects, project_id);
        assert!(table::contains(&project.milestones, milestone_id), E_PROJECT_DOESNT_EXIST);
        
        let milestone = table::borrow(&project.milestones, milestone_id);
        (
            milestone.title,
            milestone.description,
            milestone.funding_amount,
            milestone.is_completed,
            milestone.is_verified,
            milestone.verification_count
        )
    }

    #[view]
    /// Get the total number of milestones for a project
    public fun get_milestone_count(project_id: u64): u64 acquires FundingConfig {
        let funding_config = borrow_global<FundingConfig>(get_funding_obj_address());
        assert!(table::contains(&funding_config.projects, project_id), E_PROJECT_DOESNT_EXIST);
        
        let project = table::borrow(&funding_config.projects, project_id);
        project.milestone_counter
    }
    
    // ================ Helper Functions ================
    
    fun get_funding_obj_address(): address {
        object::create_object_address(&@message_board_addr, FUNDING_OBJECT_SEED)
    }
    
    fun get_funding_obj_signer(): signer acquires FundingConfig {
        object::generate_signer_for_extending(&borrow_global<FundingConfig>(get_funding_obj_address()).extend_ref)
    }
    
    // ================ Test-Only Functions ================
    
    #[test_only]
    public fun init_module_for_test(sender: &signer) {
        init_module(sender);
    }
}
