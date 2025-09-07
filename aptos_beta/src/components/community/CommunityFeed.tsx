"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { projectStore, type CommunityPost } from "@/lib/projectStore";
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  CheckCircle, 
  Calendar,
  MapPin,
  DollarSign,
  Shield
} from "lucide-react";

interface CommunityFeedProps {
  onProjectSelect?: (projectId: string, projectTitle: string) => void;
}

export function CommunityFeed({ onProjectSelect }: CommunityFeedProps) {
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load posts from the store
    const allPosts = projectStore.getAllPosts();
    setPosts(allPosts);
  }, []);

  const toggleLike = (postId: string) => {
    const success = projectStore.likePost(postId);
    if (success) {
      if (likedPosts.has(postId)) {
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        setLikedPosts(prev => new Set(prev).add(postId));
      }
      
      // Refresh posts to get updated like count
      setPosts(projectStore.getAllPosts());
    }
  };

  const handleVerifyMilestone = (projectId: string, milestoneId: string) => {
    const project = projectStore.getProjectById(projectId);
    if (!project) return;

    const milestone = project.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    const success = projectStore.addMilestoneVerification(
      projectId, 
      milestoneId, 
      "current-user",
      "Community Verifier",
      "approved",
      "Milestone verified through community inspection. All deliverables completed as promised."
    );
    
    if (success) {
      // Check fund release validation after verification
      const validation = projectStore.getFundReleaseValidation(projectId, milestoneId);
      
      let toastMessage = `You've successfully verified the milestone "${milestone.title}".`;
      
      if (validation.isValid) {
        toastMessage += " Funds are now being released automatically! 💰";
      } else if (validation.verifierCount >= 2) {
        toastMessage += ` Milestone is verified but awaiting sufficient escrow funds ($${validation.availableInEscrow.toLocaleString()}/$${validation.requiredFunding.toLocaleString()}).`;
      } else {
        toastMessage += ` Need ${2 - validation.verifierCount} more verifier(s) for fund release.`;
      }
      
      toast({
        title: "Milestone Verified! ✅",
        description: toastMessage
      });
      
      // Refresh posts to show new verification and any automatic fund releases
      setPosts(projectStore.getAllPosts());
    }
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case "milestone_completion":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "donation":
        return <DollarSign className="h-5 w-5 text-purple-600" />;
      case "verification":
        return <Shield className="h-5 w-5 text-blue-600" />;
      case "fund_release":
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case "project_update":
        return <MessageCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <MessageCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAuthorTypeColor = (authorRole: string) => {
    switch (authorRole) {
      case "ngo":
        return "text-purple-600";
      case "donor":
        return "text-green-600";
      case "verifier":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getAuthorTypeBadge = (authorRole: string) => {
    switch (authorRole) {
      case "ngo":
        return "NGO";
      case "donor":
        return "Donor";
      case "verifier":
        return "Verifier";
      default:
        return "Community";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getProjectTitle = (projectId: string | undefined) => {
    if (!projectId) return null;
    const project = projectStore.getProjectById(projectId);
    return project?.title || null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-purple-600" />
          Community Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {posts.map((post) => {
          const projectTitle = getProjectTitle(post.projectId);
          
          return (
            <div key={post.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
              {/* Post Header */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {getPostIcon(post.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{post.authorName}</span>
                    <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${getAuthorTypeColor(post.authorRole)}`}>
                      {getAuthorTypeBadge(post.authorRole)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatTimestamp(post.timestamp)}</span>
                    {projectTitle && (
                      <>
                        <span>•</span>
                        <MapPin className="h-4 w-4" />
                        <button 
                          onClick={() => onProjectSelect && post.projectId && onProjectSelect(post.projectId, projectTitle)}
                          className="text-purple-600 hover:text-purple-800 hover:underline transition-colors"
                        >
                          {projectTitle}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="ml-13 mt-3">
                <h4 className="font-medium text-gray-900 mb-2">{post.title}</h4>
                <p className="text-gray-800 leading-relaxed">{post.content}</p>
                
                {/* Post Images */}
                {post.images && post.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {post.images.slice(0, 3).map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          alt={image.caption || "Post image"}
                          className="w-full h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        {image.caption && (
                          <p className="text-xs text-gray-600 mt-1">{image.caption}</p>
                        )}
                      </div>
                    ))}
                    {post.images.length > 3 && (
                      <div className="w-full h-32 bg-gray-100 rounded-lg border flex items-center justify-center">
                        <span className="text-gray-600">+{post.images.length - 3} more</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Comments */}
              {post.comments && post.comments.length > 0 && (
                <div className="ml-13 mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-900">Comments ({post.comments.length})</p>
                  {post.comments.slice(0, 2).map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">{comment.authorName}</span>
                        <span className={`text-xs px-2 py-1 rounded-full bg-gray-200 ${getAuthorTypeColor(comment.authorRole)}`}>
                          {getAuthorTypeBadge(comment.authorRole)}
                        </span>
                        <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                  {post.comments.length > 2 && (
                    <button className="text-sm text-purple-600 hover:text-purple-800">
                      View all {post.comments.length} comments
                    </button>
                  )}
                </div>
              )}

              {/* Post Actions */}
              <div className="ml-13 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-2 ${likedPosts.has(post.id) ? 'text-red-600' : 'text-gray-600'}`}
                  >
                    <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments ? post.comments.length : 0}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </div>

                {/* Verification Actions for Milestone Posts */}
                {post.type === "milestone_completion" && post.milestoneId && (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      onClick={() => handleVerifyMilestone(post.projectId!, post.milestoneId!)}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600"
                      onClick={() => onProjectSelect && post.projectId && projectTitle && onProjectSelect(post.projectId, projectTitle)}
                    >
                      View Project
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {posts.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Posts Yet</h3>
            <p className="text-gray-600">
              Be the first to share an update or create a project to get the community started!
            </p>
          </div>
        )}

        {/* Load More */}
        {posts.length > 0 && (
          <div className="text-center pt-4">
            <Button variant="outline">
              Load More Posts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
