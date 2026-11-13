import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandLogo from '../../components/BrandLogo'
import './CreateFoodPartner.css'

const readApiResponse = async (response) => {
  const responseText = await response.text()

  if (!responseText) {
    return {}
  }

  try {
    return JSON.parse(responseText)
  } catch {
    throw new Error(
      `The server returned an unexpected response (HTTP ${response.status}). Check that the backend API is running at http://localhost:3000.`,
    )
  }
}

const CreateFoodPartner = () => {
  const navigate = useNavigate()
  const previewUrlRef = useRef('')
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
      }
    }
  }, [])

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0] || null
    setError('')

    if (file && !file.type.startsWith('video/')) {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
        previewUrlRef.current = ''
      }

      setVideoFile(null)
      setVideoPreview('')
      event.target.value = ''
      setError('Choose a video file to create your reel.')
      return
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
    }

    previewUrlRef.current = file ? URL.createObjectURL(file) : ''
    setVideoPreview(previewUrlRef.current)
    setVideoFile(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!videoFile) {
      setError('Choose a video before publishing your reel.')
      return
    }

    const formData = new FormData(event.currentTarget)
    formData.set('video', videoFile)

    setIsSubmitting(true)

    try {
      const response = await fetch('http://localhost:3000/api/food', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const data = await readApiResponse(response)

      if (!response.ok) {
        throw new Error(data.message || 'Unable to publish your reel.')
      }

      if (!data.food?._id) {
        throw new Error('The reel was submitted, but the response was invalid.')
      }

      navigate('/food-partner/profile')
    } catch (requestError) {
      console.error('Unable to create food reel', requestError)
      setError(requestError.message || 'Unable to connect to the server. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="create-reel-page">
      <header className="create-reel-header">
        <BrandLogo className="biteloop-brand--create" />
        <Link className="create-reel-back" to="/food-partner/profile">← Back to profile</Link>
      </header>

      <section className="create-reel-layout" aria-labelledby="create-reel-title">
        <div className="create-reel-intro">
          <span className="create-reel-eyebrow">YOUR NEXT SPECIAL</span>
          <h1 id="create-reel-title">Add a reel</h1>
          <p>Show off your signature dish and give hungry people a reason to stop scrolling.</p>
        </div>

        <form className="create-reel-form" onSubmit={handleSubmit}>
          <div className="create-reel-form__heading">
            <div>
              <span className="create-reel-eyebrow">NEW POST</span>
              <h2>Tell us what’s cooking</h2>
            </div>
            <span className="create-reel-form__badge" aria-hidden="true">▶</span>
          </div>

          <label className="create-reel-field">
            <span>Dish name <span aria-hidden="true">*</span></span>
            <input
              type="text"
              name="name"
              placeholder="e.g. Our famous truffle pizza"
              maxLength={100}
              required
            />
          </label>

          <label className="create-reel-field">
            <span>Description <span className="create-reel-field__optional">Optional</span></span>
            <textarea
              name="description"
              placeholder="What makes this dish special?"
              rows="3"
              maxLength={500}
            />
          </label>

          <div className="create-reel-field">
            <span>Video <span aria-hidden="true">*</span></span>
            <label className={videoFile ? 'create-reel-uploader has-video' : 'create-reel-uploader'}>
              {videoPreview ? (
                <video src={videoPreview} muted playsInline controls />
              ) : (
                <span className="create-reel-uploader__placeholder">
                  <span className="create-reel-uploader__icon" aria-hidden="true">↑</span>
                  <strong>Choose a video to upload</strong>
                  <span>Bring your dish to life in a reel</span>
                </span>
              )}
              <input
                type="file"
                name="video"
                accept="video/*"
                onChange={handleVideoChange}
                required
              />
            </label>
            <span className="create-reel-hint">Select a video from your device. The video is uploaded when you publish.</span>
          </div>

          {error && <p className="create-reel-error" role="alert">{error}</p>}

          <div className="create-reel-form__actions">
            <Link className="create-reel-cancel" to="/food-partner/profile">Cancel</Link>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Publishing…' : 'Publish reel'}
              {!isSubmitting && <span aria-hidden="true">↗</span>}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default CreateFoodPartner
