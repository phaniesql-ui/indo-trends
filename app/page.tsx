'use client'
import { useState, useCallback } from 'react'
import styles from './page.module.css'

type Platform = 'all' | 'tiktok' | 'instagram' | 'x'

interface TrendData {
  date: string
  platform_focus: string
  emerging_formats: { title: string; platform: string; why: string }[]
  viral_patterns: { title: string; desc: string }[]
  platform_insights: { platform: string; insight: string }[]
  content_ideas: { platform: string; title: string; desc: string }[]
  declining: { what: string; why: string }[]
}

interface HistoryEntry {
  time: string
  platform: Platform
  data: TrendData
}

const PLATFORM_LABELS: Record<Platform, string> = {
  all: 'Semua Platform',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  x: 'X / Twitter',
}

const PLATFORM_COLORS: Record<string, string> = {
  tiktok: '#69C9D0',
  instagram: '#E1306C',
  x: '#8899AA',
  all: '#E8341A',
}

function PlatformBadge({ platform }: { platform: string }) {
  if (platform === 'all') {
    return (
      <span className={styles.badgeRow}>
        {(['tiktok', 'instagram', 'x'] as const).map(p => (
          <span key={p} className={styles.badge} style={{ color: PLATFORM_COLORS[p], borderColor: `${PLATFORM_COLORS[p]}40` }}>
            {PLATFORM_LABELS[p]}
          </span>
        ))}
      </span>
    )
  }
  const color = PLATFORM_COLORS[platform] || '#aaa'
  return (
    <span className={styles.badge} style={{ color, borderColor: `${color}40` }}>
      {PLATFORM_LABELS[platform as Platform] || platform}
    </span>
  )
}

