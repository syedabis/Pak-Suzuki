import { Download, Ellipsis, Filter, RefreshCw, Share2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MarketingToolbar() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select defaultValue="all">
        <SelectTrigger className="w-38">
          <Filter className="mr-1.5 size-3.5 text-muted-foreground" />
          <SelectValue placeholder="Platform" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="twitter">X (Twitter)</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select defaultValue="last-30-days">
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="last-7-days">Last 7 days</SelectItem>
            <SelectItem value="last-30-days">Last 30 days</SelectItem>
            <SelectItem value="last-90-days">Last 3 months</SelectItem>
            <SelectItem value="year-to-date">Year to date</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline" aria-label="Marketing Dashboard Options">
            <Ellipsis className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Dashboard Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Download className="mr-2 size-4" />
              Export CSV / PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="mr-2 size-4" />
              Share Report
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Sparkles className="mr-2 size-4" />
              AI Insights Summary
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <RefreshCw className="mr-2 size-4" />
              Refresh Social Data
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
