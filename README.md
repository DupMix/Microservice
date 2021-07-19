<p align="center">
  <a href="http://mixdup.vercel.app/" target="_blank">
    <img src="https://mixdup.vercel.app/headphones.svg" width="110px"/>
  </a>
  <h1 align="center" style="color:#78A3AD">MixDup</h1>
</p>
  
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
<!-- 
  <a href="https://restaurant-locator-3000.herokuapp.com/">Site</a>
  · -->
  <a href="http://mixdup.vercel.app/" target="_blank">View the Site</a> ·
  <a href="https://github.com/DupMix/microservice/issues">Report Bug</a>
  ·
  <a href="https://github.com/DupMix/microservice/issues">Request Feature</a>

## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started Locally](#getting-started-locally)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project

This app serves data from a [Firebase Realtime database](https://firebase.google.com/docs/database) and the [Spotify API](https://developer.spotify.com/documentation/web-api/reference/#category-playlists) to [Mixdup](https://github.com/GreysonElkins/mixdup), a progressive web app for making weekly playlists with friends to find new music. This middleware is a temporary solution while a graphQL database is developed to replace Firebase's Realtime DB. 

The concept for Mixdup was developed by [Ruthie Rabinovitch](https://github.com/rrabinovitch) and [Noa Harnik](https://github.com/HarnikNoa)

### Built With
[Express](https://expressjs.com/)  
[Javascript](https://www.typescriptlang.org)  
[Firebase](https://firebase.google.com/)  
[Spotify API](https://developer.spotify.com/documentation/web-api/reference/#category-playlists)

<!-- GETTING STARTED Locally -->
## Getting Started Locally
### Prerequisites:
* npm: (`npm install npm@latest -g`)

### Instructions:

1. Fork the repo
2. Clone down the forked repo
3. `cd` into your local project and run `npm install`
4. You will need to add the following variables into a `.env` file in the root directory. These values can be created at the Spotify Developer dashboard and with a Firebase account. 
```
FIRE_API_KEY,
FIRE_AUTH_DOMAIN,
FIRE_DATABASE_URL,
FIRE_PROJECT_ID,
GOOGLE_APPLICATION_CREDENTIALS,
SPOTIFY_CLIENT_ID,
SPOTIFY_CLIENT_SECRET,

APP_CREDENTIALS_TYPE,
APP_CREDENTIALS_PROJECT_ID,
APP_CREDENTIALS_PRIVATE_KEY_ID,
APP_CREDENTIALS_PRIVATE_KEY,
APP_CREDENTIALS_CLIENT_EMAIL,
APP_CREDENTIALS_CLIENT_ID,
APP_CREDENTIALS_AUTH_URL,
APP_CREDENTIALS_TOKEN_URL,
APP_CREDENTIALS_AUTH_PROVIDER,
APP_CREDENTIALS_CLIENT_CERT_URL
```
4. Run the app!
```sh
npm run local
```
5. Follow the instructions in the [Mixdup Front End Repo](https://github.com/GreysonElkins/mixdup) to run the client side of the app.

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/DupMix/microservice/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request to this branch

<!-- CONTACT -->
## Contact

[Greyson Elkins](https://www.linkedin.com/in/greyson-elkins/) - greysonelkins@gmail.com  

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/DupMix/microservice.svg?style=flat-square
[contributors-url]: https://github.com/DupMix/microservice/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/DupMix/microservice.svg?style=flat-square
[forks-url]: https://github.com/DupMix/microservice/network/members
[stars-shield]: https://img.shields.io/github/stars/DupMix/microservice.svg?style=flat-square
[stars-url]: https://github.com/DupMix/microservice/stargazers
[issues-shield]: https://img.shields.io/github/issues/DupMix/microservice.svg?style=flat-square
[issues-url]: https://github.com/DupMix/microservice/issues
[license-shield]: https://img.shields.io/github/license/DupMix/microservice.svg?style=flat-square
