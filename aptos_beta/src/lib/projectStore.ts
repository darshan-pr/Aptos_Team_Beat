"use client";

// Core interfaces for the charitable project workflow
export interface ProjectImage {
  url: string;
  caption?: string;
  uploadDate: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  fundingAmount: number; // Current target amount (can be reduced when released)
  originalFundingAmount: number; // Original target amount (never changes)
  isCompleted: boolean;
  completionDate?: string;
  completionImages?: ProjectImage[];
  verificationStatus: "pending" | "awaiting_verification" | "verified" | "rejected";
  verificationDeadline?: string; // 3-5 days after completion
  verifications: {
    verifierId: string; // wallet address
    verifierName: string;
    status: "approved" | "rejected";
    comments: string;
    timestamp: string;
    proofImages?: ProjectImage[];
  }[];
  escrowReleased: boolean; // Track if funds have been released
}

export interface EscrowDonation {
  id: string;
  donorId: string; // wallet address
  donorName: string;
  projectId: string;
  milestoneId: string;
  amount: number;
  timestamp: string;
  isReleased: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  organizationId: string; // wallet address
  organizationName: string;
  location: string;
  targetAmount: number;
  currentMilestone: Milestone | null;
  milestones: Milestone[];
  images: ProjectImage[];
  status: "active" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: "ngo" | "donor" | "verifier" | "community";
  content: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  type: "milestone_completion" | "verification" | "project_update" | "donation" | "fund_release";
  projectId?: string;
  organizationId: string;
  authorId: string; // wallet address
  authorName: string;
  authorRole: "ngo" | "donor" | "verifier" | "community";
  title: string;
  content: string;
  images?: ProjectImage[];
  timestamp: string;
  milestoneId?: string;
  releaseAmount?: number; // For fund_release posts
  likes: number;
  comments: PostComment[];
}

// Initial sample data
const INITIAL_PROJECT: Project = {
  id: "1",
  title: "Clean Water Initiative for Rural Communities",
  description: "Providing sustainable clean water access to 500 families in rural Kenya through well drilling and solar-powered pumping systems.",
  organizationId: "0x123...abc", // Mock wallet address
  organizationName: "Water For Life Foundation",
  location: "Machakos County, Kenya",
  targetAmount: 75000,
  currentMilestone: null,
  images: [
    {
      url: "https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      caption: "Current water source - families walk hours daily",
      uploadDate: "2024-01-15T00:00:00Z"
    }
  ],
  milestones: [
    {
      id: "m1",
      title: "Site Survey and Permits",
      description: "Complete geological survey, obtain drilling permits, and finalize well locations with community input.",
      dueDate: "2024-03-15",
      fundingAmount: 15000,
      originalFundingAmount: 15000,
      isCompleted: true,
      completionDate: "2024-03-10",
      verificationStatus: "verified",
      verifications: [
        {
          verifierId: "0x456...def",
          verifierName: "Sarah Johnson",
          status: "approved",
          comments: "All permits obtained and geological reports look comprehensive.",
          timestamp: "2024-03-12T10:30:00Z"
        }
      ],
      escrowReleased: true
    },
    {
      id: "m2",
      title: "Well Drilling Phase 1",
      description: "Drill the first well to 80m depth and install initial casing.",
      dueDate: "2024-05-30",
      fundingAmount: 25000,
      originalFundingAmount: 25000,
      isCompleted: true,
      completionDate: "2024-05-25",
      verificationStatus: "awaiting_verification",
      verifications: [
        {
          verifierId: "0x456...def",
          verifierName: "Sarah Johnson",
          status: "approved",
          comments: "Well drilling completed successfully with proper depth and casing installation.",
          timestamp: "2024-05-26T14:30:00Z"
        },
        {
          verifierId: "0x789...ghi",
          verifierName: "Michael Chen",
          status: "approved",
          comments: "Verified the well quality and depth measurements. Excellent work!",
          timestamp: "2024-05-27T09:15:00Z"
        }
      ],
      escrowReleased: false
    },
    {
      id: "m3",
      title: "Solar Pump Installation",
      description: "Install solar-powered water pumping system and connecting pipes.",
      dueDate: "2024-07-15",
      fundingAmount: 20000,
      originalFundingAmount: 20000,
      isCompleted: false,
      verificationStatus: "pending",
      verifications: [],
      escrowReleased: false
    },
    {
      id: "m4",
      title: "Community Training & Handover",
      description: "Train local community on maintenance and officially hand over the system.",
      dueDate: "2024-08-30",
      fundingAmount: 15000,
      originalFundingAmount: 15000,
      isCompleted: false,
      verificationStatus: "pending",
      verifications: [],
      escrowReleased: false
    }
  ],
  status: "active",
  createdAt: "2024-01-10T00:00:00Z",
  updatedAt: "2024-05-25T00:00:00Z"
};

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post1",
    type: "milestone_completion",
    projectId: "1",
    organizationId: "0x123...abc",
    authorId: "0x123...abc",
    authorName: "Water For Life Foundation",
    authorRole: "ngo",
    title: "Site Survey and Permits Completed! ✅",
    content: "We're excited to share that our first milestone has been completed! Our team has successfully completed the geological survey and obtained all necessary permits for drilling. The community has been incredibly supportive throughout this process.",
    timestamp: "2024-03-10T15:30:00Z",
    milestoneId: "m1",
    likes: 24,
    comments: [
      {
        id: "c1",
        authorId: "0x456...def",
        authorName: "Sarah Johnson",
        authorRole: "verifier",
        content: "Great work! The geological reports are very thorough and the permits are all in order.",
        timestamp: "2024-03-11T09:15:00Z"
      },
      {
        id: "c2",
        authorId: "0x789...ghi",
        authorName: "Michael Chen",
        authorRole: "donor",
        content: "This is exactly the kind of transparency we love to see. Keep up the excellent work!",
        timestamp: "2024-03-11T14:22:00Z"
      }
    ]
  },
  {
    id: "post2",
    type: "verification",
    projectId: "1",
    organizationId: "0x123...abc",
    authorId: "0x456...def",
    authorName: "Sarah Johnson",
    authorRole: "verifier",
    title: "Milestone Verification: Site Survey and Permits",
    content: "Verification approved for milestone 'Site Survey and Permits'. All permits obtained and geological reports look comprehensive. The team has shown excellent attention to detail and community engagement.",
    timestamp: "2024-03-12T10:30:00Z",
    milestoneId: "m1",
    likes: 18,
    comments: [
      {
        id: "c3",
        authorId: "0x123...abc",
        authorName: "Water For Life Foundation",
        authorRole: "ngo",
        content: "Thank you for the thorough verification! We're now moving to the next phase.",
        timestamp: "2024-03-12T11:45:00Z"
      }
    ]
  },
  {
    id: "post3",
    type: "project_update",
    projectId: "1",
    organizationId: "0x123...abc",
    authorId: "0x123...abc",
    authorName: "Water For Life Foundation",
    authorRole: "ngo",
    title: "Community Engagement Update",
    content: "We held a town hall meeting with the local community yesterday. Over 150 families attended and provided valuable input on well locations. The excitement and support from the community is incredible!",
    timestamp: "2024-02-28T16:20:00Z",
    likes: 31,
    comments: [
      {
        id: "c4",
        authorId: "0xabc...123",
        authorName: "Local Community Leader",
        authorRole: "community",
        content: "Thank you for listening to our needs. This project will change our lives!",
        timestamp: "2024-02-29T08:30:00Z"
      },
      {
        id: "c5",
        authorId: "0x789...ghi",
        authorName: "Michael Chen",
        authorRole: "donor",
        content: "Love seeing this level of community involvement. This is how projects should be done!",
        timestamp: "2024-02-29T12:15:00Z"
      }
    ]
  }
];

