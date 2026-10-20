'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Work = {
  id: string;
  title: string;
  category: 'photos' | 'apps' | 'edits';
  description: string;
  image_url: string | null;
  project_url: string | null;
};

const featuredApp: Work = {
  id: 'featured-lunix',
  title: 'Lunix',
  category: 'apps',
  description: 'Android app · Version 1.0.2',
  image_url: '/apps/lunix-icon.png',
  project_url: null,
};

const categoryLabels: Record<Work['category'], string> = {
  photos: 'Photography',
  apps: 'App',
  edits: 'Edit',
};

export default function Home() {
  const [works, setWorks] = useState<Work[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Work | null>(null);

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setError('Add Supabase environment variables before running the site.');
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) setError('Could not load portfolio. Check your Supabase setup.');
      else setWorks((data || []) as Work[]);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selected]);

  const existingWorks = works.filter(
    (work) => !(work.category === 'apps' && work.title.trim().toLowerCase() === 'lunix'),
  );
  const shown =
    filter === 'all'
      ? [featuredApp, ...existingWorks]
      : filter === 'apps'
        ? [featuredApp, ...existingWorks.filter((work) => work.category === 'apps')]
        : existingWorks.filter((work) => work.category === filter);

  return (
    <>
      <header className="top">
        <div className="shell bar">
          <Link className="brand" href="/">● TheJasonLabs</Link>
          <div>
            <a className="btn" href="#work">Explore work</a>{' '}
            <Link className="btn" href="/admin">Owner login</Link>
          </div>
        </div>
      </header>
      <main>
        <section className="hero shell">
          <span className="eyebrow">PERSONAL PORTFOLIO · DIGITAL CREATOR</span>
          <h1>My work.<br /><span className="muted">Photography, apps &amp; edits.</span></h1>
          <p>A curated showcase of my photography, custom applications, and visual experiments. Every project here is selected and managed by TheJasonLabs.</p>
          <p style={{ marginTop: 24 }}><a className="btn primary" href="#work">Explore my work ↓</a></p>
        </section>
        <section id="work" className="shell">
          <div className="sectionhead">
            <div>
              <h2>Selected work</h2>
              <p className="notice">A growing archive of things I’ve made.</p>
            </div>
            <div className="filters">
              {[
                ['all', 'All'],
                ['photos', 'Photography'],
                ['apps', 'Apps'],
                ['edits', 'Edits'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={'filter ' + (filter === key ? 'active' : '')}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <p className="notice">Loading portfolio…</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : shown.length === 0 ? (
            <p className="notice">No projects yet. Sign in to the owner panel to add your first project.</p>
          ) : (
            <div className="grid">
              {shown.map((work) => (
                <article className="project" key={work.id}>
                  <button
                    className="projectVisual"
                    type="button"
                    aria-label={'View ' + work.title + ' details'}
                    onClick={() => setSelected(work)}
                  >
                    {work.image_url ? (
                      <img
                        className={work.id === featuredApp.id ? 'appIcon' : 'workPhoto'}
                        src={work.image_url}
                        alt={work.id === featuredApp.id ? 'Lunix app icon' : work.title}
                      />
                    ) : (
                      <span className="projectPlaceholder">TheJasonLabs</span>
                    )}
                  </button>
                  <div className="copy">
                    <span className="pill">{categoryLabels[work.category]}</span>
                    <h3>{work.title}</h3>
                    <p>{work.description}</p>
                    {work.project_url && (
                      <a className="link" href={work.project_url} target="_blank" rel="noreferrer">
                        View project ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <footer className="footer">
        <div className="shell">© {new Date().getFullYear()} TheJasonLabs · Made by me. Managed by me.</div>
      </footer>
      {selected && (
        <div className="workModal" role="presentation" onClick={() => setSelected(null)}>
          <section
            className="workDialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="work-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="btn modalClose"
              aria-label="Close project details"
              onClick={() => setSelected(null)}
            >
              Close ×
            </button>
            <div className={'workMedia' + (selected.id === featuredApp.id ? ' workMediaApp' : '')}>
              {selected.image_url ? (
                <img
                  className={selected.id === featuredApp.id ? 'detailAppIcon' : 'detailPhoto'}
                  src={selected.image_url}
                  alt={selected.id === featuredApp.id ? 'Lunix app icon' : selected.title}
                />
              ) : (
                <div className="detailPlaceholder">TheJasonLabs</div>
              )}
            </div>
            <span className="pill">{categoryLabels[selected.category]}</span>
            <h2 id="work-detail-title">{selected.title}</h2>
            <p className="workDetailDescription">{selected.description}</p>
            {selected.project_url && (
              <a className="link" href={selected.project_url} target="_blank" rel="noreferrer">
                View project ↗
              </a>
            )}
          </section>
        </div>
      )}
    </>
  );
}
