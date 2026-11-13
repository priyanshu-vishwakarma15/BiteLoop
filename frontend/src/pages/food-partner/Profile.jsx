import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandLogo from '../../components/BrandLogo'
import './Profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const [partner, setPartner] = useState(null)
  const [foodItems, setFoodItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [activeTab, setActiveTab] = useState('reels')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadProfile = async () => {
      try {
        const profileResponse = await fetch('http://localhost:3000/api/auth/food-partner/profile', {
          credentials: 'include',
          signal: controller.signal,
        })
        const profileData = await profileResponse.json()

        if (!profileResponse.ok) {
          throw new Error(profileData.message || 'Unable to load your profile.')
        }

        if (!profileData.foodPartner?._id) {
          throw new Error('The profile response is invalid.')
        }

        setPartner(profileData.foodPartner)

        const foodResponse = await fetch(
          `http://localhost:3000/api/food?foodPartner=${encodeURIComponent(profileData.foodPartner._id)}`,
          {
            credentials: 'include',
            signal: controller.signal,
          },
        )
        const foodData = await foodResponse.json()

        if (!foodResponse.ok) {
          throw new Error(foodData.message || 'Unable to load your food reels.')
        }

        if (!Array.isArray(foodData.foodItems)) {
          throw new Error('The food reels response is invalid.')
        }

        setFoodItems(foodData.foodItems)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Unable to load food partner profile', error)
          setLoadError(error.message || 'Unable to load your profile.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadProfile()
    return () => controller.abort()
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      const response = await fetch('http://localhost:3000/api/auth/food-partner/logout', {
        credentials: 'include',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to log out.')
      }

      navigate('/food-partner/login')
    } catch (error) {
      console.error('Unable to log out food partner', error)
      setLogoutError(error.message || 'Unable to log out. Please try again.')
      setIsLoggingOut(false)
    }
  }

  const initials = partner?.RestaurantName
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <main className="partner-profile">
      <header className="profile-topbar">
        <BrandLogo className="biteloop-brand--profile" />
        <nav className="profile-topbar__actions" aria-label="Profile actions">
          <Link className="profile-topbar__feed" to="/">Explore reels</Link>
          <button
            className="profile-topbar__logout"
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Signing out…' : 'Log out'}
          </button>
        </nav>
      </header>

      {logoutError && <p className="profile-signout-error" role="alert">{logoutError}</p>}

      <section className="profile-content" aria-label="Food partner profile">
        {isLoading ? (
          <p className="profile-status" role="status">Loading your profile…</p>
        ) : loadError ? (
          <div className="profile-status profile-status--error" role="alert">
            <p>{loadError}</p>
            <Link to="/food-partner/login">Return to partner sign in</Link>
          </div>
        ) : partner ? (
          <>
            <div className="profile-heading">
              <div
                className="profile-avatar"
                role="img"
                aria-label={`${partner.RestaurantName} profile image`}
              >
                <span>{initials || 'Z+'}</span>
                <span className="profile-avatar__spark" aria-hidden="true">✦</span>
              </div>

              <div className="profile-details">
                <div className="profile-title-row">
                  <h1>{partner.RestaurantName}</h1>
                  <span className="profile-account-badge">Food partner</span>
                  <Link className="profile-button profile-button--primary" to="/create-food">
                    <span aria-hidden="true">＋</span> Add a reel
                  </Link>
                  <Link
                    className="profile-button profile-button--secondary"
                    to={`/food-partner/${partner._id}`}
                  >
                    View public profile
                  </Link>
                </div>

                <div className="profile-stats" aria-label="Profile statistics">
                  <span><strong>{foodItems.length}</strong> {foodItems.length === 1 ? 'post' : 'posts'}</span>
                </div>

                <div className="profile-bio">
                  <strong>{partner.name}</strong>
                  <a href={`mailto:${partner.email}`}>{partner.email}</a>
                  <Link to={`/food-partner/${partner._id}`}>Visit your public store ↗</Link>
                </div>
              </div>
            </div>

            <div className="profile-highlights" aria-label="Profile highlights">
              <div className="profile-highlight">
                <span className="profile-highlight__ring">
                  <span className="profile-highlight__icon" aria-hidden="true">＋</span>
                </span>
                <span>New</span>
              </div>
            </div>

            <div className="profile-divider" />
            <div className="profile-tabs" role="tablist" aria-label="Profile content">
              <button
                className={activeTab === 'reels' ? 'profile-tab is-active' : 'profile-tab'}
                id="profile-reels-tab"
                type="button"
                role="tab"
                aria-selected={activeTab === 'reels'}
                aria-controls="profile-posts"
                onClick={() => setActiveTab('reels')}
              >
                <span aria-hidden="true">▦</span> POSTS
              </button>
              <button
                className={activeTab === 'tagged' ? 'profile-tab is-active' : 'profile-tab'}
                id="profile-tagged-tab"
                type="button"
                role="tab"
                aria-selected={activeTab === 'tagged'}
                aria-controls="profile-posts"
                onClick={() => setActiveTab('tagged')}
              >
                <span aria-hidden="true">♙</span> TAGGED
              </button>
            </div>

            <div
              className="profile-posts"
              id="profile-posts"
              role="tabpanel"
              aria-labelledby={activeTab === 'reels' ? 'profile-reels-tab' : 'profile-tagged-tab'}
            >
              {activeTab === 'tagged' ? (
                <div className="profile-empty">
                  <span className="profile-empty__icon" aria-hidden="true">♙</span>
                  <h2>Photos and videos of you</h2>
                  <p>When someone tags your restaurant, it’ll show up here.</p>
                </div>
              ) : foodItems.length === 0 ? (
                <div className="profile-empty">
                  <span className="profile-empty__icon profile-empty__icon--reel" aria-hidden="true">▶</span>
                  <h2>Share your first food reel</h2>
                  <p>Give people a taste of what makes your restaurant special.</p>
                  <Link className="profile-empty__link" to="/create-food">Create your first reel</Link>
                </div>
              ) : (
                <div className="profile-grid">
                  {foodItems.map((item) => (
                    <Link
                      className="profile-grid__item"
                      key={item._id}
                      to={`/food-partner/${partner._id}`}
                      aria-label={`View ${item.name}`}
                    >
                      <video src={item.video} muted playsInline preload="metadata" />
                      <span className="profile-grid__overlay">
                        <span className="profile-grid__play" aria-hidden="true">▶</span>
                        <span>{item.name}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </section>
    </main>
  )
}

export default Profile