const INITIAL_ESCROW: EscrowDonation[] = [
  {
    id: "escrow1",
    donorId: "0x789...ghi",
    donorName: "Michael Chen",
    projectId: "1",
    milestoneId: "m1",
    amount: 8000,
    timestamp: "2024-02-15T10:00:00Z",
    isReleased: true
  },
  {
    id: "escrow2",
    donorId: "0xabc...123",
    donorName: "Sarah Williams",
    projectId: "1",
    milestoneId: "m1",
    amount: 7000,
    timestamp: "2024-02-20T14:30:00Z",
    isReleased: true
  },
  {
    id: "escrow3",
    donorId: "0x789...ghi",
    donorName: "Michael Chen",
    projectId: "1",
    milestoneId: "m2",
    amount: 15000,
    timestamp: "2024-03-05T09:15:00Z",
    isReleased: false
  },
  {
    id: "escrow4",
    donorId: "0xdef...456",
    donorName: "Community Donor",
    projectId: "1",
    milestoneId: "m2",
    amount: 10000,
    timestamp: "2024-03-10T16:45:00Z",
    isReleased: false
  },
  {
    id: "escrow5",
    donorId: "0xabc...123",
    donorName: "Sarah Williams",
    projectId: "1",
    milestoneId: "m3",
    amount: 8000,
    timestamp: "2024-04-15T11:30:00Z",
    isReleased: false
  },
  {
    id: "escrow6",
    donorId: "0x111...222",
    donorName: "Local Business",
    projectId: "1",
    milestoneId: "m3",
    amount: 15000,
    timestamp: "2024-05-20T13:45:00Z",
    isReleased: false
  },
  {
    id: "escrow7",
    donorId: "0x333...444",
    donorName: "International Aid",
    projectId: "1",
    milestoneId: "m3",
    amount: 5000,
    timestamp: "2024-05-22T16:20:00Z",
    isReleased: false
  }
];

