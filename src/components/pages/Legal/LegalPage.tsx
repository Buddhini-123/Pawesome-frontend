import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Lock, FileText, Clock, ChevronRight, Mail, ArrowUp } from 'lucide-react';
import { api } from '../../../services/api';

/* ─── Types ─────────────────────────────────────────────── */
interface TocItem { id: string; text: string; level: number; }
interface LegalPageProps { slug: 'terms' | 'privacy'; }

/* ─── Config per page ────────────────────────────────────── */
const PAGE_CONFIG = {
  terms: {
    icon:        Shield,
    accent:      'from-primary-blue to-blue-700',
    accentLight: 'bg-blue-50',
    accentText:  'text-primary-blue',
    accentBorder:'border-primary-blue',
    badge:       'bg-blue-100 text-blue-700',
    label:       'Legal',
    subtitle:    'Please read these terms carefully before using our services.',
    related:     { slug: 'privacy', label: 'Privacy Policy', path: '/privacy' },
  },
  privacy: {
    icon:        Lock,
    accent:      'from-mint-green to-teal-600',
    accentLight: 'bg-teal-50',
    accentText:  'text-mint-green',
    accentBorder:'border-mint-green',
    badge:       'bg-teal-100 text-teal-700',
    label:       'Privacy',
    subtitle:    'We are committed to protecting your personal data and privacy.',
    related:     { slug: 'terms', label: 'Terms and Conditions', path: '/terms' },
  },
} as const;

/* ─── Extract headings from HTML for TOC ─────────────────── */
function extractToc(html: string): TocItem[] {
  const div = document.createElement('div');
  div.innerHTML = html;
  const items: TocItem[] = [];
  div.querySelectorAll('h2, h3').forEach((el, i) => {
    const id = `section-${i}`;
    el.id = id;
    items.push({ id, text: el.textContent ?? '', level: el.tagName === 'H2' ? 2 : 3 });
  });
  return items;
}

/* ─── Inject IDs into rendered HTML ─────────────────────── */
function injectIds(html: string): string {
  let counter = 0;
  return html.replace(/<(h[23])(.*?)>/gi, (_match, tag, attrs) => {
    return `<${tag}${attrs} id="section-${counter++}">`;
  });
}

/* ─── Skeleton loader ────────────────────────────────────── */
const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className={`h-4 bg-gray-200 rounded ${i % 3 === 0 ? 'w-2/5' : 'w-full'}`} />
    ))}
  </div>
);

