import { Link } from 'react-router-dom'
import BrandLogo from '../../components/BrandLogo'
import '../../styles/auth-shared.css'

function ChooseRegister() {
  return (
    <main className="auth-page">
      <header className="auth-header">
        <BrandLogo className="biteloop-brand--auth" />
      </header>

      <section className="register-choice" aria-labelledby="register-choice-title">
        <span className="eyebrow">WELCOME TO BITELOOP</span>
        <h1 id="register-choice-title">How would you like to join?</h1>
        <p>Choose the account that best describes you.</p>
        <div className="register-choice__options">
          <Link className="register-choice__option" to="/user/register">
            <span className="register-choice__label">For diners</span>
            <span>Discover food, save favorites, and find your next meal.</span>
            <span className="register-choice__action">Create a user account <span aria-hidden="true">→</span></span>
          </Link>
          <Link className="register-choice__option" to="/food-partner/register">
            <span className="register-choice__label">For food partners</span>
            <span>Bring your restaurant to more people and grow your business.</span>
            <span className="register-choice__action">Create a partner account <span aria-hidden="true">→</span></span>
          </Link>
        </div>
        <p className="register-choice__login">
          Already have an account? <Link to="/user/login">Sign in</Link>
        </p>
      </section>
    </main>
  )
}

export default ChooseRegister
