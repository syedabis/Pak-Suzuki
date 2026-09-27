import { ArrowUpRight, Ellipsis, Eye, Heart, Radio, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MarketingKpiStrip() {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10">
      <div className="grid divide-y *:data-[slot=card]:rounded-none *:data-[slot=card]:ring-0 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="size-4" />
              </div>
              <CardTitle className="font-normal text-sm">Social Followers</CardTitle>
            </div>
            <CardAction>
              <Ellipsis className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="font-semibold text-2xl leading-none tracking-tight">142,850</div>
              <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">
                <ArrowUpRight className="size-3.5" />
                12.4%
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span>
                <span className="font-medium text-foreground">+1,840</span> net new this week
              </span>
              <span>•</span>
              <span>Across 5 channels</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Heart className="size-4" />
              </div>
              <CardTitle className="font-normal text-sm">Post Likes</CardTitle>
            </div>
            <CardAction>
              <Ellipsis className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="font-semibold text-2xl leading-none tracking-tight">384,200</div>
              <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">
                <ArrowUpRight className="size-3.5" />
                15.1%
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span>
                Avg <span className="font-medium text-foreground">4,280</span> per post
              </span>
              <span>•</span>
              <span>4.6% ER rate</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Eye className="size-4" />
              </div>
              <CardTitle className="font-normal text-sm">Total Views</CardTitle>
            </div>
            <CardAction>
              <Ellipsis className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="font-semibold text-2xl leading-none tracking-tight">3,120,400</div>
              <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">
                <ArrowUpRight className="size-3.5" />
                8.7%
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span>
                Reels & Shorts <span className="font-medium text-foreground">68%</span>
              </span>
              <span>•</span>
              <span>Last 30 days</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Radio className="size-4" />
              </div>
              <CardTitle className="font-normal text-sm">Audience Reach</CardTitle>
            </div>
            <CardAction>
              <Ellipsis className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="font-semibold text-2xl leading-none tracking-tight">1,842,500</div>
              <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">
                <ArrowUpRight className="size-3.5" />
                18.2%
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span>
                Organic <span className="font-medium text-foreground">1.4M</span>
              </span>
              <span>•</span>
              <span>
                Paid <span className="font-medium text-foreground">442K</span>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
