import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import './App.css';
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import {Provider} from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {logoutUser, setCurrentUser} from "./actions/authActions";


//check for token
if(localStorage.jwtToken){
    //set auth token header
    setAuthToken(localStorage.jwtToken);
    //decode token
    const decoded= jwt_decode(localStorage.jwtToken);
    //set current user
    store.dispatch(setCurrentUser(decoded));
    //check for expired token
    const currentTime=Date.now()/1000;
    if(decoded.exp<currentTime){
        //logout user
        //TODO: clear current profile
        //Redirect to login
        store.dispatch(logoutUser());
        window.location.href='/login';
    }
}

class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <Navbar/>
                        <Route exact path="/" component={Landing}/>
                        <div className="container">
                            <Route exact path="/register" component={Register}/>
                            <Route exact path="/login" component={Login}/>
                        </div>
                        <Footer/>
                    </div>

                </Router>
            </Provider>
        );
    }
}

export default App;
