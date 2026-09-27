import type { Metadata } from "next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AudienceDemographics } from "./_components/audience-demographics";
import { FollowerGrowthChart } from "./_components/follower-growth-chart";
import { MarketingKpiStrip } from "./_components/marketing-kpi-strip";
import { MarketingToolbar } from "./_components/marketing-toolbar";
import { PlatformDistribution } from "./_components/platform-distribution";
import { ReachViewsChart } from "./_components/reach-views-chart";
import { TopPostsLeaderboard } from "./_components/top-posts-leaderboard";

// Import flag icons stylesheet for country reach widgets
import "@/styles/flag-icons/flags.css";

export const metadata: Metadata = {
  title: "Marketing Dashboard | Followers, Likes, Views & Reach",
  description:
    "Track social media followers, post likes, video views, and cross-platform reach insights in a unified dashboard.",
  alternates: {
    canonical: "/dashboard/analytics",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl tracking-tight">Marketing Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Monitor social media followers, post likes, video views, and audience reach performance across platforms.
        </p>
      </div>

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="social-media">Social Media</TabsTrigger>
            <TabsTrigger value="content-video">Content & Video</TabsTrigger>
            <TabsTrigger value="audience-reach">Audience & Reach</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          </TabsList>

          <MarketingToolbar />
        </div>

        <TabsContent value="overview" className="flex flex-col gap-4">
          <MarketingKpiStrip />

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <FollowerGrowthChart />
            </div>
            <div className="xl:col-span-5">
              <PlatformDistribution />
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <ReachViewsChart />
            </div>
            <div className="xl:col-span-5">
              <AudienceDemographics />
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-12">
              <TopPostsLeaderboard />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="social-media" className="flex flex-col gap-4">
          <MarketingKpiStrip />
          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <FollowerGrowthChart />
            </div>
            <div className="xl:col-span-5">
              <PlatformDistribution />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content-video" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <ReachViewsChart />
            </div>
            <div className="xl:col-span-5">
              <PlatformDistribution />
            </div>
          </div>
          <TopPostsLeaderboard />
        </TabsContent>

        <TabsContent value="audience-reach" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <ReachViewsChart />
            </div>
            <div className="xl:col-span-5">
              <AudienceDemographics />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-border border-dashed text-muted-foreground">
            <p className="font-medium text-foreground text-sm">Campaign Conversion & ROI Analytics</p>
            <p className="text-xs">
              Connect your ad accounts (Meta Ads, Google Ads, LinkedIn Ads) to track campaign ROI.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
