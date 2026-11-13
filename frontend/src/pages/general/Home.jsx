import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '../../components/BrandLogo'
import sampleVideoOne from '../../../../videos/14713479_1080_1920_30fps.mp4'
import sampleVideoTwo from '../../../../videos/video.mp4.mp4'
import './Home.css'

const foodApiUrl = 'http://localhost:3000/api/food'
const userProfileUrl = 'http://localhost:3000/api/auth/user/profile'
const foodPartnerProfileUrl = 'http://localhost:3000/api/auth/food-partner/profile'
const sampleFoodItems = [
  {
    _id: 'sample-video-one',
    name: 'Sample food video',
    description: 'A preview video while the feed is waiting for its first food posts.',
    video: sampleVideoOne,
    isSample: true,
  },
  {
    _id: 'sample-video-two',
    name: 'Sample food video',
    description: 'A preview video while the feed is waiting for its first food posts.',
    video: sampleVideoTwo,
    isSample: true,
  },
]

const Home = () => {
  const feedRef = useRef(null)
  const videoRefs = useRef([])
  const activeIndexRef = useRef(0)
  const [reels, setReels] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(false)
  const [liked, setLiked] = useState([])
  const [saved, setSaved] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [authType, setAuthType] = useState(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadFoodItems = async () => {
      try {
        const response = await fetch(foodApiUrl, {
          credentials: 'include',
          signal: controller.signal,
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load food videos.')
        }

        if (!Array.isArray(data.foodItems)) {
          throw new Error('The food videos response is invalid.')
        }

        setReels(data.foodItems.length > 0 ? data.foodItems : sampleFoodItems)
        setLoadError('')
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Unable to load food videos', error)
          setLoadError(error.message || 'Unable to load food videos.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadFoodItems()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const [userResponse, foodPartnerResponse] = await Promise.all([
          fetch(userProfileUrl, {
            credentials: 'include',
            signal: controller.signal,
          }),
          fetch(foodPartnerProfileUrl, {
            credentials: 'include',
            signal: controller.signal,
          }),
        ])

        if (!controller.signal.aborted) {
          setAuthType(foodPartnerResponse.ok ? 'food-partner' : userResponse.ok ? 'user' : null)
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Unable to check authentication status', error)
        }
      }
    }

    const controller = new AbortController()
    checkAuthentication()
    return () => controller.abort()
  }, [])

  const handleLogout = async () => {
    if (!authType) return

    setIsLoggingOut(true)
    setLogoutError('')

    try {
      const response = await fetch(`http://localhost:3000/api/auth/${authType}/logout`, {
        credentials: 'include',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to log out. Please try again.')
      }

      setAuthType(null)
    } catch (error) {
      console.error('Unable to log out', error)
      setLogoutError(error.message || 'Unable to log out. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  useEffect(() => {
    const feed = feedRef.current
    if (!feed || reels.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0]

        if (visibleEntry) {
          const nextIndex = Number(visibleEntry.target.dataset.index)
          if (nextIndex !== activeIndexRef.current) {
            activeIndexRef.current = nextIndex
            setActiveIndex(nextIndex)
            setPaused(false)
          }
        }
      },
      { root: feed, threshold: [0.55, 0.75, 0.95] },
    )

    feed.querySelectorAll('.reel').forEach((reel) => observer.observe(reel))
    return () => observer.disconnect()
  }, [reels.length])

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return

      video.muted = muted
      if (index === activeIndex && !paused) {
        video.play().catch((error) => {
          console.error('Unable to play feed video', error)
        })
      } else {
        video.pause()
      }
    })
  }, [activeIndex, muted, paused, reels])

  const toggleItem = (items, setItems, id) => {
    setItems((currentItems) => (
      currentItems.includes(id)
        ? currentItems.filter((item) => item !== id)
        : [...currentItems, id]
    ))
  }

  const togglePlayback = () => {
    const video = videoRefs.current[activeIndex]
    if (!video) return

    if (video.paused) {
      video.play().then(() => setPaused(false)).catch((error) => {
        console.error('Unable to play feed video', error)
      })
    } else {
      video.pause()
      setPaused(true)
    }
  }

  return (
    <main className="reels-page">
      <header className="reels-header">
        <BrandLogo className="biteloop-brand--feed" />
        <p className="reels-header-note">Good food looks good on you</p>

        {authType ? (
          <button
            className="reels-auth-link reels-auth-link--primary"
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out…' : 'Log out'}
          </button>
        ) : (
          <Link className="reels-auth-link reels-auth-link--primary" to="/register" aria-label="Sign in or register">
            Sign in / Register
          </Link>
        )}

        <button
          className="sound-button"
          type="button"
          onClick={() => setMuted((currentMuted) => !currentMuted)}
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          aria-pressed={!muted}
        >
          {muted ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11 5 6 9H3v6h3l5 4V5ZM16 9l5 6m0-6-5 6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11 5 6 9H3v6h3l5 4V5Zm4 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" />
            </svg>
          )}
          <span>{muted ? 'Sound off' : 'Sound on'}</span>
        </button>
      </header>

      {logoutError && <p className="reels-logout-error" role="alert">{logoutError}</p>}

      {loading ? (
        <p className="reels-message" role="status">Loading food videos...</p>
      ) : loadError ? (
        <div className="reels-message" role="alert">
          <p>{loadError}</p>
        </div>
      ) : reels.length === 0 ? (
        <p className="reels-message">No food videos yet. Check back soon.</p>
      ) : (
        <div className="reels-feed" ref={feedRef} aria-label="Food videos">
          {reels.map((reel, index) => {
            const partnerId = reel.foodPartner?._id

            return (
              <article className="reel" data-index={index} key={reel._id}>
                <video
                  className="reel-video"
                  src={reel.video}
                  ref={(element) => { videoRefs.current[index] = element }}
                  autoPlay
                  muted={muted}
                  loop
                  playsInline
                  aria-label={`Food video: ${reel.name}`}
                />
                <div className="reel-shade" />

                <button
                  className="reel-play-area"
                  type="button"
                  onClick={togglePlayback}
                  aria-label={paused && activeIndex === index ? 'Play video' : 'Pause video'}
                >
                  {paused && activeIndex === index && (
                    <span className="play-indicator" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="m8 5 12 7-12 7V5Z" />
                      </svg>
                    </span>
                  )}
                </button>

                <div className="reel-copy">
                  <p className="reel-eyebrow">
                    {reel.isSample
                      ? 'Sample video'
                      : reel.foodPartner?.RestaurantName || 'A taste of something good'}
                  </p>
                  <h1>{reel.name}</h1>
                  <p className="reel-description">
                    {reel.description || 'Discover this dish from a local food partner.'}
                  </p>
                  {reel.isSample ? null : partnerId ? (
                    <Link className="reel-visit-store" to={`/food-partner/${partnerId}`}>
                      Visit store
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12h14m-6-6 6 6-6 6" />
                      </svg>
                    </Link>
                  ) : (
                    <span className="reel-store-unavailable">Store unavailable</span>
                  )}
                </div>

                <div className="reel-actions" aria-label="Video actions">
                  <button
                    type="button"
                    className={`reel-action${liked.includes(reel._id) ? ' is-active' : ''}`}
                    onClick={() => toggleItem(liked, setLiked, reel._id)}
                    aria-label={liked.includes(reel._id) ? 'Unlike video' : 'Like video'}
                    aria-pressed={liked.includes(reel._id)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                    </svg>
                    <span>{liked.includes(reel._id) ? 'Liked' : 'Like'}</span>
                  </button>
                  <button
                    type="button"
                    className={`reel-action${saved.includes(reel._id) ? ' is-active' : ''}`}
                    onClick={() => toggleItem(saved, setSaved, reel._id)}
                    aria-label={saved.includes(reel._id) ? 'Remove from saved' : 'Save video'}
                    aria-pressed={saved.includes(reel._id)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4V4.5Z" />
                    </svg>
                    <span>{saved.includes(reel._id) ? 'Saved' : 'Save'}</span>
                  </button>
                  <button
                    type="button"
                    className="reel-action"
                    onClick={togglePlayback}
                    aria-label={paused && activeIndex === index ? 'Play video' : 'Pause video'}
                  >
                    {paused && activeIndex === index ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m8 5 12 7-12 7V5Z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 5h3v14H8zM15 5h3v14h-3z" />
                      </svg>
                    )}
                    <span>{paused && activeIndex === index ? 'Play' : 'Pause'}</span>
                  </button>
                </div>

                <div className="reel-progress" aria-hidden="true">
                  <span className={activeIndex === index ? 'is-active' : ''} />
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default Home
