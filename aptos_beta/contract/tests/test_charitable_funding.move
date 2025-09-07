#[test_only]
module message_board_addr::test_charitable_funding {
    use std::string;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::{Self, AptosCoin};
    use aptos_framework::account;

    use message_board_addr::charitable_funding;

    #[test(aptos_framework = @0x1, sender = @message_board_addr)]
    fun test_project_creation_and_donation(
        aptos_framework: &signer,
        sender: &signer
    ) {
        // Set up the test environment
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);
        
        // Initialize the charitable_funding module
        charitable_funding::init_module_for_test(sender);
        
        // Create a donor account
        let donor_addr = @0xDEADBEEF;
        let donor = account::create_account_for_test(donor_addr);
        
        // Fund the donor account with 1000 APT
        coin::register<AptosCoin>(&donor);
        aptos_coin::mint(aptos_framework, donor_addr, 100000000000); // 1000 APT (with 8 decimals)
        
        // Create a new project
        let title = string::utf8(b"Save the Ocean");
        let description = string::utf8(b"A project to clean up ocean pollution");
        let total_funding = 500000000; // 5 APT
        
        charitable_funding::create_project(
            sender, 
            title, 
            description, 
            total_funding
        );
        
        // Verify the project was created
        let project_count = charitable_funding::get_project_count();
        assert!(project_count == 1, 1);
        
        // Verify project exists
        assert!(charitable_funding::project_exists(0), 2);
        
        // Get project details and verify
        let (
            project_title, 
            project_desc, 
            project_total_funding, 
            project_current_funding,
            project_creator
        ) = charitable_funding::get_project_details(0);
        
        assert!(project_title == title, 3);
        assert!(project_desc == description, 4);
        assert!(project_total_funding == total_funding, 5);
        assert!(project_current_funding == 0, 6);
        assert!(project_creator == @message_board_addr, 7);
        
        // Make a donation
        let donation_amount = 200000000; // 2 APT
        charitable_funding::donate_to_project(&donor, 0, donation_amount);
        
        // Verify donation was recorded
        let (_, _, _, updated_funding, _) = charitable_funding::get_project_details(0);
        assert!(updated_funding == donation_amount, 8);
        
        // Make another donation
        charitable_funding::donate_to_project(&donor, 0, donation_amount);
        
        // Verify the donation was added to the previous amount
        let (_, _, _, final_funding, _) = charitable_funding::get_project_details(0);
        assert!(final_funding == donation_amount * 2, 9);
        
        // Cleanup test resources
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(aptos_framework = @0x1, sender = @message_board_addr, donor = @0xDEADBEEF, verifier = @0xCAFEBABE)]
    fun test_milestone_functionality(
        aptos_framework: &signer,
        sender: &signer,
        donor: &signer,
        verifier: &signer
    ) {
        // Set up the test environment
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);
        
        // Initialize the charitable_funding module
        charitable_funding::init_module_for_test(sender);
        
        // Create a project first
        let title = string::utf8(b"Community Garden");
        let description = string::utf8(b"Building a community garden for local food production");
        let total_funding = 1000000000; // 10 APT
        
        charitable_funding::create_project(
            sender, 
            title, 
            description, 
            total_funding
        );
        
        // Add a milestone to the project
        let milestone_title = string::utf8(b"Phase 1: Land Preparation");
        let milestone_desc = string::utf8(b"Clear and prepare the land for planting");
        let milestone_funding = 300000000; // 3 APT
        
        charitable_funding::add_milestone(
            sender,
            0, // project_id
            milestone_title,
            milestone_desc,
            milestone_funding
        );
        
        // Verify milestone was created
        let milestone_count = charitable_funding::get_milestone_count(0);
        assert!(milestone_count == 1, 100);
        
        // Get milestone details and verify
        let (
            m_title,
            m_desc,
            m_funding,
            m_completed,
            m_verified,
            m_verification_count
        ) = charitable_funding::get_milestone_details(0, 0);
        
        assert!(m_title == milestone_title, 101);
        assert!(m_desc == milestone_desc, 102);
        assert!(m_funding == milestone_funding, 103);
        assert!(!m_completed, 104);
        assert!(!m_verified, 105);
        assert!(m_verification_count == 0, 106);
        
        // Mark milestone as completed
        charitable_funding::complete_milestone(sender, 0, 0);
        
        // Verify milestone completion
        let (_, _, _, completed, verified, _) = charitable_funding::get_milestone_details(0, 0);
        assert!(completed, 107);
        assert!(!verified, 108); // Should not be verified yet
        
        // Have a community member verify the milestone
        charitable_funding::verify_milestone(verifier, 0, 0);
        
        // Check verification count (should be 1, not verified yet as needs 2)
        let (_, _, _, _, verified_status, verification_count) = charitable_funding::get_milestone_details(0, 0);
        assert!(!verified_status, 109); // Still not verified
        assert!(verification_count == 1, 110);
        
        // Have another verifier (using donor as second verifier)
        charitable_funding::verify_milestone(donor, 0, 0);
        
        // Now should be verified
        let (_, _, _, _, verified_final, verification_count_final) = charitable_funding::get_milestone_details(0, 0);
        assert!(verified_final, 111); // Should be verified now
        assert!(verification_count_final == 2, 112);
        
        // Fund the donor and project for fund release
        coin::register<AptosCoin>(donor);
        aptos_coin::mint(aptos_framework, @0xDEADBEEF, 500000000); // 5 APT
        
        // Donate to the project first
        charitable_funding::donate_to_project(donor, 0, milestone_funding);
        
        // Now release the milestone funds
        charitable_funding::release_milestone_funds(sender, 0, 0);
        
        // Verify project funding was updated
        let (_, _, _, current_funding, _) = charitable_funding::get_project_details(0);
        assert!(current_funding == 0, 113); // Should be 0 after release
        
        // Cleanup test resources
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }
}
