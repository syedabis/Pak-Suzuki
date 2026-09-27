import { Ellipsis } from "lucide-react";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PlatformStat {
  name: string;
  followers: string;
  likesShare: number;
  likesCount: string;
  color: string;
}

const platforms: PlatformStat[] = [
  { name: "Instagram", followers: "47.2k", likesShare: 42, likesCount: "161.3k", color: "bg-pink-500" },
  { name: "YouTube", followers: "39.1k", likesShare: 28, likesCount: "107.5k", color: "bg-red-500" },
  { name: "LinkedIn", followers: "32.6k", likesShare: 18, likesCount: "69.1k", color: "bg-blue-600" },
  { name: "X (Twitter)", followers: "20.4k", likesShare: 8, likesCount: "30.7k", color: "bg-sky-500" },
  { name: "TikTok", followers: "3.55k", likesShare: 4, likesCount: "15.6k", color: "bg-purple-500" },
];

export function PlatformDistribution() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-normal text-base">Likes & Engagement by Platform</CardTitle>
          <CardAction>
            <Ellipsis className="size-4 text-muted-foreground" />
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {platforms.map((platform) => (
          <div key={platform.name} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">{platform.name}</span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{platform.likesCount} likes</span>
                <span>•</span>
                <span className="font-semibold text-foreground">{platform.likesShare}%</span>
              </div>
            </div>
            <Progress value={platform.likesShare} className="h-2" />
          </div>
        ))}

        <div className="mt-2 rounded-lg bg-muted/50 p-3 text-muted-foreground text-xs">
          💡 <span className="font-medium text-foreground">Insight:</span> Instagram & YouTube account for over{" "}
          <span className="font-semibold text-foreground">70%</span> of all total post likes and reel interactions this
          month.
        </div>
      </CardContent>
    </Card>
  );
}
