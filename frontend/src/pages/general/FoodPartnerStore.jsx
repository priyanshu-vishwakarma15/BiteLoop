import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import BrandLogo from '../../components/BrandLogo'
import './FoodPartnerStore.css'

const FoodPartnerStore = () => {
  const { foodPartnerId } = useParams()
  const [foodItems, setFoodItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadStore = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/food?foodPartner=${encodeURIComponent(foodPartnerId)}`,
          { credentials: 'include', signal: controller.signal },
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load this store.')
        }

        setFoodItems(data.foodItems)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Unable to load food partner store', error)
          setLoadError(error.message || 'Unable to load this store.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadStore()
    return () => controller.abort()
  }, [foodPartnerId])

  const foodPartner = foodItems.find((item) => item.foodPartner)?.foodPartner

  return (
    <main className="store-page">
      <header className="store-header">
        <Link className="store-back-link" to="/">← Back to videos</Link>
        <BrandLogo className="biteloop-brand--store" />
      </header>

      {loading ? (
        <p className="store-message" role="status">Loading store...</p>
      ) : loadError ? (
        <div className="store-message" role="alert">
          <p>{loadError}</p>
          <Link to="/user/login">Log in to visit this store</Link>
        </div>
      ) : (
        <section className="store-content">
          <div className="store-intro">
            <p className="store-eyebrow">Food partner</p>
            <h1>{foodPartner?.RestaurantName || 'Store'}</h1>
            {foodPartner?.name && <p className="store-owner">By {foodPartner.name}</p>}
          </div>

          {foodItems.length === 0 ? (
            <p className="store-empty">This store has no food videos yet.</p>
          ) : (
            <div className="store-food-grid">
              {foodItems.map((item) => (
                <article className="store-food-card" key={item._id}>
                  <video src={item.video} controls muted playsInline preload="metadata">
                    Your browser does not support video playback.
                  </video>
                  <div className="store-food-copy">
                    <h2>{item.name}</h2>
                    {item.description && <p>{item.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  )
}

export default FoodPartnerStore
