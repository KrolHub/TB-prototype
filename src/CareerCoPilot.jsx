/**
 * Career Co-Pilot — Mobile-Responsive React Prototype
 * Mobile-first Tailwind CSS with md:/lg: breakpoint modifiers
 * Key changes:
 *  - Sidebar hidden on mobile; slides in as a drawer via hamburger toggle
 *  - All grids stack vertically on mobile, transition to columns at md/lg
 *  - Touch-friendly tap targets (min 44px), comfortable font sizes & padding
 *  - Overlay backdrop closes the mobile drawer
 */

import { useState, useCallback } from "react";
import {
  LayoutDashboard, Briefcase, Archive, Building2, Settings,
  LogOut, Plus, Search, ChevronRight, Lock, CheckCircle2,
  Circle, Zap, Clock, BarChart2, Award, MessageSquare,
  BookOpen, X, Bell, Map, Layers, Menu
} from "lucide-react";

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const mockData = {
  user: { name: "Ahmad Ghazi", title: "Software Engineer", avatar: null },
  pathwayScore: {
    score: 74, maxScore: 100, percentile: 15, monthlyGain: 4,
    activePath: "AI & Cloud Eng", phase: "Specialization Phase",
    completedModules: 12, totalModules: 48, percentComplete: 25,
  },
  nextDeadline: { title: "TalentBank OS", daysLeft: 2, projectLabel: "Open Project", urgent: true },
  roadmap: {
    foundation: [
      { id: "f1", title: "CS Fundamentals", status: "certified", progress: 100, subtitle: "100% Certified" },
      { id: "f2", title: "Data Structures & Algo", status: "completed", progress: 100, subtitle: "Completed" },
    ],
    skillBuilding: [
      { id: "s1", title: "Full-stack Frameworks", status: "current", progress: 60, subtitle: "Module 4/6: Next.js API Routes", badge: "CURRENT" },
      { id: "s2", title: "DevOps Essentials", status: "upcoming", progress: 0, subtitle: "Start in 5 days" },
    ],
    specialization: [
      { id: "sp1", title: "Advanced AI Models", status: "locked", subtitle: "Prerequisite: DevOps Essentials" },
      { id: "sp2", title: "Distributed Systems", status: "locked", subtitle: "Locked" },
    ],
  },
  recommendations: [
    { id: "r1", title: "Vector Databases for LLMs", description: "Master Pinecone and Weaviate to power semantic search in your Next.js apps.", hours: 4.5, level: "Intermediate", careerPts: 400, tag: null, icon: "zap" },
    { id: "r2", title: "Terraform Mastery", description: "Infrastructure as code for AWS. Essential for your current Cloud Pathway.", hours: 8, level: "Advanced", careerPts: null, tag: "Top Pick", icon: "cloud" },
  ],
  activity: [
    { id: "a1", type: "badge", text: "Earned React Architect badge", time: "2 hours ago", icon: "award" },
    { id: "a2", type: "reply", text: 'Replied to "Next.js 14 Middleware" thread', time: "5 hours ago", icon: "message" },
    { id: "a3", type: "complete", text: 'Completed "GraphQL Fundamentals"', time: "Yesterday", icon: "book" },
  ],
  availableModules: [
    { id: "m1", title: "React Server Components Deep Dive", duration: "3.5 hrs", level: "Advanced" },
    { id: "m2", title: "AWS Lambda & Serverless Patterns", duration: "5 hrs", level: "Intermediate" },
    { id: "m3", title: "Kubernetes Networking", duration: "6 hrs", level: "Advanced" },
    { id: "m4", title: "TypeScript Generics Masterclass", duration: "2 hrs", level: "Intermediate" },
  ],
};

// ─────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────
function cn(...classes) { return classes.filter(Boolean).join(" "); }

function AvatarPlaceholder({ name }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
      {initials}
    </div>
  );
}

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────
const navItems = [
  { id: "pathway",       label: "Pathway",            icon: LayoutDashboard },
  { id: "opportunities", label: "Opportunities",      icon: Briefcase },
  { id: "certvault",    label: "Certificates Vault",  icon: Archive },
  { id: "employers",    label: "Employers",            icon: Building2 },
];

