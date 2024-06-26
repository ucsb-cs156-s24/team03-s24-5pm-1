import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

import UCSBRecommendationRequestsIndexPage from "main/pages/UCSBRecommendationRequests/UCSBRecommendationRequestsIndexPage";
import UCSBRecommendationRequestsCreatePage from "main/pages/UCSBRecommendationRequests/UCSBRecommendationRequestsCreatePage";
import UCSBRecommendationRequestsEditPage from "main/pages/UCSBRecommendationRequests/UCSBRecommendationRequestsEditPage";

import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";

import ArticlesIndexPage from "main/pages/Articles/ArticlesIndexPage";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import PlaceholderIndexPage from "main/pages/Placeholder/PlaceholderIndexPage";
import PlaceholderCreatePage from "main/pages/Placeholder/PlaceholderCreatePage";
import PlaceholderEditPage from "main/pages/Placeholder/PlaceholderEditPage";

import MenuItemReviewsIndexPage from "main/pages/MenuItemReviews/MenuItemReviewsIndexPage";
import MenuItemReviewsCreatePage from "main/pages/MenuItemReviews/MenuItemReviewsCreatePage";
import MenuItemReviewsEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";

import HelpRequestsIndexPage from "main/pages/HelpRequests/HelpRequestsIndexPage";
import HelpRequestsCreatePage from "main/pages/HelpRequests/HelpRequestsCreatePage";
import HelpRequestsEditPage from "main/pages/HelpRequests/HelpRequestsEditPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";

function App() {
  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbdates" element={<UCSBDatesIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
              <Route exact path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/restaurants" element={<RestaurantIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/restaurants/edit/:id" element={<RestaurantEditPage />} />
              <Route exact path="/restaurants/create" element={<RestaurantCreatePage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/articles" element={<ArticlesIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/articles/edit/:id" element={<ArticlesEditPage />} />
              <Route exact path="/articles/create" element={<ArticlesCreatePage />} />
            </>
          )
        }
         {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/placeholder" element={<PlaceholderIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/placeholder/edit/:id" element={<PlaceholderEditPage />} />
              <Route exact path="/placeholder/create" element={<PlaceholderCreatePage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
         
              <Route exact path="/ucsbrecommendationrequests" element={<UCSBRecommendationRequestsIndexPage />} />
=======
              <Route exact path="/menuitemreviews" element={<MenuItemReviewsIndexPage />} />
                
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>

              <Route exact path="/ucsbrecommendationrequests/edit/:id" element={<UCSBRecommendationRequestsEditPage />} />
              <Route exact path="/ucsbrecommendationrequests/create" element={<UCSBRecommendationRequestsCreatePage />} />
=======
              <Route exact path="/menuitemreviews/edit/:id" element={<MenuItemReviewsEditPage />} />
              <Route exact path="/menuitemreviews/create" element={<MenuItemReviewsCreatePage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/helprequests" element={<HelpRequestsIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/helprequests/edit/:id" element={<HelpRequestsEditPage />} />
              <Route exact path="/helprequests/create" element={<HelpRequestsCreatePage />} />

            </>
          )
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
