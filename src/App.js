import React, { Component } from 'react';
import './App.css';
import { Navbar, Col, DropdownButton, MenuItem, Image } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SecondPage from './components/secondPage.js';
import Home from './components/home.js';
import ChatPage from './components/chatPage.js';
import ConversationPage from './components/conversationPage.js';
import GoogleLogin from 'react-google-login';
import GoogleLogout from 'react-google-login';
import createHistory from 'history/createBrowserHistory';
import { Persist } from 'react-persist';
import firebase from './firebase.js';
import AnalysticPage from './components/analysticPage.js';
import SettingPage from './components/settingPage.js';
import Phone from './components/images/phone32.png';
import Analystics from './components/images/pie32.png';
import Setting from './components/images/settings32.png';
import axios from "axios";
import LoginButton from './components/login.js';



class App extends Component {

  state = {
    login: false,
    name: "",
    accessToken: "",
    imageUrl: "",
    firebase: [],
    message: "",
  }

  componentDidMount() {
    localStorage.setItem("login", this.state.login);
    this.getWeather('Oakland');
  }

  getWeather = async(city) => {
    let arr = [];

    try {
      const response = await axios.get('http://api.openweathermap.org/data/2.5/forecast?q=' + city + process.env.REACT_APP_API_KEY_WEATHER);
      console.log('get weather at app.js');
      console.log(response.data.list);
    } catch (error) {
      console.error(error);
    }


  }

  goToAnalystic = (e, history) => {
    e.preventDefault();
    history.push('/analysticPage', { page: 'analysticPage' });

    setTimeout(function() { window.location.reload(); }, 1000);
  }

  goToSetting = (e, history) => {
    e.preventDefault();
    history.push('/settingPage', { page: 'settingPage' });

    setTimeout(function() { window.location.reload(); }, 1000);
  }

  goToConversation = (e, history) => {
    e.preventDefault();
    history.push('/conversationPage', { page: 'conversationPage' });

    setTimeout(function() { window.location.reload(); }, 1000);
  }


  printChat = () => {
    let arr = [];

    let data = this.state.firebase

    for(let i = data.length - 1; i >= 0; i -= 2) {
      let currentElement = data[i];

      arr.push(
        <p key={i}>
          <strong>{currentElement}</strong>: {data[i - 1] + this.state.message}
        </p>)
      // arr.push(<p></p>)
    }

    return arr;
  }

  handleInputChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    // console.log(name)
    // console.log(value)
    this.setState({
      [name]: value,
    });
  };

  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      name: "John",
      subject: "Testing",

    }
    itemsRef.push(item);

    // let obj2 = [];

    itemsRef.on('value', (snapshot) => {
      // console.log(snapshot.val());
      let obj = snapshot.val();
      let arr = []

      // console.log(obj);

      for(let key in obj) {
          // console.log(obj[key].subject);

          let name = (obj[key].name);
          let subject = obj[key].subject;
          // console.log(elements);

          arr.push(subject);
          arr.push(name);

        }
      // console.log(arr);
      localStorage.setItem("firebase", arr.join("\n"))
      this.setState({firebase: arr})
    });
    console.log("------------------")
    console.log(this.state.firebase);

    // this.printChat(obj2);

    // console.log(this.state.firebase);
  }

  loginSideNav = (history) => {
    let sideNav = [];

    if(this.state.login) {
        sideNav.push(
          <div key={1}>
          <Col key={9} className="phoneCol" xs={6} md={4}>

            <Image className="phone" onClick={(event) => this.goToConversation(event, history)} src={Phone} /><p></p>
            <Image className="analystic" onClick={(event) => this.goToAnalystic(event, history)} src={Analystics} /><p></p>
            <Image className="setting" onClick={(event) => this.goToSetting(event, history)} src={Setting} /><p></p>

          </Col>


          </div>
        )
      }

      return sideNav;
  }

  loginButton = () => {
    const history = createHistory();
    const responseGoogle = (response) => {

      if(response.hasOwnProperty("error")) {
        console.log("not login");
        history.push('/secondPage', { page: 'secondPage' });

        setTimeout(function() { window.location.reload(); }, 1000);

      } else if(response.Zi.access_token) {
        // console.log("login");
        this.setState({name: response.profileObj.name, accessToken: response.Zi.access_token,
          imageUrl: response.profileObj.imageUrl, login: true});

        localStorage.setItem("name", response.profileObj.name);
        localStorage.setItem("imageUrl", response.profileObj.imageUrl);
        localStorage.setItem("state", JSON.stringify(this.state));
        localStorage.setItem("accessToken", response.Zi.access_token);


        history.push('/conversationPage', { page: 'conversationPage' });

        setTimeout(function() { window.location.reload(); }, 1000);

      }

    }
    return(
      <div>
        <GoogleLogin
          className="SignInButton"
          clientId={process.env.clientId}
          buttonText="Sign in"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
        />
      </div>
    )
  }

  loginProfile = (responseGoogle, history) => {
    let profile = [];

    if(this.state.login) {
    // if(isSignedIn === false) {
      profile.push(
        <div key={1} className="signin3">


        <DropdownButton
           className="dropdownButton"
           title={localStorage.getItem("name")}
           key={1}
           id="dropdown-size-medium"
           >
              <MenuItem eventKey="1">Action</MenuItem>
              <MenuItem onClick={(event) => this.SignOutButton(event, history)} eventKey="2">Sign out</MenuItem>
          </DropdownButton>

          <Image className="profileImg" src={this.state.imageUrl} circle />

        </div>
      )
    } else {
      profile.push(
        <div key={2} className="signin3">

        <GoogleLogin
          className="SignInButton"
          clientId=process.env.clientId
          buttonText="Sign in"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
        />
        </div>
      )
    }

    return profile;
  }

  SignOutButton = (event, history) => {
    event.preventDefault()
    this.setState({login: false});
    history.push('/', { page: 'Home' });
    setTimeout(function() { window.location.reload(); }, 1000);
  }

  render() {
    const history = createHistory();

    const responseGoogle = (response) => {

      console.log(response);

      if(response.hasOwnProperty("error")) {
        console.log("not login");
        history.push('/secondPage', { page: 'secondPage' });

        setTimeout(function() { window.location.reload(); }, 1000);

      } else {
        console.log("login");
        console.log(response);
        console.log(response.Zi.access_token);
        console.log(response.profileObj.name);
        console.log(response.profileObj.imageUrl);
        this.setState({name: response.profileObj.name, accessToken: response.Zi.access_token,
          imageUrl: response.profileObj.imageUrl, login: true});

        localStorage.setItem("name", response.profileObj.name);
        localStorage.setItem("imageUrl", response.profileObj.imageUrl);
        localStorage.setItem("state", JSON.stringify(this.state));
        localStorage.setItem("accessToken", response.Zi.access_token);


        history.push('/conversationPage', { page: 'conversationPage' });

        setTimeout(function() { window.location.reload(); }, 1000);

      }

    }

    return (
      <Router>
        <div className="App">
          <Navbar className="navBarTop">
          <Col className="logoCol" xs={12} md={8}>
            <p className="smallLogo">Regina</p>

           </Col>
           <Col xs={6} md={4}>
             <div className="loginProfile">
               {this.loginProfile(responseGoogle, history)}
               <Persist
                  name="loginProfile"
                  data={this.state}
                  debounce={500}
                  onMount={data => this.setState(data)}
                />
             </div>
           </Col>

          </Navbar>

          {this.loginSideNav(history)}

            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/conversationPage' component={ConversationPage} />
                <Route exact path='/analysticPage' component={AnalysticPage} />
                <Route exact path='/settingPage' component={SettingPage} />
                <Route exact path='/secondPage' component={ SecondPage } />
            </Switch>

        </div>

      </Router>

    );
  }
}

export default App;
