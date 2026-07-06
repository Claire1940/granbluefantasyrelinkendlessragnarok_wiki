import Link from 'next/link'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.granbluefantasyrelinkendlessragnarok.wiki'
  const path = '/about'

  return {
    title: 'About Granblue Fantasy Relink Endless Ragnarok Wiki - Your Ultimate Action RPG Game Resource',
    description: 'Learn about Granblue Fantasy Relink Endless Ragnarok Wiki, a community-driven resource hub providing comprehensive character builds, weapon and sigil references, quest walkthroughs, and boss strategies for Granblue Fantasy: Relink, the action RPG available on PlayStation and Steam.',
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`,
      siteName: 'Granblue Fantasy Relink Endless Ragnarok Wiki',
      title: 'About Granblue Fantasy Relink Endless Ragnarok Wiki',
      description: 'Learn about our mission to provide the best Granblue Fantasy: Relink game resources and guides.',
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'Granblue Fantasy Relink Endless Ragnarok Wiki',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About Granblue Fantasy Relink Endless Ragnarok Wiki',
      description: 'Learn about our mission to provide the best Granblue Fantasy: Relink game resources.',
      images: [`${siteUrl}/og-image.jpg`],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Granblue Fantasy Relink Endless Ragnarok Wiki
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            Your community-driven resource center for Granblue Fantasy: Relink
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Welcome to Granblue Fantasy Relink Endless Ragnarok Wiki</h2>
            <p>
              Granblue Fantasy Relink Endless Ragnarok Wiki is an <strong>unofficial, fan-made resource website</strong> dedicated to helping players
              master "Granblue Fantasy: Relink", the action RPG on PlayStation 5, PlayStation 4, and Steam. We are a community-driven platform that provides comprehensive guides,
              character builds, weapon and sigil references, quest walkthroughs, and boss strategies to enhance your gaming experience.
            </p>
            <p>
              Whether you're a new skyfarer just beginning your journey or a seasoned veteran looking to optimize your builds and tackle Proud difficulty,
              Granblue Fantasy Relink Endless Ragnarok Wiki is here to support you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Our Mission</h2>
            <p>
              Our mission is simple: <strong>to empower Granblue Fantasy: Relink players with accurate, up-to-date information
              and powerful tools</strong> that help them succeed in the game. We strive to:
            </p>
            <ul>
              <li><strong>Provide reliable information:</strong> Keep our content updated with the latest game changes, new characters, and balance updates</li>
              <li><strong>Build useful tools:</strong> Develop build guides, sigil references, and planners that help players make informed decisions</li>
              <li><strong>Foster community:</strong> Create a welcoming space where players can learn, share strategies, and grow together</li>
              <li><strong>Stay accessible:</strong> Keep all resources free and easy to use for players of all skill levels</li>
            </ul>

            <h2>Our Vision</h2>
            <p>
              We envision Granblue Fantasy Relink Endless Ragnarok Wiki as the <strong>go-to destination</strong> for every Granblue Fantasy: Relink player seeking
              to improve their gameplay. We want to be the resource that players trust and rely on, whether they need
              character builds, weapon farming routes, or advanced boss strategies for Endless Ragnarok.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature Card 1 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">⚔️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Characters & Builds</h3>
              <p className="text-slate-300">
                In-depth character guides, roles, skills, and recommended builds for every party member,
                from early game to endgame Loadouts.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🗡️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Weapons & Sigils</h3>
              <p className="text-slate-300">
                Weapon upgrade routes, Ascension and Terminus weapons, sigil effects, drop sources,
                and optimal sigil setups for each character.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🗺️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Quest Walkthroughs</h3>
              <p className="text-slate-300">
                Main story, side quests, and co-op quests with unlock conditions, recommended power,
                and rewards, including Proud difficulty guides.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🐲</div>
              <h3 className="text-xl font-semibold text-white mb-2">Boss Strategies</h3>
              <p className="text-slate-300">
                Phase-by-phase boss mechanics, dangerous attacks, party composition tips, and clear
                strategies for Primal Beasts and endgame fights.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">📦</div>
              <h3 className="text-xl font-semibold text-white mb-2">Materials & Farming</h3>
              <p className="text-slate-300">
                Material uses, drop locations, efficient farming routes, and exchange priorities so you
                can progress your Loadouts without wasted runs.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-2">Multilingual Support</h3>
              <p className="text-slate-300">
                Content available in multiple languages so players worldwide can enjoy guides in their
                preferred language.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Community-Driven</h2>
            <p>
              Granblue Fantasy Relink Endless Ragnarok Wiki is built <strong>by the community, for the community</strong>. We welcome contributions,
              feedback, and suggestions from players of all skill levels. Our content is constantly evolving based on:
            </p>
            <ul>
              <li><strong>Player feedback:</strong> Your suggestions help us improve and expand our resources</li>
              <li><strong>Community discoveries:</strong> New strategies, hidden mechanics, and pro tips shared by players</li>
              <li><strong>Game updates:</strong> We monitor official updates and adjust our content accordingly</li>
              <li><strong>Meta shifts:</strong> We track gameplay trends and update guides based on real player experiences</li>
            </ul>
            <p>
              <strong>Want to contribute?</strong> Whether you've found a stronger build, a faster farming route,
              or have suggestions for new guides, we'd love to hear from you! Reach out through our contact channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>About the Team</h2>
            <p>
              Granblue Fantasy Relink Endless Ragnarok Wiki is maintained by a dedicated team of passionate gamers and developers who love
              Granblue Fantasy: Relink as much as you do. We're players first, constantly testing strategies, exploring game
              mechanics, and staying updated with the latest discoveries.
            </p>
            <p>
              Our team combines expertise in:
            </p>
            <ul>
              <li><strong>Game analysis:</strong> Deep understanding of Granblue Fantasy: Relink mechanics and strategies</li>
              <li><strong>Web development:</strong> Building fast, user-friendly tools and interfaces</li>
              <li><strong>Content creation:</strong> Writing clear, helpful guides and tutorials</li>
              <li><strong>Community management:</strong> Listening to player feedback and fostering a positive environment</li>
            </ul>
            <p className="text-slate-400 italic text-sm">
              Project Codename: "Sky Realm" – Sailing the skies of Zegagga together.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Important Disclaimer</h2>
            <p className="text-yellow-400/90">
              <strong>Granblue Fantasy Relink Endless Ragnarok Wiki is an unofficial fan-made website.</strong> We are NOT affiliated with,
              endorsed by, or associated with Cygames (the developer of Granblue Fantasy: Relink) or any official entities.
            </p>
            <p>
              All game content, trademarks, characters, and assets are the property of their respective owners.
              We use game-related content under fair use principles for informational and educational purposes only.
            </p>
            <p>
              Granblue Fantasy Relink Endless Ragnarok Wiki is a non-profit, community resource created by fans, for fans.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Get in Touch</h2>
            <p>
              We'd love to hear from you! Whether you have questions, suggestions, found a bug, or just want to say hi:
            </p>
            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">General Inquiries</h3>
                <a href="mailto:contact@granbluefantasyrelinkendlessragnarok.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  contact@granbluefantasyrelinkendlessragnarok.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Bug Reports</h3>
                <a href="mailto:support@granbluefantasyrelinkendlessragnarok.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  support@granbluefantasyrelinkendlessragnarok.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Content Submissions</h3>
                <a href="mailto:contribute@granbluefantasyrelinkendlessragnarok.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  contribute@granbluefantasyrelinkendlessragnarok.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Partnerships</h3>
                <a href="mailto:partnerships@granbluefantasyrelinkendlessragnarok.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  partnerships@granbluefantasyrelinkendlessragnarok.wiki
                </a>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              <strong>Response Time:</strong> We aim to respond to all inquiries within 2-3 business days.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-y border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Stay updated with the latest guides, tips, and Granblue Fantasy: Relink news.
            Bookmark this site and check back regularly for new content!
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[hsl(var(--nav-theme-light))] text-white font-semibold hover:opacity-90 transition"
          >
            Explore Resources
          </Link>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Link href="/" className="text-[hsl(var(--nav-theme-light))] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  )
}
