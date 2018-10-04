# TinyApp Project
A simple node server that allows users to register for an account and shorten long urls into short ones. Each registered user is only allowed to modify their URLs, but your shortened URLs are available for anyone!

## Overview

!["View all your shortened urls in one place!"](https://github.com/louisriehl/tinyApp/blob/master/views/media/homepage.png?raw=true)
!["View the stats of your URL for analytics, and edit the link it goes to!"](https://github.com/louisriehl/tinyApp/blob/master/views/media/editpage.png?raw=true)

## Learning Outcomes
- How to handle requests using Express
- How to integrate javascript into html with EJS
- How to securely store user passwords and cookies using hashing and encryption
- How to use POST and GET requests to update server-side information
- How to more effectively use objects and arrays of objects
- How to use ES6 syntax

## Dependencies
- Node.js
- Yarn
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Get Started
- Be sure to install all dependencies using the `yarn install` command
- From the project directory, run `node express_server.js`