export default function Home() {
  const [platform, setPlatform] = useState<Platform>('all')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<TrendData | null>(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [activeHistory, setActiveHistory] = useState<number | null>(null)
  const [lastUpdated, setLastUpdated] = useState('')

  const todayStr = () => new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  const fetchTrends = useCallback(async () => {
    setLoading(true)
    setError('')
    setActiveHistory(null)

    try {
      const res = await fetch('/api/trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, date: todayStr() }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)

      setData(json)
      const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      setLastUpdated(`Diperbarui ${time}`)
      const entry: HistoryEntry = { time, platform, data: json }
      setHistory(prev => [entry, ...prev].slice(0, 6))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal fetch. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }, [platform])

  const displayData = activeHistory !== null ? history[activeHistory]?.data : data

  const filtered = useCallback((arr: { platform: string }[]) => {
    if (platform === 'all') return arr
    return arr.filter(i => i.platform === platform || i.platform === 'all')
  }, [platform])

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.logoArea}>
            <span className={styles.logoAccent}>ID</span>
            <div>
              <h1 className={styles.title}>Indo Trends</h1>
              <p className={styles.subtitle}>Daily Indonesia Social Media Brief</p>
            </div>
          </div>
          <button
            className={styles.refreshBtn}
            onClick={fetchTrends}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.spinner}>↻</span>
            ) : '↻'}
            {loading ? 'Generating...' : 'Refresh Trends'}
          </button>
        </div>

        {/* Platform tabs */}
        <div className={styles.tabs}>
          {(Object.keys(PLATFORM_LABELS) as Platform[]).map(p => (
            <button
              key={p}
              className={`${styles.tab} ${platform === p ? styles.tabActive : ''}`}
              onClick={() => setPlatform(p)}
              style={platform === p ? { borderColor: PLATFORM_COLORS[p], color: PLATFORM_COLORS[p] } : {}}
            >
              {PLATFORM_LABELS[p]}
            </button>
          ))}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className={styles.historyBar}>
            <span className={styles.historyLabel}>Riwayat:</span>
            {history.map((h, i) => (
              <button
                key={i}
                className={`${styles.historyChip} ${activeHistory === i ? styles.historyChipActive : ''}`}
                onClick={() => { setActiveHistory(i === activeHistory ? null : i); setData(activeHistory === i ? data : null) }}
              >
                {h.time} · {PLATFORM_LABELS[h.platform]}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className={styles.content}>
        {error && <div className={styles.errorBox}>{error}</div>}

        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.loadingPulse} />
            <p>Generating Indonesia trend brief...</p>
          </div>
        )}

        {!loading && !displayData && !error && (
          <div className={styles.emptyState}>
            <div className={styles.emptyHero}>
              <span className={styles.emptyFlag}>🇮🇩</span>
              <h2>Siap generate brief hari ini?</h2>
              <p>Klik Refresh Trends untuk mendapatkan<br />update tren Indonesia terkini.</p>
              <button className={styles.emptyBtn} onClick={fetchTrends}>
                Mulai sekarang ↗
              </button>
            </div>
          </div>
        )}

        {!loading && displayData && (
          <div className={styles.brief}>
            <div className={styles.briefMeta}>
              <span className={styles.liveTag}>● LIVE</span>
              <span>{displayData.date}</span>
              <span>·</span>
              <span>{displayData.platform_focus}</span>
              {lastUpdated && <><span>·</span><span>{lastUpdated}</span></>}
            </div>

            {/* Grid layout */}
            <div className={styles.grid}>

              {/* Emerging formats */}
              <section className={`${styles.section} ${styles.spanFull}`}>
                <h3 className={styles.sectionTitle}><span className={styles.sectionNum}>01</span> Format yang sedang naik</h3>
                <div className={styles.cardRow}>
                  {filtered(displayData.emerging_formats).map((f, i) => (
                    <div key={i} className={styles.card}>
                      <PlatformBadge platform={f.platform} />
                      <p className={styles.cardTitle}>{f.title}</p>
                      <p className={styles.cardBody}>{f.why}</p>
                    </div>
                  ))}
                  {filtered(displayData.emerging_formats).length === 0 && <p className={styles.empty}>Tidak ada data untuk platform ini.</p>}
                </div>
              </section>

              {/* Viral patterns */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}><span className={styles.sectionNum}>02</span> Pola konten viral</h3>
                <div className={styles.listStack}>
                  {displayData.viral_patterns.map((v, i) => (
                    <div key={i} className={styles.listItem}>
                      <span className={styles.listBullet}>{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <p className={styles.listTitle}>{v.title}</p>
                        <p className={styles.listDesc}>{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Platform insights */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}><span className={styles.sectionNum}>03</span> Insight per platform</h3>
                <div className={styles.listStack}>
                  {(platform === 'all' ? displayData.platform_insights : displayData.platform_insights.filter(i => i.platform === platform)).map((ins, i) => (
                    <div key={i} className={styles.insightItem}>
                      <PlatformBadge platform={ins.platform} />
                      <p className={styles.listDesc}>{ins.insight}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Content ideas */}
              <section className={`${styles.section} ${styles.spanFull}`}>
                <h3 className={styles.sectionTitle}><span className={styles.sectionNum}>04</span> Ide konten hari ini</h3>
                <div className={styles.ideaGrid}>
                  {filtered(displayData.content_ideas).map((idea, i) => (
                    <div key={i} className={styles.ideaCard}>
                      <div className={styles.ideaHeader}>
                        <span className={styles.ideaNum}>Ide {i + 1}</span>
                        <PlatformBadge platform={idea.platform} />
                      </div>
                      <p className={styles.ideaTitle}>{idea.title}</p>
                      <p className={styles.ideaDesc}>{idea.desc}</p>
                    </div>
                  ))}
                  {filtered(displayData.content_ideas).length === 0 && <p className={styles.empty}>Tidak ada ide untuk platform ini.</p>}
                </div>
              </section>

              {/* Declining */}
              <section className={`${styles.section} ${styles.spanFull}`}>
                <h3 className={styles.sectionTitle}><span className={styles.sectionNum}>05</span> Yang sedang menurun</h3>
                <div className={styles.declineRow}>
                  {displayData.declining.map((d, i) => (
                    <div key={i} className={styles.declineItem}>
                      <span className={styles.xMark}>×</span>
                      <div>
                        <p className={styles.declineWhat}>{d.what}</p>
                        <p className={styles.declineWhy}>{d.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <span>Indo Trends · Powered by Claude AI</span>
        <span>Data bersifat AI-generated, bukan real-time scraping</span>
      </footer>
    </main>
  )
}
