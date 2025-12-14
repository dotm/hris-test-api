# Notes

How to Run in Local: yarn start:dev

## New Attendance Module

- npx nest g resource attendance
  - Transport layer: REST API
  - CRUD endpoints: Yes
- move the generated directory into src/modules
  - also update import in src/app.module.ts
- adapt to existing code style

## Local Setup Steps

- git init
- yarn install
- create local DB
- ignore env files (see git commit)
- add and fill .env.local file
  - update nestserver Postman variable to http://localhost:8080/api/v1
  - point to local DB
- cp .env.local .env
- yarn start:dev
- fix ERROR DataSource is not set for this entity (see git commit)
- fix ERROR No metadata for "Staff" was found (see git commit)
- seed superadmin user manually
  - add this in staff.controller.ts:
    - import { Public } from 'src/decorators/public.decorator';
    - add @Public temporarily to @Post() async create
  - Hit the create staff API to add:
    - email: superadmin@yopmail.com
    - pass: apaajaboleh
  - undo changes in staff.controller.ts (remove @Public)
- seed other users:
  - in Postman, hit auth/login with superadmin credential
  - copy the accessToken from the response
  - hit the POST staff using Bearer Token:
    - click on the POST request
    - Click Authorization (on the right of Params)
    - select Bearer Token as Auth Type
    - paste the token from login response
    - click Send (blue button)
- all endpoints can be tested in Postman using the same method as seeding other users above

## First Deployment Steps

Create EC2 Instance:

- Name: HRIS Coding Test
- Quick Start: Ubuntu Server 24.04 LTS 64-bit
- Instance type: t2.micro
- Create new key pair: hris-test-ec2-key-pair.pem
- Create security group
  - Allow SSH, HTTPS, HTTP traffic from Anywhere
- 8 GiB gp3
- Number of instances: 1
- Finally, click Launch instance
- Connect to the instance using SSH
  - https://ap-southeast-1.console.aws.amazon.com/ec2/home?region=ap-southeast-1#InstanceDetails:instanceId=i-0d4ce406558ef990f
  - ssh -i "hris-test-ec2-key-pair.pem" ubuntu@ec2-13-229-208-46.ap-southeast-1.compute.amazonaws.com

Local Docker Build:

- Make sure Docker is running in host
- docker build -f Dockerfile.build_base -t hris-base .
- Manual verification:
  - docker run -it -p 3000:3000 hris-base bash
  - node -v
    - use this as NODE_VERSION in Dockerfile.release
  - nvm current
  - npm -v
  - exit
- Fill .env.production with environment variables
- docker build -f Dockerfile.release -t hris-release .
- Optional step: docker run -it -p 3000:3000 hris-release bash
  - Do this only if you want to test the release in local
