import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ChooseRegister from '../pages/auth/ChooseRegister'
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin'
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister'
import UserLogin from '../pages/auth/UserLogin'
import UserRegister from '../pages/auth/UserRegister'
import Home from '../pages/general/Home'
import FoodPartnerStore from '../pages/general/FoodPartnerStore'
import CreateFoodPartner from '../pages/food-partner/CreateFoodPartner'
import Profile from '../pages/food-partner/Profile'

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                
                <Route path="/register" element={<ChooseRegister />} />
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
                <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
                <Route path="/food-partner/profile" element={<Profile />} />
                <Route path="/food-partner/:foodPartnerId" element={<FoodPartnerStore />} />
                <Route path="/" element={<Home />} /> 
                <Route path="/create-food" element={<CreateFoodPartner />} /> 
            </Routes>
        </Router>
    )
}

export default AppRoutes