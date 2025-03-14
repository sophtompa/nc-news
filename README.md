# NC News Seeding

## Project Summary:

#### This project showcases the backend of a Node.js news app, which uses PostgreSQL to send/retrieve data from the database. 
#### Features include the ability to search for users and articles, to post/delete comments on articles, and to update articles.
#### Link to hosted the version: https://sophtompa-nc-news.onrender.com

## Setup Instructions

### Clone the repo
Firstly, clone the repo to your device, using the command ```git clone```.

### Setup the database
To set up and seed the database, run the command ```npm run setup-dbs```, followed by ```npm run seed-dev```.
To run the seed in the production environment, run the command ```npm run seed-prod```.

### Setup .env
Create a file named '.env.dev'.
Populate this with the ENV variable 'PGDATABASE=nc_news'.

Create a file named '.env.test'.
Populate this with the ENV variable 'PGDATABASE=nc_news_test'.

Include ALL .env files in .gitignore.

## Required Installations

#### Testing: 
For testing purposes, 'jest' and 'supertest' should be installed as dev dependencies with the command ```npm i -D jest```, and ```npm i -D supertest```.

#### Other:
The project also requires the installation of 'dotenv', 'express', 'pg', and 'pgformat', using ```npm i (installation-name)```

#### Minimum Required Versions:

Minimum Versions required:
Node: v23.6.1
Postgress: v16.8