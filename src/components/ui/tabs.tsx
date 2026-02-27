"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
    tabs: { id: string; label: string }[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
}

const Tabs = ({ tabs, activeTab, onChange, className }: TabsProps) => {
    const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        let nextIndex = index;

        switch (e.key) {
            case "ArrowRight":
                e.preventDefault();
                nextIndex = (index + 1) % tabs.length;
                break;
            case "ArrowLeft":
                e.preventDefault();
                nextIndex = (index - 1 + tabs.length) % tabs.length;
                break;
            case "Home":
                e.preventDefault();
                nextIndex = 0;
                break;
            case "End":
                e.preventDefault();
                nextIndex = tabs.length - 1;
                break;
            default:
                return;
        }

        tabRefs.current[nextIndex]?.focus();
        onChange(tabs[nextIndex].id);
    };

    return (
        <div
            className={cn("flex border-b border-zinc-100 w-full", className)}
            role="tablist"
        >
            {tabs.map((tab, index) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        ref={(el) => { tabRefs.current[index] = el; }}
                        role="tab"
                        id={`tab-${tab.id}`}
                        aria-selected={isActive}
                        aria-controls={`tabpanel-${tab.id}`}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => onChange(tab.id)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className={cn(
                            "relative px-6 py-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset rounded-t-lg",
                            isActive ? "text-primary" : "text-zinc-500 hover:text-zinc-800"
                        )}
                    >
                        {tab.label}
                        {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export { Tabs };
