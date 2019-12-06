import React, { Component } from 'react'
import Particles from 'react-particles-js'
import Clarifai from 'clarifai'
import Navigation from './components/navigation/Navigation'
import Logo from './components/logo/logo'
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm'
import Rank from './components/rank/Rank'
import FaceRecognition from './components/faceRecognition/FaceRecognition'
import SignIn from './components/signIn/SignIn'
import Register from './components/register/Register'
import './App.css'

const app = new Clarifai.App({
  apiKey: '11a60b04349b4a6eb792dfbd51f85382',
})

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 600,
      },
    },
  },
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
    }
  }

  calculateFaceLocation = data => {
    const face = data.outputs[0].data.regions[0].region_info.bounding_box
    const imageFace = document.getElementById('inputimage')
    const width = Number(imageFace.width)
    const height = Number(imageFace.height)
    return {
      leftCol: face.left_col * width,
      topRow: face.top_row * height,
      rightCol: width - face.right_col * width,
      bottomRow: height - face.bottom_row * height,
    }
  }

  displayFaceBox = box => {
    this.setState({ box })
  }

  onInputChange = event => {
    this.setState({ input: event.target.value })
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response =>
        this.displayFaceBox(this.calculateFaceLocation(response)),
      )
      .catch(err => console.log(err))
  }
  onRouteChange = route => {
    if (route === 'signin') {
      this.setState({ isSignedIn: false })
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route })
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={this.state.isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {this.state.route === 'home' ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              box={this.state.box}
              imageUrl={this.state.imageUrl}
            />
          </div>
        ) : this.state.route === 'signin' ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    )
  }
}

export default App
