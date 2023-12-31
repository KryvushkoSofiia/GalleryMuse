import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage"
import Reviews from "./components/Reviews";
import GalleryDetails from "./components/GalleryDetails"
import CreateNewGallery from "./components/CreateNewGallery";
import UpdateGallery from "./components/UpdateGallery";
import FavoriteGalleries from "./components/FavoriteGalleries";
import MyGalleries from "./components/MyGalleries";
import VisitedGalleries from "./components/VisitedGalleries";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path={['/', '/galleries']} component={HomePage} />
          <Route exact path="/galleries/:galleryId" component={GalleryDetails} />
          <Route exact path="/create-gallery" component={CreateNewGallery} />
          <Route exact path="/galleries/update/:galleryId" component={UpdateGallery} />
          <Route exact path="/favorite-galleries" component={FavoriteGalleries} />
          <Route exact path="/my-galleries" component={MyGalleries} />
          <Route exact path="/visited-galleries" component={VisitedGalleries} />
          <Route exact path="/reviews" component={Reviews} />
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
        </Switch>
      )}
      {/* <Footer/> */}
    </>
  );
}

export default App;