function Sidebar({ activeView, onViewChange, onStartModule, mobileOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
  className={cn(
    "sidebar-panel w-64 flex flex-col bg-[#0d0f1a] border-r border-white/5",
    mobileOpen ? "open" : ""

        )}
      >
        {/* Logo + mobile close */}
        <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
          <span className="text-white font-bold text-base tracking-tight">Career Co-Pilot</span>
          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Profile */}
        <div className="px-4 py-4 border-b border-white/5 flex items-center gap-3">
          <AvatarPlaceholder name={mockData.user.name} />
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{mockData.user.name}</p>
            <p className="text-slate-400 text-xs truncate">{mockData.user.title}</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeView === id;
            return (
              <button
                key={id}
                onClick={() => { onViewChange(id); onClose(); }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-150 text-left min-h-[44px]",
                  isActive
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                )}
              >
                <Icon size={16} className={isActive ? "text-violet-400" : ""} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Start New Module CTA */}
        <div className="px-3 pb-4">
          <button
            onClick={() => { onStartModule(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-sm font-semibold transition-all duration-150 shadow-lg shadow-violet-900/40 min-h-[44px]"
          >
            <Plus size={15} />
            Start New Module
          </button>
        </div>

        {/* Bottom Nav */}
        <div className="px-3 pb-5 border-t border-white/5 pt-3 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 text-sm transition-all duration-150 min-h-[44px]">
            <Settings size={15} />
            Settings
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 text-sm transition-all duration-150 min-h-[44px]">
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD HEADER
// ─────────────────────────────────────────────
function DashboardHeader({ title, onMenuOpen }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-white/5 bg-[#0d1120]/80 backdrop-blur sticky top-0 z-20 gap-3">
      {/* Hamburger (mobile only) */}
      <button
        onClick={onMenuOpen}
        className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <h1 className="text-white font-semibold text-sm md:text-base flex-1 truncate">{title}</h1>

      {/* Search — icon-only on mobile, expands inline; full bar on desktop */}
      <div className="flex items-center gap-2">
        {/* Mobile: tap icon to reveal input */}
        <button
          className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={() => setSearchOpen(v => !v)}
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        {/* Desktop search bar */}
        <div className={cn(
          "hidden md:flex items-center gap-2 bg-white/5 border rounded-lg px-3 py-1.5 transition-all duration-150",
          searchFocused ? "border-violet-500/50" : "border-white/10"
        )}>
          <Search size={13} className="text-slate-400" />
          <input
            className="bg-transparent text-slate-300 text-sm placeholder:text-slate-500 outline-none w-36 focus:w-48 transition-all duration-200"
            placeholder="Search resources..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>

      {/* Mobile expanded search bar */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 px-4 py-3 bg-[#0d1120] border-b border-white/5 md:hidden z-20">
          <div className="flex items-center gap-2 bg-white/5 border border-violet-500/40 rounded-lg px-3 py-2">
            <Search size={14} className="text-slate-400 flex-shrink-0" />
            <input
              autoFocus
              className="bg-transparent text-slate-300 text-sm placeholder:text-slate-500 outline-none flex-1"
              placeholder="Search resources..."
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────
// PATHWAY SCORE CARD
// ─────────────────────────────────────────────
function PathwayScoreCard({ data }) {
  return (
    <div className="bg-[#111827] border border-white/8 rounded-xl p-5 flex flex-col gap-3">
      <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase">Pathway Score</p>
      <div className="flex items-end gap-1">
        <span className="text-white text-4xl md:text-5xl font-black">{data.score}</span>
        <span className="text-slate-500 text-lg mb-1">/ {data.maxScore}</span>
      </div>
      <div className="space-y-1.5">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full transition-all duration-700"
            style={{ width: `${data.score}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs flex-wrap gap-y-1">
          <span className="text-slate-400">Top {data.percentile}% of Candidates</span>
          <span className="text-emerald-400 font-semibold">+{data.monthlyGain} pts this month</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ACTIVE COURSE CARD
// ─────────────────────────────────────────────
function ActiveCourseCard({ data }) {
  return (
    <div className="bg-[#111827] border border-white/8 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-emerald-400 text-xs font-semibold">Active</span>
      </div>
      <div>
        <p className="text-white font-bold text-base">{data.activePath}</p>
        <p className="text-slate-400 text-xs mt-0.5">{data.phase}</p>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <span className="text-violet-400 font-bold text-lg">{data.percentComplete}%</span>
        <div>
          <span className="text-white font-semibold">{data.completedModules}/{data.totalModules}</span>
          <span className="text-slate-400 ml-1">Modules</span>
        </div>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
          style={{ width: `${data.percentComplete}%` }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DEADLINE CARD
// ─────────────────────────────────────────────
function DeadlineCard({ data, onOpenProject }) {
  return (
    <div className={cn(
      "border rounded-xl p-5 flex flex-col gap-3",
      data.urgent ? "bg-rose-950/30 border-rose-500/40" : "bg-[#111827] border-white/8"
    )}>
      <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase">Next Deadline</p>
      <div>
        <p className="text-white font-bold text-base">{data.title}</p>
        <p className={cn("text-xs font-semibold mt-0.5", data.urgent ? "text-rose-400" : "text-amber-400")}>
          Due in {data.daysLeft} days
        </p>
      </div>
      <button
        onClick={() => onOpenProject(data.title)}
        className="flex items-center gap-1 text-violet-400 hover:text-violet-300 text-sm font-semibold transition-colors group min-h-[44px] w-fit"
      >
        {data.projectLabel}
        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// MODULE CARD
// ─────────────────────────────────────────────
function ModuleCard({ module, onClick }) {
  const statusIcon = {
    certified: <CheckCircle2 size={14} className="text-emerald-400" />,
    completed: <CheckCircle2 size={14} className="text-emerald-400" />,
    current: <Circle size={14} className="text-violet-400" />,
    upcoming: <Circle size={14} className="text-slate-500" />,
    locked: <Lock size={12} className="text-slate-600" />,
  }[module.status] || null;

  const isLocked = module.status === "locked";
  const isCurrent = module.status === "current";

  return (
    <button
      onClick={() => !isLocked && onClick(module)}
      disabled={isLocked}
      className={cn(
        "w-full text-left rounded-lg p-3.5 border transition-all duration-150 group relative min-h-[60px]",
        isLocked
          ? "bg-white/2 border-white/5 opacity-50 cursor-not-allowed"
          : isCurrent
          ? "bg-violet-600/10 border-violet-500/30 hover:bg-violet-600/15 hover:border-violet-400/40 active:bg-violet-600/20"
          : "bg-white/4 border-white/8 hover:bg-white/8 hover:border-white/15 active:bg-white/10"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-semibold", isLocked ? "text-slate-500" : "text-white")}>
            {module.title}
          </p>
          {module.subtitle && (
            <p className="text-slate-400 text-[11px] mt-0.5 truncate">{module.subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
          {module.badge && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-600 text-white">
              {module.badge}
            </span>
          )}
          {statusIcon}
        </div>
      </div>
      {module.progress > 0 && module.progress < 100 && (
        <div className="mt-2.5 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full"
            style={{ width: `${module.progress}%` }}
          />
        </div>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────
// ROADMAP SECTION
// ─────────────────────────────────────────────
function RoadmapSection({ roadmap, onModuleClick, viewMode, setViewMode }) {
  const columns = [
    { key: "foundation",    label: "Foundation",     icon: <CheckCircle2 size={13} className="text-emerald-400" />, modules: roadmap.foundation,    color: "text-emerald-400" },
    { key: "skillBuilding", label: "Skill Building", icon: <Circle size={13} className="text-violet-400" />,         modules: roadmap.skillBuilding, color: "text-violet-300"  },
    { key: "specialization",label: "Specialization", icon: <Lock size={12} className="text-slate-500" />,            modules: roadmap.specialization,color: "text-slate-400"  },
  ];

  return (
    <section>
      {/* Header row */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-white font-semibold text-sm">Your Software Engineering Roadmap</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setViewMode("visualizer")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-150 min-h-[36px]",
              viewMode === "visualizer"
                ? "bg-white/10 border-white/20 text-white"
                : "border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20"
            )}
          >
            <Map size={12} />
            Visualizer
          </button>
          <button
            onClick={() => setViewMode("full")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-150 min-h-[36px]",
              viewMode === "full"
                ? "bg-violet-600 border-violet-500 text-white"
                : "border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20"
            )}
          >
            <Layers size={12} />
            Full Roadmap
          </button>
        </div>
      </div>

      {/*
        Mobile:  single column (each phase stacked)
        sm:      2 columns
        lg:      3 columns side by side
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {columns.map(col => (
          <div key={col.key} className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              {col.icon}
              <span className={cn("text-xs font-bold tracking-wider uppercase", col.color)}>{col.label}</span>
            </div>
            {col.modules.map(mod => (
              <ModuleCard key={mod.id} module={mod} onClick={onModuleClick} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// RECOMMENDATION CARD
// ─────────────────────────────────────────────
function RecommendationCard({ rec, onEnroll }) {
  const IconComp = rec.icon === "zap" ? Zap : BookOpen;
  return (
    <div className="bg-[#111827] border border-white/8 rounded-xl p-4 flex flex-col gap-3 hover:border-violet-500/30 hover:bg-violet-600/5 transition-all duration-150 group">
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-lg bg-violet-600/20 flex items-center justify-center flex-shrink-0">
          <IconComp size={16} className="text-violet-400" />
        </div>
        {rec.careerPts && (
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            +{rec.careerPts} Career Pts
          </span>
        )}
        {rec.tag && (
          <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            {rec.tag}
          </span>
        )}
      </div>
      <div>
        <p className="text-white font-semibold text-sm">{rec.title}</p>
        <p className="text-slate-400 text-xs mt-1 leading-relaxed">{rec.description}</p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><Clock size={10} />{rec.hours} hrs</span>
          <span className="flex items-center gap-1"><BarChart2 size={10} />{rec.level}</span>
        </div>
        {/* Enroll always visible on mobile (no hover dependency) */}
        <button
          onClick={() => onEnroll(rec)}
          className="text-xs text-violet-400 font-semibold hover:text-violet-300 transition-colors md:opacity-0 md:group-hover:opacity-100 min-h-[36px] px-2"
        >
          Enroll →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ACTIVITY FEED
// ─────────────────────────────────────────────
const activityIcons = {
  award:   <Award size={14} className="text-amber-400" />,
  message: <MessageSquare size={14} className="text-blue-400" />,
  book:    <BookOpen size={14} className="text-emerald-400" />,
};

function ActivityFeed({ items, onViewHistory }) {
  return (
    <div className="bg-[#111827] border border-white/8 rounded-xl p-4 flex flex-col gap-3">
      <h3 className="text-white font-semibold text-sm">Recent Activity</h3>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
              {activityIcons[item.icon]}
            </div>
            <div className="min-w-0">
              <p className="text-slate-200 text-xs leading-snug">{item.text}</p>
              <p className="text-slate-500 text-[11px] mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onViewHistory}
        className="w-full mt-1 py-2.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/25 text-xs font-medium transition-all duration-150 min-h-[44px]"
      >
        View History
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// START NEW MODULE MODAL
// ─────────────────────────────────────────────
function StartModuleModal({ isOpen, onClose }) {
  const [selected, setSelected] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  const handleEnroll = useCallback(async () => {
    if (!selected) return;
    setEnrolling(true);
    await new Promise(r => setTimeout(r, 1200));
    setEnrolling(false);
    onClose();
    setSelected(null);
  }, [selected, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Sheet slides up on mobile, centered modal on sm+ */}
      <div className="relative bg-[#111827] border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-md shadow-2xl shadow-black/60 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-base">Start New Module</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/5">
            <X size={18} />
          </button>
        </div>
        <p className="text-slate-400 text-xs mb-4">Select a module to begin. Your progress will sync automatically.</p>
        <div className="space-y-2 overflow-y-auto flex-1 pr-1">
          {mockData.availableModules.map(mod => (
            <button
              key={mod.id}
              onClick={() => setSelected(mod)}
              className={cn(
                "w-full text-left px-4 py-3.5 rounded-lg border transition-all duration-150 min-h-[64px]",
                selected?.id === mod.id
                  ? "border-violet-500/50 bg-violet-600/15 text-white"
                  : "border-white/8 bg-white/4 text-slate-300 hover:bg-white/8 hover:border-white/20 active:bg-white/10"
              )}
            >
              <p className="text-sm font-medium">{mod.title}</p>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Clock size={10} />{mod.duration}</span>
                <span className="flex items-center gap-1"><BarChart2 size={10} />{mod.level}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg border border-white/10 text-slate-400 hover:text-white text-sm font-medium transition-all duration-150 min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={handleEnroll}
            disabled={!selected || enrolling}
            className={cn(
              "flex-1 py-3 rounded-lg text-white text-sm font-semibold transition-all duration-150 min-h-[44px]",
              selected && !enrolling
                ? "bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-900/40"
                : "bg-white/10 text-slate-500 cursor-not-allowed"
            )}
          >
            {enrolling ? "Enrolling…" : "Enroll Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PLACEHOLDER VIEW
// ─────────────────────────────────────────────
function PlaceholderView({ viewId }) {
  const labels = {
    opportunities: { title: "Opportunities",       desc: "Browse job openings and internship matches tailored to your pathway." },
    certvault:     { title: "Certificates Vault",  desc: "Your saved resources, notes, and curated learning materials." },
    employers:     { title: "Employers",            desc: "Connect with companies actively recruiting from your career pathway." },
  };
  const info = labels[viewId] || { title: viewId, desc: "Coming soon." };
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8 md:p-12">
      <div className="w-14 h-14 rounded-2xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center mb-2">
        <Briefcase size={24} className="text-violet-400" />
      </div>
      <h2 className="text-white font-bold text-xl">{info.title}</h2>
      <p className="text-slate-400 text-sm max-w-xs leading-relaxed">{info.desc}</p>
      <span className="mt-2 text-xs text-slate-500 border border-white/8 rounded-full px-3 py-1">
        Backend integration pending
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD VIEW
// ─────────────────────────────────────────────
function DashboardView() {
  const [viewMode, setViewMode] = useState("full");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const handleModuleClick  = (mod) => showToast(`Opening "${mod.title}"…`);
  const handleEnroll       = (rec) => showToast(`Enrolled in "${rec.title}"!`);
  const handleOpenProject  = (title) => showToast(`Opening project: ${title}`);
  const handleViewHistory  = () => showToast("Loading full activity history…");

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6 space-y-6">
      {/*
        Stats Row:
        - mobile: single column
        - md:     2 columns
        - lg:     3 columns
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PathwayScoreCard data={mockData.pathwayScore} />
        <ActiveCourseCard data={mockData.pathwayScore} />
        <DeadlineCard data={mockData.nextDeadline} onOpenProject={handleOpenProject} />
      </div>

      {/* Roadmap */}
      <RoadmapSection
        roadmap={mockData.roadmap}
        onModuleClick={handleModuleClick}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/*
        Bottom Row:
        - mobile:  stacked
        - lg:      recommendations (2/3) + activity (1/3)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-white font-semibold text-sm">Personalized Recommendations</h2>
          {/* Recommendations: 1 col mobile, 2 col sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockData.recommendations.map(rec => (
              <RecommendationCard key={rec.id} rec={rec} onEnroll={handleEnroll} />
            ))}
          </div>
        </div>
        <ActivityFeed items={mockData.activity} onViewHistory={handleViewHistory} />
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto bg-[#1a2035] border border-white/15 text-white text-sm px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2">
          <Bell size={13} className="text-violet-400 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  const [activeView, setActiveView] = useState("pathway");
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle =
    activeView === "pathway"       ? "Pathway Dashboard"    :
    activeView === "opportunities" ? "Opportunities"        :
    activeView === "certvault"     ? "Certificates Vault"   :
                                     "Employers";

  return (
    <div className="flex h-screen bg-[#0a0c17] text-white font-sans overflow-hidden">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onStartModule={() => setModalOpen(true)}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader
          title={pageTitle}
          onMenuOpen={() => setSidebarOpen(true)}
        />
        {activeView === "pathway"
          ? <DashboardView />
          : <PlaceholderView viewId={activeView} />
        }
      </div>

      <StartModuleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
