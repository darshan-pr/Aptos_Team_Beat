# Charitable Funding Implementation

## Smart Contracts

We've implemented two main smart contracts for the charitable funding system:

1. **Project Creation Contract**
   - Simple contract that handles initial project data
   - Stores title, description, and total funding required
   - Doesn't include milestone information as that will be stored locally

2. **Donation Transaction Contract**
   - Handles donation processing
   - Links donations to specific projects
   - Updates project funding totals
   - Simple functionality that doesn't alter milestone completion logic

## Testing

1. Run the Move tests:
   ```bash
   cd aptos_beta
   node scripts/move/test.js
   ```

2. Compile the Move contracts:
   ```bash
   cd aptos_beta
   node scripts/move/compile.js
   ```

3. Publish the Move contracts to your account:
   ```bash
   cd aptos_beta
   node scripts/move/publish.js
   ```

## Frontend Usage

We've created a demo page at `/demo/charitable-funding` which demonstrates:

1. Creating a new project with a title, description, and funding target
2. Viewing existing projects
3. Making donations to projects

## Integration

The contracts are now fully integrated with the existing Aptos application:

1. Smart contracts are in `/contract/sources/charitable_funding.move`
2. Frontend TypeScript functions are in:
   - `/src/entry-functions/createProject.ts`
   - `/src/entry-functions/donateToProject.ts`
   - `/src/view-functions/charitableFunding.ts`
3. UI component is in `/src/components/CharitableFunding.tsx`
4. Demo page is at `/src/app/demo/charitable-funding/page.tsx`
5. Link to the demo page has been added to the FeaturesSection component

## Future Improvements

1. Add support for milestones stored locally
2. Implement fund release validation
3. Add admin functions for project management
4. Implement project verification system
5. Add support for multiple donation types
