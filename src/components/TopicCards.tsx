import { TOPIC_MODULES } from '../data/chemistryData'
import type { TopicModule } from '../types/chemistry'

interface TopicCardsProps {
  onSelectModule: (targetSectionId: string) => void
}

export function TopicCards({ onSelectModule }: TopicCardsProps) {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'flask':
        return (
          <svg
            className="card-module-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
            <path d="M8.5 2h7" />
            <circle cx="10" cy="16" r="1" />
            <circle cx="13" cy="14" r="1" />
          </svg>
        )
      case 'test-tube':
        return (
          <svg
            className="card-module-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2" />
            <path d="M8.5 2h7" />
            <path d="M9.5 12h5" />
            <circle cx="12" cy="16" r="1" />
          </svg>
        )
      case 'calculator':
      default:
        return (
          <svg
            className="card-module-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="16" y1="14" x2="16" y2="18" />
            <path d="M16 10h.01" />
            <path d="M12 10h.01" />
            <path d="M8 10h.01" />
            <path d="M12 14h.01" />
            <path d="M8 14h.01" />
            <path d="M12 18h.01" />
            <path d="M8 18h.01" />
          </svg>
        )
    }
  }

  return (
    <section className="topic-cards-section" aria-labelledby="topic-modules-heading">
      <div className="section-header-center">
        <span className="section-eyebrow">Alur Pembelajaran Inkuiri</span>
        <h2 id="topic-modules-heading" className="section-title">
          Tiga Modul Utama AsamBasa Lab
        </h2>
        <p className="section-description">
          Dirancang sistematis untuk membantu siswa SMA/MA Kelas XI memahami teori,
          melakukan pengujian virtual, dan menguasai konsep kuantitatif keasaman.
        </p>
      </div>

      <div className="topic-cards-grid">
        {TOPIC_MODULES.map((item: TopicModule, idx: number) => {
          return (
            <article
              key={item.id}
              className={`topic-card topic-card-${idx + 1}`}
              aria-labelledby={`card-title-${item.id}`}
            >
              <div className="topic-card-top">
                <div className="topic-icon-badge">{renderIcon(item.icon)}</div>
                <span className="topic-pill-tag">{item.badge}</span>
              </div>

              <div className="topic-card-body">
                <span className="topic-tagline">{item.tagline}</span>
                <h3 id={`card-title-${item.id}`} className="topic-title">
                  {item.title}
                </h3>
                <p className="topic-description">{item.description}</p>

                <div className="topic-keypoints">
                  <span className="keypoints-label">Fokus Pembelajaran:</span>
                  <ul className="keypoints-list">
                    {item.keyPoints.map((point: string, i: number) => (
                      <li key={i} className="keypoint-item">
                        <svg
                          className="keypoint-check-svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="topic-card-footer">
                <button
                  type="button"
                  className="btn btn-card-action"
                  onClick={() => onSelectModule(item.targetSectionId)}
                  id={`btn-module-${item.id}`}
                >
                  <span>Pelajari Materi</span>
                  <svg
                    className="btn-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