/* ─── Main Component ─────────────────────────────────────── */
const LegalPage: React.FC<LegalPageProps> = ({ slug }) => {
  const cfg = PAGE_CONFIG[slug];
  const Icon = cfg.icon;

  const [title, setTitle]       = useState('');
  const [content, setContent]   = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [toc, setToc]           = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [showTop, setShowTop]   = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  /* Fetch page */
  useEffect(() => {
    setLoading(true);
    setError(false);
    api.get<any>(`/pages/${slug}`).then((res) => {
      if (res.success && res.data?.data) {
        const raw = res.data.data;
        setTitle(raw.title ?? '');
        setUpdatedAt(raw.updated_at ?? '');
        const withIds = injectIds(raw.content ?? '');
        setContent(withIds);
        setToc(extractToc(raw.content ?? ''));
      } else {
        setError(true);
      }
    }).catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  /* Track active heading on scroll */
  useEffect(() => {
    const handler = () => {
      setShowTop(window.scrollY > 400);
      const headings = contentRef.current?.querySelectorAll('h2, h3') ?? [];
      let current = '';
      headings.forEach((el) => {
        if (el.getBoundingClientRect().top < 120) current = el.id;
      });
      if (current) setActiveId(current);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [content]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-off-white">
        <div className={`bg-gradient-to-r ${cfg.accent} h-56`} />
        <div className="max-w-5xl mx-auto px-4 -mt-12 pb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8"><Skeleton /></div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <FileText className="mx-auto h-16 w-16 text-light-gray mb-4" />
          <h2 className="text-2xl font-fredoka font-bold text-charcoal mb-2">Page Unavailable</h2>
          <p className="text-medium-gray font-fredoka mb-6">We couldn't load this page right now. Please try again later.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-primary-blue text-white px-6 py-2.5 rounded-full font-fredoka font-medium hover:opacity-90 transition-opacity">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white">

      {/* ── Hero Banner ─────────────────────────────── */}
      <div className={`bg-gradient-to-br ${cfg.accent} relative overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white/10" />

        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-fredoka font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              <Icon className="h-3.5 w-3.5" />
              {cfg.label}
            </div>

            <h1 className="text-3xl md:text-5xl font-fredoka font-bold text-white mb-3 leading-tight">
              {title}
            </h1>
            <p className="text-white/80 font-fredoka text-base md:text-lg max-w-xl">
              {cfg.subtitle}
            </p>

            {formattedDate && (
              <div className="mt-5 inline-flex items-center gap-2 bg-white/15 text-white/90 text-sm font-fredoka px-4 py-1.5 rounded-full">
                <Clock className="h-4 w-4" />
                Last updated: {formattedDate}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
        <div className="flex gap-8 items-start">

          {/* ── Sticky TOC sidebar ── */}
          {toc.length > 0 && (
            <motion.aside
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="hidden lg:block w-64 flex-shrink-0 sticky top-24"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-light-gray overflow-hidden">
                <div className={`px-4 py-3 ${cfg.accentLight} border-b border-light-gray`}>
                  <p className={`text-xs font-fredoka font-bold uppercase tracking-wider ${cfg.accentText}`}>
                    On this page
                  </p>
                </div>
                <nav className="py-2">
                  {toc.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollTo(item.id)}
                      className={`w-full text-left px-4 py-2 text-sm font-fredoka transition-colors flex items-center gap-2 group ${
                        activeId === item.id
                          ? `${cfg.accentText} font-semibold bg-gray-50`
                          : 'text-medium-gray hover:text-charcoal hover:bg-gray-50'
                      } ${item.level === 3 ? 'pl-7' : ''}`}
                    >
                      {activeId === item.id && (
                        <span className={`w-1 h-1 rounded-full flex-shrink-0 ${cfg.accentText} bg-current`} />
                      )}
                      <span className="line-clamp-2">{item.text}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Related page card */}
              <div className="mt-4 bg-white rounded-2xl shadow-sm border border-light-gray p-4">
                <p className="text-xs text-medium-gray font-fredoka mb-2 uppercase tracking-wider">Also read</p>
                <Link
                  to={cfg.related.path}
                  className={`flex items-center justify-between gap-2 text-sm font-fredoka font-medium ${cfg.accentText} hover:opacity-80 transition-opacity`}
                >
                  <span>{cfg.related.label}</span>
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                </Link>
              </div>
            </motion.aside>
          )}

          {/* ── Main content card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 min-w-0"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-light-gray overflow-hidden">
              {/* Accent bar */}
              <div className={`h-1 bg-gradient-to-r ${cfg.accent}`} />

              <div
                ref={contentRef}
                className={`
                  px-6 md:px-10 py-8 md:py-10
                  prose prose-base max-w-none text-charcoal
                  prose-headings:font-fredoka prose-headings:text-charcoal prose-headings:scroll-mt-28
                  prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-3
                  prose-h2:pb-2 prose-h2:border-b prose-h2:border-light-gray
                  prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-2
                  prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                  prose-li:text-gray-600 prose-li:mb-1.5
                  prose-ul:my-4 prose-ol:my-4
                  prose-a:text-primary-blue prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                  prose-strong:text-charcoal prose-strong:font-semibold
                  prose-hr:border-light-gray prose-hr:my-8
                  prose-code:bg-soft-gray prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-charcoal
                  [&_h2]:flex [&_h2]:items-center [&_h2]:gap-2
                  [&_h2::before]:content-[''] [&_h2::before]:inline-block [&_h2::before]:w-1 [&_h2::before]:h-6 [&_h2::before]:rounded-full [&_h2::before]:flex-shrink-0
                `}
                style={
                  {
                    '--tw-prose-h2-before-bg':
                      slug === 'terms' ? '#2196F3' : '#4ECDC4',
                  } as React.CSSProperties
                }
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>

            {/* ── Footer card ── */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-light-gray p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-fredoka font-semibold text-charcoal">Have a question?</p>
                <p className="text-sm text-medium-gray font-fredoka mt-0.5">
                  Contact us if you need clarification on any of the above.
                </p>
              </div>
              <a
                href="mailto:vevomalik547@gmail.com"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-fredoka font-semibold text-white bg-gradient-to-r ${cfg.accent} hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0`}
              >
                <Mail className="h-4 w-4" />
                Get in touch
              </a>
            </div>

            {/* ── Mobile: also-read link ── */}
            <div className="mt-4 lg:hidden bg-white rounded-2xl border border-light-gray px-5 py-4">
              <p className="text-xs text-medium-gray font-fredoka uppercase tracking-wider mb-1.5">Also read</p>
              <Link
                to={cfg.related.path}
                className={`flex items-center justify-between font-fredoka font-medium ${cfg.accentText}`}
              >
                <span>{cfg.related.label}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Back to top ── */}
      {showTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-8 right-6 z-50 p-3 rounded-full shadow-lg text-white bg-gradient-to-br ${cfg.accent} hover:opacity-90 transition-opacity`}
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </div>
  );
};

export default LegalPage;
