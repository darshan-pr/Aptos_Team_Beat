<div align="center">

# 🌟 Aptos Charitable Funding Platform

*Empowering transparent, milestone-based charitable donations on the Aptos blockchain*

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.8-black?logo=next.js)](https://nextjs.org/)
[![Aptos](https://img.shields.io/badge/Aptos-Blockchain-00D4AA?logo=aptos)](https://aptos.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

![Aptos Logo](public/aptos.png)

</div>

---

## 🚀 **Overview**

The **Aptos Charitable Funding Platform** is a revolutionary decentralized application that transforms how charitable organizations raise and manage funds. Built on the high-performance Aptos blockchain, our platform ensures **complete transparency**, **milestone-based fund releases**, and **community-driven verification** for all charitable projects.

### ✨ **Key Highlights**
- 🎯 **Milestone-Based Funding** - Funds are released only when project milestones are achieved and verified
- 🔒 **Transparent Escrow System** - All donations are held securely until verification criteria are met
- 👥 **Community Verification** - Decentralized validation ensures accountability and trust
- ⚡ **Lightning-Fast Transactions** - Powered by Aptos' sub-second finality
- 💎 **Modern UI/UX** - Sleek, responsive design with smooth animations
- 🔐 **Secure Wallet Integration** - Seamless connection with multiple Aptos wallets

---

## 🏗️ **Architecture & Features**

### **🎨 Frontend Architecture**
```
├── 📱 Next.js 14 with App Router
├── 🎭 React 18 with TypeScript
├── 🎨 Tailwind CSS + shadcn/ui
├── 🔄 TanStack Query for state management
├── 💫 Anime.js for smooth animations
└── 📱 Progressive Web App (PWA) support
```

### **⛓️ Smart Contract Features**
```
├── 🏗️ Project Creation & Management
├── 💰 Secure Donation Handling
├── 🎯 Milestone-Based Fund Release
├── ✅ Community Verification System
├── 🔒 Emergency Fund Release Mechanism
└── 📊 Comprehensive Progress Tracking
```

### **🛠️ Tech Stack**

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Next.js | 14.2.8 |
| **Blockchain** | Aptos SDK | 2.0.0 |
| **Styling** | Tailwind CSS | 3.4.3 |
| **UI Components** | shadcn/ui + Radix UI | Latest |
| **State Management** | TanStack Query | 5.51.23 |
| **Animations** | Anime.js | 4.1.3 |
| **Language** | TypeScript | 5.2.2 |
| **PWA** | Next-PWA | 10.2.9 |

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Aptos CLI
- Git

### **Installation**

```bash
# Clone the repository
git clone https://github.com/darshan-pr/Open_Hands.git
cd aptos_beta

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Compile Move contracts
npm run move:compile

# Deploy contracts to testnet
npm run move:publish

# Start development server
npm run dev
```

### **🔧 Available Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run move:compile` | Compile Move contracts |
| `npm run move:test` | Run Move unit tests |
| `npm run move:publish` | Publish contracts to blockchain |
| `npm run move:upgrade` | Upgrade existing contracts |
| `npm run deploy` | Deploy to Vercel |
| `npm run lint` | Run ESLint |
| `npm run fmt` | Format code with Prettier |

---

## 💡 **Platform Features**

### **🎯 For Project Creators**
- **📝 Project Registration** - Create detailed project profiles with funding goals
- **🎯 Milestone Planning** - Break down projects into verifiable milestones
- **📊 Real-time Analytics** - Track funding progress and community engagement
- **💬 Community Interaction** - Direct communication with donors and supporters

### **🤝 For Donors**
- **🔍 Project Discovery** - Browse and explore verified charitable projects
- **💰 Secure Donations** - Safe, transparent donation process
- **📈 Impact Tracking** - Monitor how your contributions make a difference
- **✅ Verification Participation** - Help verify project milestones

### **🌐 For the Community**
- **🔍 Transparency** - All transactions and project progress are on-chain
- **👥 Collective Verification** - Community-driven milestone validation
- **📊 Impact Metrics** - Comprehensive project impact analytics
- **🏆 Recognition System** - Acknowledge top contributors and projects

---

## 🔧 **Smart Contract Integration**

Our platform leverages powerful Move smart contracts for secure and transparent fund management:

### **📋 Core Functions**

#### **🏗️ Project Management**
```typescript
// Create a new charitable project
import { createProject } from "@/entry-functions/createProject";

const newProject = await createProject({
  title: "Clean Water Initiative",
  description: "Providing clean water access to rural communities",
  totalFundingRequired: 1000000000, // 10 APT
});
```

#### **💰 Donation System**
```typescript
// Make a donation to a project
import { donateToProject } from "@/entry-functions/donateToProject";

const donation = await donateToProject({
  projectId: 0,
  amount: 100000000, // 1 APT
});
```

#### **🎯 Milestone Management**
```typescript
// Add milestone to project
import { addMilestone } from "@/entry-functions/addMilestone";

const milestone = await addMilestone({
  projectId: 0,
  title: "Water Pump Installation",
  description: "Install solar-powered water pumps",
  fundingAmount: 250000000, // 2.5 APT
});

// Complete and verify milestones
import { completeMilestone, verifyMilestone } from "@/entry-functions/";

await completeMilestone({ projectId: 0, milestoneId: 0 });
await verifyMilestone({ projectId: 0, milestoneId: 0 });
```

#### **💸 Fund Release**
```typescript
// Release funds after verification
import { releaseMilestoneFunds } from "@/entry-functions/releaseMilestoneFunds";

const release = await releaseMilestoneFunds({
  projectId: 0,
  milestoneId: 0,
});
```

### **📊 Data Retrieval**
```typescript
// Get comprehensive project details
import { getProjectDetails, getMilestoneDetails } from "@/view-functions/charitableFunding";

const project = await getProjectDetails(0);
const milestone = await getMilestoneDetails(0, 0);
```

---

## 🏗️ **Project Structure**

```
aptos_beta/
├── 📁 contract/                 # Move smart contracts
│   ├── 📄 Move.toml            # Move project configuration
│   ├── 📁 sources/             # Smart contract source files
│   │   ├── charitable_funding.move
│   │   └── message_board.move
│   └── 📁 tests/              # Contract unit tests
├── 📁 src/                     # Frontend application
│   ├── 📁 app/                # Next.js App Router pages
│   ├── 📁 components/         # Reusable React components
│   ├── 📁 entry-functions/    # Blockchain interaction functions
│   ├── 📁 view-functions/     # Read-only blockchain queries
│   ├── 📁 lib/               # Utility libraries
│   └── 📁 types/             # TypeScript type definitions
├── 📁 scripts/               # Build and deployment scripts
└── 📁 public/               # Static assets
```

---

## 🌟 **Key Components**

### **🎨 UI Components**
- **`CharitableFunding.tsx`** - Main funding interface
- **`DonationWidget.tsx`** - Streamlined donation component
- **`CommunityFeed.tsx`** - Community interaction hub
- **`ProjectVerificationList.tsx`** - Milestone verification interface

### **⚡ Blockchain Integration**
- **Entry Functions** - Write operations to the blockchain
- **View Functions** - Read-only data retrieval
- **Type Definitions** - Strongly typed contract interfaces

---

## 🚀 **Deployment**

### **🌐 Frontend Deployment**
```bash
# Build the application
npm run build

# Deploy to Vercel
npm run deploy
```

### **⛓️ Contract Deployment**
```bash
# Deploy to Aptos Testnet
npm run move:publish

# Upgrade existing contracts
npm run move:upgrade
```

---

## 🧪 **Testing**

### **🔧 Move Contract Tests**
```bash
# Run all Move unit tests
npm run move:test

# Compile contracts (includes syntax checking)
npm run move:compile
```

### **🌐 Frontend Testing**
```bash
# Lint code for errors
npm run lint

# Format code
npm run fmt
```

---

## 🤝 **Contributing**

We welcome contributions from the community! Here's how you can help:

### **🔄 Development Workflow**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **📋 Contribution Guidelines**
- Follow the existing code style and conventions
- Write comprehensive tests for new features
- Update documentation for any API changes
- Ensure all tests pass before submitting

---

## 🛣️ **Roadmap**

### **🔮 Upcoming Features**
- [ ] **Multi-token Support** - Accept donations in various cryptocurrencies
- [ ] **Advanced Analytics** - Detailed impact measurement and reporting
- [ ] **Mobile App** - Native iOS and Android applications
- [ ] **Integration APIs** - Connect with existing charity management systems
- [ ] **Governance Token** - Community-driven platform governance
- [ ] **NFT Rewards** - Recognition tokens for donors and verified projects

---

## 📚 **Resources**

### **📖 Documentation**
- [Aptos Developer Docs](https://aptos.dev/)
- [Move Language Reference](https://move-language.github.io/move/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### **🔗 Useful Links**
- [Aptos Explorer](https://explorer.aptoslabs.com/)
- [Aptos Wallet](https://aptoswallet.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

## 📞 **Support & Community**

### **💬 Get Help**
- **GitHub Issues** - Report bugs and request features
- **Discord** - Join our community discussions
- **Documentation** - Comprehensive guides and API references

### **🤝 Connect With Us**
- **Twitter** - [@AptosCharitable](#)
- **Discord** - [Join our server](#)
- **Telegram** - [Community group](#)

---

## 📄 **License**

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**🌟 Built with ❤️ on Aptos Blockchain 🌟**

*Empowering transparent charity through blockchain technology*

[![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-black?logo=next.js)](https://nextjs.org/)
[![Powered by Aptos](https://img.shields.io/badge/Powered%20by-Aptos-00D4AA?logo=aptos)](https://aptos.dev/)
[![Built with TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)

</div>
