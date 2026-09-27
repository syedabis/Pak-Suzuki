import { Ellipsis } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PostItem {
  id: string;
  title: string;
  platform: "Instagram" | "YouTube" | "LinkedIn" | "TikTok" | "X";
  type: "Reel" | "Video" | "Carousel" | "Article" | "Post";
  date: string;
  likes: string;
  views: string;
  reach: string;
  er: string;
}

const topPosts: PostItem[] = [
  {
    id: "1",
    title: "10 Mind-Blowing Features Coming in Studio Admin v3.0 🔥",
    platform: "Instagram",
    type: "Reel",
    date: "May 24",
    likes: "42.8k",
    views: "340.2k",
    reach: "210.5k",
    er: "8.4%",
  },
  {
    id: "2",
    title: "How We Scaled Our React 19 Frontend Architecture to 1M Users",
    platform: "LinkedIn",
    type: "Article",
    date: "May 20",
    likes: "18.4k",
    views: "124.0k",
    reach: "98.2k",
    er: "6.9%",
  },
  {
    id: "3",
    title: "Building Modern Next.js 16 Dashboards with Tailwind CSS v4",
    platform: "YouTube",
    type: "Video",
    date: "May 18",
    likes: "31.2k",
    views: "480.0k",
    reach: "310.0k",
    er: "7.2%",
  },
  {
    id: "4",
    title: "Quick Tip: Master shadcn/ui custom color presets in under 60s ⚡",
    platform: "TikTok",
    type: "Reel",
    date: "May 15",
    likes: "54.1k",
    views: "612.4k",
    reach: "440.0k",
    er: "9.1%",
  },
  {
    id: "5",
    title: "Why design engineering is the future of digital products",
    platform: "X",
    type: "Post",
    date: "May 12",
    likes: "12.6k",
    views: "89.5k",
    reach: "72.4k",
    er: "5.3%",
  },
];

const platformColors: Record<PostItem["platform"], string> = {
  Instagram: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
  YouTube: "bg-red-500/10 text-red-700 dark:text-red-300",
  LinkedIn: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  TikTok: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  X: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
};

export function TopPostsLeaderboard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-normal text-base">Top Performing Content Leaderboard</CardTitle>
            <p className="text-muted-foreground text-xs">Highest reaching and most liked posts across all channels</p>
          </div>
          <CardAction>
            <Ellipsis className="size-4 text-muted-foreground" />
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Content & Title</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Format</TableHead>
              <TableHead className="text-right">Likes</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Reach</TableHead>
              <TableHead className="text-right">ER Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium text-xs">
                  <div className="line-clamp-1 max-w-[280px]">{post.title}</div>
                  <span className="text-[11px] text-muted-foreground">{post.date}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={platformColors[post.platform]}>
                    {post.platform}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{post.type}</TableCell>
                <TableCell className="text-right font-medium text-xs">{post.likes}</TableCell>
                <TableCell className="text-right text-xs">{post.views}</TableCell>
                <TableCell className="text-right text-xs">{post.reach}</TableCell>
                <TableCell className="text-right font-semibold text-green-600 text-xs dark:text-green-400">
                  {post.er}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
