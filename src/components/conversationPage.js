import React, { Component } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import '../App.css';
import GoogleLogin from 'react-google-login';
import firebase from '../firebase.js';
import Beach from "./images/beach.jpg";
import Song from './music/Lazy_Song.mp3';
import createHistory from 'history/createBrowserHistory';
import axios from "axios";
import spoken from '../../node_modules/spoken/build/spoken.js';



class ConversationPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      play: false,
      name: "",
      firebase: [],
      messageToFirebase: "",
      messageFromFirebase: "",
      weather: [],
      login: false,
    };
    this.url = "http://stream-uk1.radioparadise.com/mp3-128";
    this.audio = new Audio(Song);
    this.togglePlay = this.togglePlay.bind(this);
  }

  login = () => {

    if(this.state.login) {
      return(

        <p>Regina</p>

      )
    } else {
      return(<p>Regina</p>)
    }
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount() {

      this.getWeather('San Francisco');
      this.getMessage();
      this.printChat();

  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  printWeather2 = (kelvinToFahrenheit) => {
    let weather = [];

    return(this.state.weather.map(element =>

         <div className="weatherBox" key={element.dt_txt}>
             <Row className="show-grid">
               <Col md={6} mdPush={6}>
                  {kelvinToFahrenheit(element.main.temp)}
               </Col>
               <Col md={6} mdPull={6}>

                  <strong>{element.dt_txt}</strong>
               </Col>
              </Row>

         </div>

       )
     )
  }

  togglePlay() {
      this.setState({ play: !this.state.play });
      console.log(this.audio);
      this.state.play ? this.audio.pause() : this.audio.play();

  }

  getWeather = async(city) => {
    let arr = [];
    const weatherURL = process.env.weatherURL;

    try {
      const response = await axios.get('http://api.openweathermap.org/data/2.5/forecast?q=' + city + process.env.clientId);

      console.log(response.data.list);

      arr.push(response.data);

      localStorage.setItem("weatherInfo", response.data.list);

      this.setState({weather: response.data.list});

    } catch (error) {
      console.error(error);
    }

    return arr;
  }


  printChat = () => {
    const color = ['red', 'blue', 'green', 'orange', 'pink']

    let chatNameStyle = {
      color: color[Math.floor(Math.random() * 5)],
    };

    let arr = [];

    let data = this.state.firebase

    for(let i = data.length - 1; i >= 0; i -= 2) {
      let currentElement = data[i];

      arr.unshift(
        <p key={i} >
          <strong className="chatName" style={chatNameStyle}>{currentElement}</strong>: {data[i - 1] + this.state.messageFromFirebase}
        </p>)
    }

    return arr;
  }

  handleInputChange = event => {
    const value = event.target.value;
    this.setState({
      messageToFirebase: value,
    });
  };

  getMessage = () => {
    const itemsRef = firebase.database().ref('items');

    itemsRef.on('value', (snapshot) => {

      let obj = snapshot.val();
      let arr = []

      for(let key in obj) {

          let name = (obj[key].name);
          let subject = obj[key].subject;

          arr.push(subject);
          arr.push(name);

        }
      localStorage.setItem("firebase", arr.join("\n"))
      this.setState({firebase: arr})
    });


  }

  handleSubmit = (event) => {
    event.preventDefault();

    const itemsRef = firebase.database().ref('items');

    const item = {
      name: localStorage.getItem("name"),
      subject: this.state.messageToFirebase,
    }

    itemsRef.push(item);

    itemsRef.on('value', (snapshot) => {
      let obj = snapshot.val();
      let arr = []

      for(let key in obj) {
          // console.log(obj[key]);

          let name = (obj[key].name);
          let subject = obj[key].subject;
          // console.log(elements);

          arr.push(subject);
          arr.push(name);

        }

      localStorage.setItem("firebase", arr.join("\n"))
      this.setState({firebase: arr})
    });

    this.setState({messageToFirebase: ""})

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


   render() {
      const playerStyle = {
         width: '376px',
         height: '253px',
      }

      const history = createHistory();

      const kelvinToFahrenheit = require('kelvin-to-fahrenheit');

      const responseGoogle = (response) => {

        if(response.hasOwnProperty("error")) {
          console.log("not login");
          history.push('/secondPage', { page: 'secondPage' });

          setTimeout(function() { window.location.reload(); }, 1000);

        } else {

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
         <div className="ConversationPage">

         <Row className="show-grid">

           <Col className="weatherCol" xs={6} md={4}>





              <Image className="BeachImage" src={Beach} /><p></p>

              <div className="printChat" >

                 {this.printChat()}

                 <div style={{ float:"left", clear: "both" }}
                      ref={(el) => { this.messagesEnd = el; }}>

                 </div>


              </div>

              <form className="formMessage">
                  <label>
                  <input
                     className="inputMessage"
                     type="text"
                     placeholder="Write a message..."
                     name="message"
                     id="message"
                     // value={this.state.value}
                     value={this.state.messageToFirebase}
                     onChange={this.handleInputChange}
                  />
                  </label>
                  <input type="submit" onClick={(e) => this.handleSubmit(e)} value="Send" />
                </form>


                 <p>Bruno Mar - Lazy Song</p>
                <button onClick={this.togglePlay}>{this.state.play ? 'Pause' : 'Play'}</button><p></p>


           </Col>



           <Col className="messageCol" xsHidden md={4}>

               <p>San Francisco - 5 days weather forecast</p>

               <Row className="show-grid">
                 <Col md={6} mdPush={6}>

                    <strong>Temperature ℉</strong>
                 </Col>
                 <Col md={6} mdPull={6}>
                    <strong>Date/Time</strong>

                 </Col>
                </Row>


               {this.printWeather2(kelvinToFahrenheit)}
              <h1>Weather 2</h1>


           </Col>
          </Row>


         </div>
      );
   }
}



export default ConversationPage;
