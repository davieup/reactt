
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PostProvider } from "@/contexts/PostContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { CommunityProvider } from "@/contexts/CommunityContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { VerificationProvider } from "@/contexts/VerificationContext";
import { FeedAlgorithmProvider } from "@/contexts/FeedAlgorithmContext";
import { HomePage } from "./pages/HomePage";
import { ComposePage } from "./pages/ComposePage";
import { ProfilePage } from "./pages/ProfilePage";
import { SearchPage } from "./pages/SearchPage";
import { TrendFeedPage } from "./pages/TrendFeedPage";
import { CommunityPage } from "./pages/CommunityPage";
import { PostDetailPage } from "./pages/PostDetailPage";
import { CommentDetailPage } from "./pages/CommentDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { SettingsPage } from "./pages/SettingsPage";
import { FollowPage } from "./pages/FollowPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <VerificationProvider>
            <NotificationProvider>
              <CommunityProvider>
                <PostProvider>
                  <FeedAlgorithmProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                    <Routes>
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/" element={<HomePage />} />
                      <Route path="/compose" element={<ComposePage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/profile/:userId" element={<ProfilePage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/follow" element={<FollowPage />} />
                      <Route path="/follow/:userId" element={<FollowPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/trend/:hashtag" element={<TrendFeedPage />} />
                      <Route path="/community/:id" element={<CommunityPage />} />
                      <Route path="/post/:postId" element={<PostDetailPage />} />
                      <Route path="/comment/:commentId" element={<CommentDetailPage />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                  </FeedAlgorithmProvider>
                </PostProvider>
              </CommunityProvider>
            </NotificationProvider>
          </VerificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