- docker create --name hris-tar hris-release
- From host (if you haven't): mkdir tar-release
  - also add this directory to .gitignore
- docker cp hris-tar:/root/hris/hris.tar.gz ./tar-release/hris.tar.gz
- docker rm hris-tar

Setup instance:

- sudo apt update
- sudo apt install nodejs npm -y
- node -v
- npm -v
- sudo apt remove nginx -y
- mkdir backend

Upload build:
- scp -i "hris-test-ec2-key-pair.pem" ./tar-release/hris.tar.gz ubuntu@ec2-13-229-208-46.ap-southeast-1.compute.amazonaws.com:~/backend
- scp -i "hris-test-ec2-key-pair.pem" ./package.json ubuntu@ec2-13-229-208-46.ap-southeast-1.compute.amazonaws.com:~/backend
- scp -i "hris-test-ec2-key-pair.pem" ./.env.production ubuntu@ec2-13-229-208-46.ap-southeast-1.compute.amazonaws.com:~/backend/.env
- ssh -i "hris-test-ec2-key-pair.pem" ubuntu@ec2-13-229-208-46.ap-southeast-1.compute.amazonaws.com
  - cd ~/backend
  - tar -xzvf hris.tar.gz

Create Local Database in Production Server Instance:
- sudo apt install -y postgresql postgresql-contrib
- psql --version
- sudo systemctl status postgresql
  - sudo systemctl start postgresql
  - sudo systemctl enable postgresql
- Connect to production database: sudo -i -u postgres
  - psql
    - CREATE DATABASE hris;
    - ALTER USER postgres WITH PASSWORD 'insert_password';
    - exit
  - exit
- Update the .env.production
- After starting pm2, connect to production database and seed users data:
  - psql -h localhost -U postgres -d hris
```sql
INSERT INTO staff (id,staff_id,first_name,last_name,email,password_hash,access_token,username) VALUES
  ('1a6fcae9-21f8-4c6d-b28f-30e7879ea704','awikwok','Ichsan','Natawijaya','icanx@hotmail.com','$2b$10$fvOmDpMbuaUMWkEzhtZwueB9qPauF9jCY7jx4ykiQ3GD/QHOJPfIO','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFhNmZjYWU5LTIxZjgtNGM2ZC1iMjhmLTMwZTc4NzllYTcwNCIsInR5cGUiOiJBQ0NFU1NfVE9LRU4iLCJpYXQiOjE3NjU2ODI2NzcsImV4cCI6MTc2NTc2OTA3N30.IIpBBbBGKwPr5kWQ1828RV7a4BcLBtNpq76-v-v4boY','icanq'),
  ('09c58ddf-d3bf-4b95-9fa4-037292fa8244','su','Super','Admin','superadmin@yopmail.com','$2b$10$0ncUVVcilW3PkDXZ4iui3.dNCS1gwexl3rvlPyK3aQUHW56bmOFYO','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5YzU4ZGRmLWQzYmYtNGI5NS05ZmE0LTAzNzI5MmZhODI0NCIsInR5cGUiOiJBQ0NFU1NfVE9LRU4iLCJpYXQiOjE3NjU2ODI5OTcsImV4cCI6MTc2NTc2OTM5N30.jn88m8zqWTJ8PwdA2mJMZAR37kk3RtMwoNR2TdCvYJ0','superadmin');
```

Serve:

- sudo npm install -g serve
- sudo npm install -g pm2
- cd ~/backend
- npx yarn install --production
- sudo pm2 start dist/main.js --name hris-api
  - sudo pm2 logs hris-api
  - sudo pm2 kill
- Seed user data (see above)
- Test login using Postman

# Kotakodelab Full-Stack / Backend homework (TypeScript, REST API)

Welcome to the Kotakodelab work sample for Full-Stack developers (TypeScript & NestJS)! This is our way to get some experience working with you and to gauge your skill in using TypeScript and the databases. There is no official time-limit for this exercise, but you should finish it within a week. We encourqage you to take the time you need in order to **provide quality work that best reflects your skills**

## Context

We have implemented basic backend service written in TypeScript also implemented TypeORM as the ORM to create Staffs. Currently, we would like to extend the service, so we need to track the **staffs attendance** by creating Clock in & Clock out features.

## Data Models & Relationships

The `Staffs` has fields: `id`, `staffId`, `username`, `firstName`, `lastName`, `email`, `passwordHash`

we still don't have Model for the `Attendance` so here is your task to add the model for the **Attendance**, it's up to you to name the Model but please give a name that fits. and also please add the relation between `Staffs` and the **Attendance**

## Technical Requirements

You have to use `TypeScript >4.0`. A relational database like SQLite, MySQL or Postgres is probably a good idea as well.
Regarding an ORM and SQL query builder you should use `TypeORM`. For testing we recommend to use `jest` but feel free
to use a different test framework if needed.

## Final Notes

When running the service with `yarn start:dev` and if you implements the test unit or e2e test is a big plus!

Also, please take a look at the provided `scripts` in `package.json` as they might give you some more ideas about that
is expected.

Some documentation and good unit tests will be much appreciated. Please make sure to apply common design patterns and
best practices like you would do for any of your professional projects.

Are you usually using additional tools in your projects? We can’t wait to hear about your best practices and why you
think it's important to use them! Please provide your best practices in the questionnaire when submitting your project.

## Encouragement

Kotakodelab team members have worked through this work sample to make sure we are not asking for too much of your time.
This shouldn't take you longer than a couple of hours depending on your knowledge and the bells and whistles you want
to add. We are looking forward to hearing from you!

## Requirements Checklist

- [x] Should be able to create Staff
- [x] Should be able to update Staff
- [x] Staff should be able to login
- [x] Staff should be able to logout
- [ ] Staff should not be able to update another staff dat
- [ ] Staff should be able to clock in
- [ ] Staff should be able to clock out
