"use client";

import { Suspense, lazy } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  Crosshair,
  Crown,
  Gift,
  Globe,
  Info,
  Layers,
  ListOrdered,
  MapPin,
  Rocket,
  ShieldAlert,
  Sparkles,
  Star,
  Swords,
  Target,
  Ticket,
  Trophy,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Tools Grid 卡片索引 -> 模块 section id（1:1 锚点，4 卡对应 4 模块）
const TOOL_CARD_SECTION_IDS = ["codes", "tier-list", "beginner-guide", "endless-ragnarok"];

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

// 模块内部不再渲染内部 URL 链接（删除 LinkedTitle），moduleLinkMap 仅作签名占位
export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  // 模块内部不再渲染内部 URL（删除 LinkedTitle），moduleLinkMap 仅作签名占位
  void moduleLinkMap;

  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.granbluefantasyrelinkendlessragnarok.wiki";
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Granblue Fantasy Relink Endless Ragnarok Wiki",
        description:
          "Complete Granblue Fantasy: Relink Wiki covering characters, builds, weapons, sigils, quests, bosses, materials, and Endless Ragnarok updates.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Granblue Fantasy: Relink - Endless Ragnarok",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Granblue Fantasy Relink Endless Ragnarok Wiki",
        alternateName: "Granblue Fantasy: Relink",
        url: siteUrl,
        description:
          "Complete Granblue Fantasy: Relink Wiki resource hub for characters, builds, weapons, sigils, quests, bosses, and Endless Ragnarok guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Granblue Fantasy Relink Endless Ragnarok Wiki",
        },
        sameAs: [
          "https://relink.granbluefantasy.jp/en/",
          "https://relink-ragnarok.granbluefantasy.com/en/",
          "https://store.steampowered.com/app/881020/Granblue_Fantasy_Relink/",
          "https://discord.gg/relink-official",
          "https://x.com/relink_official",
          "https://www.reddit.com/r/GranblueFantasyRelink/",
          "https://www.youtube.com/@relink_official",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Granblue Fantasy: Relink",
        gamePlatform: ["PlayStation 5", "PlayStation 4", "Nintendo Switch 2", "Steam"],
        applicationCategory: "Game",
        genre: ["Action RPG", "JRPG", "Action", "Adventure"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 4,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/881020/Granblue_Fantasy_Relink/",
        },
      },
      {
        "@type": "VideoObject",
        name: "Granblue Fantasy: Relink - Endless Ragnarok - Third Trailer",
        description:
          "Official Granblue Fantasy: Relink - Endless Ragnarok trailer showcasing the new expansion's gameplay, characters, and quests.",
        uploadDate: "2025-12-15",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/p3AmoK58D6Q",
        url: "https://www.youtube.com/watch?v=p3AmoK58D6Q",
      },
    ],
  };

  // ---- Module 1: Codes 渲染辅助 ----
  const codeIconForType = (type: string) => {
    switch (type) {
      case "official-serial-code":
        return Ticket;
      case "redemption-flow":
        return ListOrdered;
      case "official-purchase-bonus":
        return Gift;
      case "fake-code-warning":
        return ShieldAlert;
      case "risk-warning":
        return AlertTriangle;
      default:
        return Gift;
    }
  };

  const codeItems = (t.modules.granblueRelinkCodes?.items || []) as any[];
  // 官方奖励卡（前 4 项）走两列网格；警告/风险卡（后 2 项）钉到底部单独高亮
  const officialCodeItems = codeItems.filter((it) =>
    ["official-serial-code", "redemption-flow", "official-purchase-bonus"].includes(it.type),
  );
  const warningCodeItems = codeItems.filter((it) =>
    ["fake-code-warning", "risk-warning"].includes(it.type),
  );

  // ---- Module 2: Tier List 渲染辅助 ----
  const tierMeta: Record<string, { Icon: any; ring: string; badge: string }> = {
    S: { Icon: Crown, ring: "border-[hsl(var(--nav-theme))]", badge: "bg-[hsl(var(--nav-theme))] text-white" },
    A: { Icon: Trophy, ring: "border-[hsl(var(--nav-theme)/0.6)]", badge: "bg-[hsl(var(--nav-theme)/0.7)] text-white" },
    B: { Icon: Target, ring: "border-[hsl(var(--nav-theme)/0.4)]", badge: "bg-[hsl(var(--nav-theme)/0.45)] text-white" },
    C: { Icon: Crosshair, ring: "border-border", badge: "bg-white/10 text-foreground" },
  };
  const ratingLabel = (k: string) =>
    ({
      beginnerEase: "Beginner",
      aiTeammate: "AI",
      coOpValue: "Co-op",
      lateGameDamage: "Damage",
      survivability: "Survival",
    } as Record<string, string>)[k] || k;

  // ---- Module 4: Endless Ragnarok 渲染辅助 ----
  const ragnarokIconForCategory = (cat: string) => {
    switch (cat) {
      case "release-info":
        return Calendar;
      case "buying-guide":
      case "edition-differences":
        return Layers;
      case "purchase-bonuses":
        return Gift;
      case "demo":
        return Rocket;
      case "new-content":
      case "battle-systems":
        return Swords;
      case "characters":
        return Users;
      case "solo-endgame":
        return Target;
      case "multiplayer":
        return Globe;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 scroll-reveal text-center">
            {/* Badge */}
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)]
                         bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1.5 md:mb-6 md:px-4 md:py-2"
            >
              <Sparkles className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-medium md:text-sm">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl leading-[1.05] font-bold sm:text-5xl md:mb-6 md:text-7xl">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 bg-[hsl(var(--nav-theme))]
                           px-6 py-3.5 font-semibold text-base text-white rounded-lg transition-colors
                           hover:bg-[hsl(var(--nav-theme)/0.9)] md:px-8 md:py-4 md:text-lg"
              >
                <BookOpen className="h-5 w-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/881020/Granblue_Fantasy_Relink/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border
                           px-6 py-3.5 font-semibold text-base transition-colors hover:bg-white/10
                           md:px-8 md:py-4 md:text-lg"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - Endless Ragnarok 官方预告片（视口内自动播放） */}
      <section className="px-4 py-10 md:py-12">
        <div className="container mx-auto max-w-5xl scroll-reveal">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="p3AmoK58D6Q"
              title="Granblue Fantasy: Relink - Endless Ragnarok"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 4 Navigation Cards（前半屏顺序：Hero → Video → Tools Grid） */}
      <section className="bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 scroll-reveal text-center md:mb-12">
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">{t.tools.titleHighlight}</span>
            </h2>
            <p className="text-base text-muted-foreground md:text-lg">{t.tools.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOL_CARD_SECTION_IDS[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="group scroll-reveal cursor-pointer rounded-xl border border-border bg-card p-4 text-left
                             transition-all duration-300 hover:border-[hsl(var(--nav-theme)/0.5)]
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] md:p-6"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg
                                bg-[hsl(var(--nav-theme)/0.1)] transition-colors
                                group-hover:bg-[hsl(var(--nav-theme)/0.2)] md:mb-4 md:h-12 md:w-12"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 text-[hsl(var(--nav-theme-light))] md:h-6 md:w-6"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold md:text-base">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={12} />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Codes & Rewards */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 scroll-reveal text-center md:mb-12">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
              <Gift className="h-3.5 w-3.5" />
              {t.modules.granblueRelinkCodes.eyebrow}
            </div>
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              {t.modules.granblueRelinkCodes.title}
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.granblueRelinkCodes.subtitle}
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground md:text-base">
              {t.modules.granblueRelinkCodes.intro}
            </p>
          </div>

          {/* 官方奖励卡：两列网格 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {officialCodeItems.map((item: any, index: number) => {
              const Icon = codeIconForType(item.type);
              return (
                <div
                  key={index}
                  className="scroll-reveal rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:p-6"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)]">
                      <Icon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                    </span>
                    <span className="rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2 py-0.5 text-xs">
                      {item.status}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{item.title}</h3>

                  {item.rewardSummary && (
                    <p className="mb-3 text-sm text-muted-foreground">{item.rewardSummary}</p>
                  )}
                  {item.availability && (
                    <p className="mb-3 text-sm italic text-muted-foreground">{item.availability}</p>
                  )}

                  {item.appliesTo && (
                    <div className="mb-3">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                        Applies to
                      </p>
                      <ul className="space-y-1">
                        {item.appliesTo.map((a: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.notIncludedOn && (
                    <div className="mb-3">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Not included on
                      </p>
                      <ul className="space-y-1">
                        {item.notIncludedOn.map((n: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            <span>{n}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.includedRewards && (
                    <div className="mb-3">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                        Included rewards
                      </p>
                      <ul className="space-y-1">
                        {item.includedRewards.map((r: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Gift className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.steps && (
                    <div className="mb-3">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                        Redemption steps
                      </p>
                      <ol className="space-y-1.5">
                        {item.steps.map((s: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] text-xs font-bold text-[hsl(var(--nav-theme-light))]">
                              {i + 1}
                            </span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {item.eligibilityNotes && (
                    <div className="mb-3 rounded-lg border border-border bg-white/[0.03] p-3">
                      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <Info className="h-3.5 w-3.5" /> Eligibility notes
                      </p>
                      <ul className="space-y-1">
                        {item.eligibilityNotes.map((n: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                            <span>{n}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.platformRules && (
                    <div className="rounded-lg border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)] p-3">
                      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                        <MapPin className="h-3.5 w-3.5" /> Platform rules
                      </p>
                      <ul className="space-y-1">
                        {item.platformRules.map((r: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 警告/风险卡：钉到底部高亮 */}
          {warningCodeItems.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {warningCodeItems.map((item: any, index: number) => {
                const Icon = codeIconForType(item.type);
                const isRisk = item.type === "risk-warning";
                return (
                  <div
                    key={index}
                    className={`scroll-reveal rounded-xl border p-5 md:p-6 ${
                      isRisk
                        ? "border-yellow-500/30 bg-yellow-500/5"
                        : "border-orange-500/30 bg-orange-500/5"
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          isRisk ? "bg-yellow-500/15" : "bg-orange-500/15"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${isRisk ? "text-yellow-400" : "text-orange-400"}`}
                        />
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs ${
                          isRisk
                            ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                            : "border-orange-500/30 bg-orange-500/10 text-orange-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold">{item.title}</h3>

                    {item.officialRule && (
                      <p className="mb-3 text-sm text-muted-foreground">{item.officialRule}</p>
                    )}
                    {item.whatToIgnore && (
                      <ul className="mb-3 space-y-1">
                        {item.whatToIgnore.map((w: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <X
                              className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                                isRisk ? "text-yellow-400" : "text-orange-400"
                              }`}
                            />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.practicalRisks && (
                      <ul className="mb-3 space-y-1">
                        {item.practicalRisks.map((r: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.safeRule && (
                      <div
                        className={`flex items-start gap-2 rounded-lg border p-3 ${
                          isRisk
                            ? "border-yellow-500/30 bg-yellow-500/10"
                            : "border-orange-500/30 bg-orange-500/10"
                        }`}
                      >
                        <ShieldAlert
                          className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                            isRisk ? "text-yellow-400" : "text-orange-400"
                          }`}
                        />
                        <span className="text-sm font-medium">{item.safeRule}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Tier List */}
      <section id="tier-list" className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 scroll-reveal text-center md:mb-12">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
              <Trophy className="h-3.5 w-3.5" />
              {t.modules.granblueRelinkTierList.eyebrow}
            </div>
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              {t.modules.granblueRelinkTierList.title}
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.granblueRelinkTierList.subtitle}
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground md:text-base">
              {t.modules.granblueRelinkTierList.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-6">
            {(t.modules.granblueRelinkTierList.items || []).map((tier: any, ti: number) => {
              const meta = tierMeta[tier.tier] || tierMeta.C;
              const TierIcon = meta.Icon;
              return (
                <div key={ti} className={`rounded-2xl border-2 ${meta.ring} bg-white/[0.03] p-4 md:p-6`}>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold ${meta.badge}`}
                    >
                      {tier.tier}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <TierIcon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                        <span className="font-bold">{tier.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{tier.summary}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {tier.characters.map((c: any, ci: number) => (
                      <div
                        key={ci}
                        className="rounded-lg border border-border bg-white/5 p-4 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)]"
                      >
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <h3 className="font-bold text-[hsl(var(--nav-theme-light))]">{c.name}</h3>
                        </div>
                        <p className="mb-2 text-xs text-muted-foreground">
                          <span className="rounded border border-border bg-white/[0.04] px-1.5 py-0.5">
                            {c.release}
                          </span>{" "}
                          {c.role}
                        </p>
                        <div className="mb-2 flex flex-wrap gap-1">
                          {["beginnerEase", "aiTeammate", "coOpValue", "lateGameDamage", "survivability"].map(
                            (k) => (
                              <span
                                key={k}
                                className="rounded bg-[hsl(var(--nav-theme)/0.1)] px-1.5 py-0.5 text-[10px] text-muted-foreground"
                              >
                                {ratingLabel(k)}: {c[k]}
                              </span>
                            ),
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{c.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 3: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 scroll-reveal text-center md:mb-12">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
              <BookOpen className="h-3.5 w-3.5" />
              {t.modules.granblueRelinkBeginnerGuide.eyebrow}
            </div>
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              {t.modules.granblueRelinkBeginnerGuide.title}
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.granblueRelinkBeginnerGuide.subtitle}
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground md:text-base">
              {t.modules.granblueRelinkBeginnerGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-4">
            {(t.modules.granblueRelinkBeginnerGuide.items || []).map((step: any, index: number) => (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-xl border border-border bg-white/5 p-4 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:flex-row md:gap-5 md:p-6"
              >
                <div className="flex items-center gap-3 md:flex-col md:items-center">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)] md:h-12 md:w-12">
                    <span className="text-base font-bold text-[hsl(var(--nav-theme-light))] md:text-xl">
                      {step.step}
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-lg font-bold md:text-xl">{step.title}</h3>
                  <p className="mb-3 text-sm text-[hsl(var(--nav-theme-light))]">{step.goal}</p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)] p-3">
                      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                        <Check className="h-3.5 w-3.5" /> Do
                      </p>
                      <ul className="space-y-1">
                        {step.actions.map((a: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border border-border bg-white/[0.03] p-3">
                      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <X className="h-3.5 w-3.5" /> Avoid
                      </p>
                      <ul className="space-y-1">
                        {step.avoid.map((a: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <X className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-border bg-white/[0.02] p-3">
                    <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Why it matters: </span>
                      {step.whyItMatters}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner type={mobileBannerAd.type} adKey={mobileBannerAd.adKey} className="md:hidden" />
      )}

      {/* Module 4: Endless Ragnarok */}
      <section id="endless-ragnarok" className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 scroll-reveal text-center md:mb-12">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
              <Swords className="h-3.5 w-3.5" />
              {t.modules.granblueRelinkEndlessRagnarok.eyebrow}
            </div>
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              {t.modules.granblueRelinkEndlessRagnarok.title}
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.granblueRelinkEndlessRagnarok.subtitle}
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground md:text-base">
              {t.modules.granblueRelinkEndlessRagnarok.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(t.modules.granblueRelinkEndlessRagnarok.items || []).map((card: any, index: number) => {
              const CardIcon = ragnarokIconForCategory(card.category);
              return (
                <div
                  key={index}
                  className="flex flex-col rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)]"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)]">
                      <CardIcon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                    </span>
                    <span className="rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                      {card.category.replace(/-/g, " ")}
                    </span>
                  </div>
                  <h3 className="mb-2 font-bold">{card.title}</h3>
                  <ul className="mb-3 space-y-1.5">
                    {card.details.map((d: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                  {card.editionPrices && (
                    <div className="mb-3 overflow-hidden rounded-lg border border-border">
                      {card.editionPrices.map((e: any, i: number) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between gap-2 p-2 text-xs ${
                            i % 2 === 0 ? "bg-white/[0.03]" : ""
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-foreground">{e.edition}</p>
                            <p className="text-muted-foreground">{e.format}</p>
                          </div>
                          <span className="font-semibold text-[hsl(var(--nav-theme-light))]">{e.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {card.characters && (
                    <div className="mt-auto flex flex-wrap gap-1.5">
                      {card.characters.map((c: string, i: number) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] px-2 py-0.5 text-xs"
                        >
                          <Star className="h-3 w-3 text-[hsl(var(--nav-theme-light))]" />
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 安全购买提示 */}
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)] p-4 md:p-5">
            <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
            <p className="text-sm text-muted-foreground">
              Buy Granblue Fantasy Relink Endless Ragnarok editions only from official platform stores
              (PlayStation Store, Steam, Nintendo eShop) or official Cygames channels to guarantee valid
              purchase bonuses and a working Upgrade Kit.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="border-t border-border bg-white/[0.02]">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div>
              <h3 className="mb-4 text-xl font-bold text-[hsl(var(--nav-theme-light))]">{t.footer.title}</h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="mb-4 font-semibold">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://relink-ragnarok.granbluefantasy.com/en/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.officialSite}
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/relink-official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/relink_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/GranblueFantasyRelink/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.reddit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@relink_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/881020/Granblue_Fantasy_Relink/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="mb-4 font-semibold">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="mb-2 text-sm text-muted-foreground">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