// Optimized store implementation focused on core workflow
class ProjectStore {
  private storageKey = 'aptos_charitable_projects';
  private escrowStorageKey = 'aptos_escrow_donations';
  private postsStorageKey = 'aptos_community_posts';
  private userVerificationsKey = 'aptos_user_verifications';

  private projects: Project[] = [INITIAL_PROJECT];
  private escrowDonations: EscrowDonation[] = INITIAL_ESCROW;
  private posts: CommunityPost[] = INITIAL_POSTS;
  private userVerifications: Map<string, Set<string>> = new Map(); // userId -> Set of milestoneIds

  constructor() {
    this.loadFromStorage();
    this.setCurrentMilestone();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const storedProjects = localStorage.getItem(this.storageKey);
      const storedEscrow = localStorage.getItem(this.escrowStorageKey);
      const storedPosts = localStorage.getItem(this.postsStorageKey);
      const storedVerifications = localStorage.getItem(this.userVerificationsKey);

      if (storedProjects) {
        this.projects = JSON.parse(storedProjects);
        // Migrate old data to add originalFundingAmount if missing
        this.projects = this.projects.map(project => ({
          ...project,
          milestones: project.milestones.map(milestone => ({
            ...milestone,
            originalFundingAmount: milestone.originalFundingAmount || milestone.fundingAmount
          }))
        }));
      }
      if (storedEscrow) this.escrowDonations = JSON.parse(storedEscrow);
      if (storedPosts) this.posts = JSON.parse(storedPosts);
      if (storedVerifications) {
        const verData = JSON.parse(storedVerifications);
        this.userVerifications = new Map(Object.entries(verData).map(([k, v]) => [k, new Set(v as string[])]));
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(this.projects));
      localStorage.setItem(this.escrowStorageKey, JSON.stringify(this.escrowDonations));
      localStorage.setItem(this.postsStorageKey, JSON.stringify(this.posts));
      
      const verData = Object.fromEntries(
        Array.from(this.userVerifications.entries()).map(([k, v]) => [k, Array.from(v)])
      );
      localStorage.setItem(this.userVerificationsKey, JSON.stringify(verData));
    }
  }

  private setCurrentMilestone() {
    this.projects.forEach(project => {
      const incompleteMilestone = project.milestones.find(m => !m.isCompleted);
      project.currentMilestone = incompleteMilestone || null;
    });
  }

  // 1. PROJECT CREATION
  createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'currentMilestone'>): Project {
    // Ensure all milestones have originalFundingAmount set
    const milestonesWithOriginal = projectData.milestones.map(milestone => ({
      ...milestone,
      originalFundingAmount: milestone.originalFundingAmount || milestone.fundingAmount
    }));

    const newProject: Project = {
      ...projectData,
      milestones: milestonesWithOriginal,
      id: Date.now().toString(),
      currentMilestone: milestonesWithOriginal.find(m => !m.isCompleted) || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.projects.push(newProject);
    this.saveToStorage();

    // Create community post for new project
    this.createCommunityPost({
      type: "milestone_completion",
      projectId: newProject.id,
      organizationId: newProject.organizationId,
      authorId: newProject.organizationId,
      authorName: newProject.organizationName,
      authorRole: "ngo",
      title: `New Project Created: ${newProject.title}`,
      content: `We're excited to announce our new project: ${newProject.title}. ${newProject.description}`,
      likes: 0,
      comments: []
    });

    return newProject;
  }

  // DONATIONS (HELD IN ESCROW)
  
  // Determine which milestone should receive new donations
  getTargetMilestoneForDonation(projectId: string): {
    milestoneId: string | null;
    milestone: Milestone | null;
    reason: string;
  } {
    const project = this.getProjectById(projectId);
    if (!project) {
      return {
        milestoneId: null,
        milestone: null,
        reason: "Project not found"
      };
    }

    // Check if project has reached its total target
    const totalRaised = this.getTotalRaisedForProject(projectId);
    if (totalRaised >= project.targetAmount) {
      return {
        milestoneId: null,
        milestone: null,
        reason: "Project has reached its funding goal"
      };
    }

    // Find the first unreleased milestone (funds flow sequentially)
    for (const milestone of project.milestones) {
      if (!milestone.escrowReleased) {
        return {
          milestoneId: milestone.id,
          milestone,
          reason: `Funding current active milestone: "${milestone.title}"`
        };
      }
    }

    return {
      milestoneId: null,
      milestone: null,
      reason: "All milestones have been completed and funded"
    };
  }

  // Smart donation method that automatically assigns to the right milestone
  addSmartDonation(
    projectId: string,
    amount: number,
    donorId: string,
    donorName: string
  ): {
    success: boolean;
    message: string;
    milestoneId?: string;
    milestoneName?: string;
  } {
    const project = this.getProjectById(projectId);
    if (!project) {
      return {
        success: false,
        message: "Project not found"
      };
    }

    const targetInfo = this.getTargetMilestoneForDonation(projectId);
    
    if (!targetInfo.milestoneId || !targetInfo.milestone) {
      return {
        success: false,
        message: targetInfo.reason
      };
    }

    const success = this.addDonationToEscrow(
      projectId,
      targetInfo.milestoneId,
      amount,
      donorId,
      donorName
    );

    if (success) {
      return {
        success: true,
        message: `Donation of $${amount.toLocaleString()} added to "${targetInfo.milestone.title}"`,
        milestoneId: targetInfo.milestoneId,
        milestoneName: targetInfo.milestone.title
      };
    } else {
      return {
        success: false,
        message: "Failed to process donation"
      };
    }
  }

  addDonationToEscrow(
    projectId: string, 
    milestoneId: string, 
    amount: number, 
    donorId: string, 
    donorName: string
  ): boolean {
    const project = this.getProjectById(projectId);
    const milestone = project?.milestones.find(m => m.id === milestoneId);
    
    if (!project || !milestone) return false;

    const donation: EscrowDonation = {
      id: Date.now().toString(),
      donorId,
      donorName,
      projectId,
      milestoneId,
      amount,
      timestamp: new Date().toISOString(),
      isReleased: false
    };

    this.escrowDonations.push(donation);
    this.saveToStorage();

    // Auto-trigger fund release check for verified milestones
    if (milestone.verificationStatus === 'verified' && !milestone.escrowReleased) {
      setTimeout(() => {
        const validation = this.validateFundRelease(projectId, milestoneId);
        if (validation.isValid) {
          this.releaseFundsForMilestone(projectId, milestoneId);
        }
      }, 100); // Small delay to ensure data is saved
    }

    return true;
  }

  // 3. MILESTONE COMPLETION
  completeMilestone(
    projectId: string, 
    milestoneId: string, 
    completionImages?: ProjectImage[]
  ): boolean {
    const project = this.getProjectById(projectId);
    if (!project) return false;

    const milestone = project.milestones.find(m => m.id === milestoneId);
    if (!milestone || milestone.isCompleted) return false;

    // Update milestone
    milestone.isCompleted = true;
    milestone.completionDate = new Date().toISOString();
    milestone.completionImages = completionImages;
    milestone.verificationStatus = "awaiting_verification";
    milestone.verificationDeadline = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(); // 5 days

    // Update project
    project.currentMilestone = project.milestones.find(m => !m.isCompleted) || null;
    project.updatedAt = new Date().toISOString();

    this.saveToStorage();

    // Create community post for milestone completion
    this.createCommunityPost({
      type: "milestone_completion",
      projectId,
      organizationId: project.organizationId,
      authorId: project.organizationId,
      authorName: project.organizationName,
      authorRole: "ngo",
      title: `Milestone Completed: ${milestone.title} ✅`,
      content: `We're happy to announce the completion of milestone "${milestone.title}" for ${project.title}.`,
      images: completionImages,
      milestoneId,
      likes: 0,
      comments: []
    });

    return true;
  }

  // 4. COMMUNITY VERIFICATION (One verification per user per milestone)
  addMilestoneVerification(
    projectId: string, 
    milestoneId: string, 
    verifierId: string,
    verifierName: string,
    status: "approved" | "rejected",
    comments: string,
    proofImages?: ProjectImage[]
  ): boolean {
    const project = this.getProjectById(projectId);
    if (!project) return false;

    const milestone = project.milestones.find(m => m.id === milestoneId);
    if (!milestone || !milestone.isCompleted) return false;

    // Check if user has already verified this milestone
    const userVerified = this.userVerifications.get(verifierId);
    if (userVerified?.has(milestoneId)) {
      return false; // User can only verify once
    }

    // Check verification deadline
    if (milestone.verificationDeadline && new Date() > new Date(milestone.verificationDeadline)) {
      return false; // Verification period expired
    }

    // Add verification
    const verification = {
      verifierId,
      verifierName,
      status,
      comments,
      timestamp: new Date().toISOString(),
      proofImages
    };

    milestone.verifications.push(verification);

    // Track user verification
    if (!this.userVerifications.has(verifierId)) {
      this.userVerifications.set(verifierId, new Set());
    }
    this.userVerifications.get(verifierId)!.add(milestoneId);

    // Update verification status and check for automatic release
    const approvals = milestone.verifications.filter(v => v.status === 'approved').length;
    const rejections = milestone.verifications.filter(v => v.status === 'rejected').length;

    if (approvals >= 2) {
      milestone.verificationStatus = 'verified';
      // Validate and release funds automatically when conditions are met
      const validation = this.validateFundRelease(projectId, milestoneId);
      if (validation.isValid) {
        this.releaseFundsForMilestone(projectId, milestoneId);
      } else {
        console.warn(`Cannot release funds for verified milestone: ${validation.message}`);
        // Create a post about the funding issue
        this.createCommunityPost({
          type: "project_update",
          projectId,
          organizationId: project.organizationId,
          authorId: project.organizationId,
          authorName: project.organizationName,
          authorRole: "ngo",
          title: `⚠️ Verified Milestone Pending Fund Release: ${milestone.title}`,
          content: `Milestone "${milestone.title}" has been verified by ${approvals} community members, but fund release is pending: ${validation.message}`,
          milestoneId,
          likes: 0,
          comments: []
        });
      }
    } else if (rejections >= 2) {
      milestone.verificationStatus = 'rejected';
    }

    project.updatedAt = new Date().toISOString();
    this.saveToStorage();

    // Create verification post
    this.createCommunityPost({
      type: "verification",
      projectId,
      organizationId: project.organizationId,
      authorId: verifierId,
      authorName: verifierName,
      authorRole: "verifier",
      title: `Milestone Verification: ${milestone.title}`,
      content: `Verification ${status} for milestone "${milestone.title}". ${comments}`,
      images: proofImages,
      milestoneId,
      likes: 0,
      comments: []
    });

    return true;
  }

    // 5. FUNDING RELEASE WITH VALIDATION - Enhanced according to fund release rules
  private validateFundRelease(projectId: string, milestoneId: string): {
    isValid: boolean;
    message: string;
    availableInEscrow: number;
    requiredFunding: number;
    verifierCount: number;
  } {
    const project = this.projects.find(p => p.id === projectId);
    const milestone = project?.milestones.find(m => m.id === milestoneId);
    
    if (!project || !milestone) {
      return {
        isValid: false,
        message: "Project or milestone not found",
        availableInEscrow: 0,
        requiredFunding: 0,
        verifierCount: 0
      };
    }

    // Check if milestone is already fully released
    if (milestone.escrowReleased) {
      return {
        isValid: false,
        message: "Milestone has already been fully funded and released",
        availableInEscrow: 0,
        requiredFunding: 0,
        verifierCount: milestone.verifications.filter(v => v.status === 'approved').length
      };
    }

    // Get available escrow funds for this milestone using flowing logic
    // All unreleased escrow goes to the first unreleased milestone
    const allUnreleasedEscrow = this.escrowDonations
      .filter(d => d.projectId === projectId && !d.isReleased);
    
    // Find the first unreleased milestone
    const firstUnreleasedMilestone = project.milestones.find(m => !m.escrowReleased);
    
    let availableInEscrow = 0;
    if (firstUnreleasedMilestone && firstUnreleasedMilestone.id === milestoneId) {
      // This is the first unreleased milestone - it gets all unreleased escrow
      availableInEscrow = allUnreleasedEscrow.reduce((sum, d) => sum + d.amount, 0);
    } else if (milestone.escrowReleased) {
      // Already released milestone
      availableInEscrow = 0;
    } else {
      // Future milestone - no escrow available yet
      availableInEscrow = 0;
    }
    
    const requiredFunding = milestone.originalFundingAmount; // Use original target for validation
    const verifierCount = milestone.verifications.filter(v => v.status === 'approved').length;

    // RULE 1: The milestone must be verified by two or more community members
    if (verifierCount < 2) {
      return {
        isValid: false,
        message: `Verification requirement not met: ${verifierCount}/2 community verifiers required. Need at least 2 community members to verify this milestone before funds can be released.`,
        availableInEscrow,
        requiredFunding,
        verifierCount
      };
    }

    // RULE 2: The target amount for that specific milestone must be available in the escrow account
    if (availableInEscrow < requiredFunding) {
      return {
        isValid: false,
        message: `Escrow funding requirement not met: $${availableInEscrow.toLocaleString()} available in escrow, but milestone requires $${requiredFunding.toLocaleString()}. Funds will be held until sufficient donations are received.`,
        availableInEscrow,
        requiredFunding,
        verifierCount
      };
    }

    // Both conditions met - funds can be released
    return {
      isValid: true,
      message: `Both release conditions satisfied: ✅ ${verifierCount} community verifications, ✅ $${availableInEscrow.toLocaleString()} available in escrow (target: $${requiredFunding.toLocaleString()})`,
      availableInEscrow,
      requiredFunding,
      verifierCount
    };
  }

  private releaseFundsForMilestone(projectId: string, milestoneId: string): void {
    const validation = this.validateFundRelease(projectId, milestoneId);
    
    if (!validation.isValid) {
      console.warn(`Fund release validation failed: ${validation.message}`);
      return;
    }

    const project = this.projects.find(p => p.id === projectId);
    const milestone = project?.milestones.find(m => m.id === milestoneId);
    
    if (!project || !milestone) return;

    // Prevent double release
    if (milestone.escrowReleased) {
      console.warn(`Milestone "${milestone.title}" funds already released`);
      return;
    }

    // Get unreleased escrow funds for the project (all unreleased funds flow to current milestone)
    const escrowFunds = this.escrowDonations
      .filter(d => d.projectId === projectId && !d.isReleased)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    const targetAmount = milestone.originalFundingAmount; // Use original target for release amount
    let releasedAmount = 0;

    // ESCROW AND TARGET MANAGEMENT: Release funds exactly as per rules
    for (const donation of escrowFunds) {
      if (releasedAmount >= targetAmount) break;
      
      const remainingToRelease = targetAmount - releasedAmount;
      const releaseFromThisDonation = Math.min(donation.amount, remainingToRelease);
      
      if (releaseFromThisDonation === donation.amount) {
        // Release the entire donation
        donation.isReleased = true;
        releasedAmount += donation.amount;
      } else {
        // Partial release - split the donation
        const unreleasedPortion: EscrowDonation = {
          ...donation,
          id: Date.now().toString() + "_remainder",
          amount: donation.amount - releaseFromThisDonation
        };
        
        // Update original donation to released amount
        donation.amount = releaseFromThisDonation;
        donation.isReleased = true;
        
        // Add the unreleased portion back to escrow
        this.escrowDonations.push(unreleasedPortion);
        
        releasedAmount += releaseFromThisDonation;
      }
    }

    // Verify we released exactly the target amount
    if (releasedAmount !== targetAmount) {
      console.error(`Release amount mismatch: Released ${releasedAmount}, Target ${targetAmount}`);
      return;
    }

    // UPDATE BALANCES AS PER RULES:
    // 1. The released amount is deducted from the escrow balance (handled above by marking donations as released)
    // 2. Mark milestone as funds released (keeping original target intact for reference)
    milestone.escrowReleased = true;
    
    // NOTE: We do NOT reduce milestone.fundingAmount because:
    // - Original target should remain as reference point
    // - Released funds are tracked separately via escrowReleased flag
    // - This prevents "over-release" false positives

    project.updatedAt = new Date().toISOString();

    // FINAL BALANCE CHECK: After all milestones are completed and funds are released, 
    // the final escrow and target balances must be set to zero
    const allMilestonesCompleted = project.milestones.every(m => m.isCompleted);
    const allMilestonesReleased = project.milestones.every(m => m.escrowReleased);
    
    if (allMilestonesCompleted && allMilestonesReleased) {
      // Mark project as completed if all milestones are done and released
      if (project.status === 'active') {
        project.status = 'completed';
      }
    }

    this.saveToStorage();

    // Create a community post about the successful fund release
    this.createCommunityPost({
      type: "fund_release",
      projectId,
      organizationId: project.organizationId,
      authorId: project.organizationId,
      authorName: project.organizationName,
      authorRole: "ngo",
      title: `💰 Funds Released: ${milestone.title}`,
      content: `Milestone "${milestone.title}" has been verified by ${validation.verifierCount} community members and exactly $${releasedAmount.toLocaleString()} has been released from escrow. The organization can now proceed with this phase of the project.`,
      milestoneId,
      releaseAmount: releasedAmount,
      likes: 0,
      comments: []
    });

    console.log(`Successfully released exactly $${releasedAmount.toLocaleString()} for milestone "${milestone.title}" - Remaining target: $${milestone.fundingAmount.toLocaleString()}`);
  }

  // EMERGENCY/IMMEDIATE RELEASE - For urgent scenarios and demonstrations
  immediateReleaseFunds(projectId: string, milestoneId: string, reason: string): {
    success: boolean;
    message: string;
    releasedAmount?: number;
  } {
    const project = this.getProjectById(projectId);
    if (!project) {
      return {
        success: false,
        message: "Project not found"
      };
    }

    const milestone = project.milestones.find(m => m.id === milestoneId);
    if (!milestone) {
      return {
        success: false,
        message: "Milestone not found"
      };
    }

    // Check if milestone is already released
    if (milestone.escrowReleased) {
      return {
        success: false,
        message: "Funds already released for this milestone"
      };
    }

    // Get available escrow funds for the project (flowing logic)
    const allUnreleasedEscrow = this.getEscrowDonationsForProject(projectId)
      .filter(d => !d.isReleased);
    
    if (allUnreleasedEscrow.length === 0) {
      return {
        success: false,
        message: "No escrow funds available for this project"
      };
    }

    // Calculate total available in escrow for the project
    const totalAvailableInEscrow = allUnreleasedEscrow.reduce((sum, d) => sum + d.amount, 0);
    
    // Check if we have enough funds in escrow to meet the milestone funding requirement
    if (totalAvailableInEscrow < milestone.originalFundingAmount) {
      return {
        success: false,
        message: `Insufficient funds in project escrow: $${totalAvailableInEscrow.toLocaleString()} available, but milestone requires $${milestone.originalFundingAmount.toLocaleString()}`
      };
    }

    // Emergency release bypasses verifier requirement but still validates funding amount
    // Sort escrow funds by timestamp (FIFO)
    const sortedEscrowFunds = allUnreleasedEscrow.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    const targetAmount = milestone.originalFundingAmount;
    let releasedAmount = 0;

    // Release funds from escrow donations until we reach EXACTLY the milestone amount
    for (const donation of sortedEscrowFunds) {
      if (releasedAmount >= targetAmount) break;
      
      const remainingToRelease = targetAmount - releasedAmount;
      const releaseFromThisDonation = Math.min(donation.amount, remainingToRelease);
      
      if (releaseFromThisDonation === donation.amount) {
        // Release the entire donation
        donation.isReleased = true;
        releasedAmount += donation.amount;
      } else {
        // Partial release - split the donation
        const unreleasedPortion: EscrowDonation = {
          ...donation,
          id: Date.now().toString() + "_emergency_remainder",
          amount: donation.amount - releaseFromThisDonation
        };
        
        // Update original donation to released amount
        donation.amount = releaseFromThisDonation;
        donation.isReleased = true;
        
        // Add the unreleased portion back to escrow
        this.escrowDonations.push(unreleasedPortion);
        
        releasedAmount += releaseFromThisDonation;
      }
    }

    // Verify we released exactly the target amount
    if (releasedAmount !== targetAmount) {
      return {
        success: false,
        message: `Emergency release failed: Could only release $${releasedAmount.toLocaleString()}, but target is $${targetAmount.toLocaleString()}`
      };
    }

    // Mark milestone as funds released
    milestone.escrowReleased = true;
    project.updatedAt = new Date().toISOString();
    this.saveToStorage();

    // Create a community post about the emergency release
    this.createCommunityPost({
      type: "project_update",
      projectId,
      organizationId: project.organizationId,
      authorId: project.organizationId,
      authorName: project.organizationName,
      authorRole: "ngo",
      title: `🚨 Emergency Fund Release: ${milestone.title}`,
      content: `Emergency release of exactly $${releasedAmount.toLocaleString()} for milestone "${milestone.title}" (Target: $${targetAmount.toLocaleString()}). Reason: ${reason}`,
      likes: 0,
      comments: []
    });

    return {
      success: true,
      message: `Successfully released exactly $${releasedAmount.toLocaleString()} for milestone "${milestone.title}"`,
      releasedAmount
    };
  }

  // Get fund release validation information
  getFundReleaseValidation(projectId: string, milestoneId: string) {
    return this.validateFundRelease(projectId, milestoneId);
  }

  // Validate and fix any data inconsistencies in fund releases
  validateAndFixFundConsistency(projectId: string): {
    issues: string[];
    fixed: boolean;
  } {
    const project = this.getProjectById(projectId);
    const issues: string[] = [];
    let hasChanges = false;

    if (!project) {
      return { issues: ["Project not found"], fixed: false };
    }

    for (const milestone of project.milestones) {
      const released = this.getTotalReleasedForMilestone(projectId, milestone.id);

      // Check for over-releases
      if (released > milestone.fundingAmount) {
        issues.push(`Milestone "${milestone.title}": Released $${released.toLocaleString()} exceeds target $${milestone.fundingAmount.toLocaleString()}`);
      }

      // Check for inconsistent release status
      if (milestone.escrowReleased && released === 0) {
        issues.push(`Milestone "${milestone.title}": Marked as released but no funds actually released`);
        milestone.escrowReleased = false;
        hasChanges = true;
      }

      // Check for completed releases that aren't marked as released
      if (!milestone.escrowReleased && released >= milestone.fundingAmount) {
        issues.push(`Milestone "${milestone.title}": Has sufficient releases but not marked as released`);
        milestone.escrowReleased = true;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      this.saveToStorage();
    }

    return { issues, fixed: hasChanges };
  }

  // Manual refresh to attempt fund release for verified milestones
  refreshFundRelease(projectId: string, milestoneId: string): {
    success: boolean;
    message: string;
    releasedAmount?: number;
  } {
    const project = this.getProjectById(projectId);
    if (!project) {
      return {
        success: false,
        message: "Project not found"
      };
    }

    const milestone = project.milestones.find(m => m.id === milestoneId);
    if (!milestone) {
      return {
        success: false,
        message: "Milestone not found"
      };
    }

    // Check if milestone is already released
    if (milestone.escrowReleased) {
      return {
        success: false,
        message: "Funds already released for this milestone"
      };
    }

    // Check if milestone is completed and verified
    if (!milestone.isCompleted) {
      return {
        success: false,
        message: "Milestone must be completed before fund release"
      };
    }

    if (milestone.verificationStatus !== 'verified') {
      const approvals = milestone.verifications.filter(v => v.status === 'approved').length;
      return {
        success: false,
        message: `Milestone not yet verified. Current approvals: ${approvals}/2 required`
      };
    }

    // Attempt fund release with validation
    const validation = this.validateFundRelease(projectId, milestoneId);
    if (validation.isValid) {
      this.releaseFundsForMilestone(projectId, milestoneId);
      return {
        success: true,
        message: `Successfully released $${milestone.fundingAmount.toLocaleString()} for milestone "${milestone.title}"`,
        releasedAmount: milestone.fundingAmount
      };
    } else {
      return {
        success: false,
        message: validation.message
      };
    }
  }

  // UTILITY METHODS
  getAllProjects(): Project[] {
    return this.projects;
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  getActiveProjects(): Project[] {
    return this.projects.filter(p => p.status === 'active');
  }

  getEscrowByMilestone(projectId: string, milestoneId: string): EscrowDonation[] {
    return this.escrowDonations.filter(
      e => e.projectId === projectId && e.milestoneId === milestoneId
    );
  }

  getEscrowDonationsForProject(projectId: string): EscrowDonation[] {
    return this.escrowDonations.filter(e => e.projectId === projectId);
  }

  getTotalEscrowForMilestone(projectId: string, milestoneId: string): number {
    const project = this.getProjectById(projectId);
    if (!project) return 0;
    
    const milestone = project.milestones.find(m => m.id === milestoneId);
    if (!milestone) return 0;
    
    // If milestone is already released, no escrow
    if (milestone.escrowReleased) return 0;
    
    // Find the first unreleased milestone
    const firstUnreleased = project.milestones.find(m => !m.escrowReleased);
    
    // Only the first unreleased milestone gets all the unreleased escrow
    if (firstUnreleased && firstUnreleased.id === milestoneId) {
      return this.escrowDonations
        .filter(d => d.projectId === projectId && !d.isReleased)
        .reduce((sum, donation) => sum + donation.amount, 0);
    }
    
    return 0;
  }

  getTotalReleasedForMilestone(projectId: string, milestoneId: string): number {
    return this.escrowDonations
      .filter(d => d.projectId === projectId && d.milestoneId === milestoneId && d.isReleased)
      .reduce((sum, donation) => sum + donation.amount, 0);
  }

  getTotalDonatedToMilestone(projectId: string, milestoneId: string): number {
    return this.escrowDonations
      .filter(d => d.projectId === projectId && d.milestoneId === milestoneId)
      .reduce((sum, donation) => sum + donation.amount, 0);
  }

  getTotalRaisedForProject(projectId: string): number {
    return this.escrowDonations
      .filter(d => d.projectId === projectId)
      .reduce((sum, donation) => sum + donation.amount, 0);
  }

  getMilestonesAwaitingVerification(): { project: Project; milestone: Milestone }[] {
    const result: { project: Project; milestone: Milestone }[] = [];
    
    this.projects.forEach(project => {
      project.milestones.forEach(milestone => {
        if (milestone.verificationStatus === 'awaiting_verification' && 
            milestone.verificationDeadline && 
            new Date() <= new Date(milestone.verificationDeadline)) {
          result.push({ project, milestone });
        }
      });
    });

    return result;
  }

  canUserVerify(userId: string, milestoneId: string): boolean {
    const userVerified = this.userVerifications.get(userId);
    return !userVerified?.has(milestoneId);
  }

  getAllPosts(): CommunityPost[] {
    return this.posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  getPostsByProject(projectId: string): CommunityPost[] {
    return this.posts
      .filter(p => p.projectId === projectId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  createCommunityPost(postData: Omit<CommunityPost, 'id' | 'timestamp'>): CommunityPost {
    const newPost: CommunityPost = {
      ...postData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    this.posts.push(newPost);
    this.saveToStorage();
    return newPost;
  }

  likePost(postId: string): boolean {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return false;

    post.likes += 1;
    this.saveToStorage();
    return true;
  }

  addCommentToPost(postId: string, comment: Omit<PostComment, 'id' | 'timestamp'>): boolean {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return false;

    const newComment: PostComment = {
      ...comment,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    post.comments.push(newComment);
    this.saveToStorage();
    return true;
  }

  // Statistics for dashboard
  getProjectStats() {
    const totalProjects = this.projects.length;
    const activeProjects = this.projects.filter(p => p.status === 'active').length;
    const totalEscrow = this.escrowDonations
      .filter(e => !e.isReleased)
      .reduce((sum, e) => sum + e.amount, 0);
    const totalReleased = this.escrowDonations
      .filter(e => e.isReleased)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      totalProjects,
      activeProjects,
      totalEscrow,
      totalReleased,
      awaitingVerification: this.getMilestonesAwaitingVerification().length
    };
  }
}

// Export singleton instance
export const projectStore = new ProjectStore();
