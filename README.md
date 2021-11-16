# mosaic-tht
Take home test for mosaic interview

## Setup instructions:
1. Clone the repository
2. run the docker command `docker run --name mosaicdb -e MYSQL_USER=user -e MYSQL_PASSWORD=password -e MYSQL_DATABASE=mosaic-api -e MYSQL_RANDOM_ROOT_PASSWORD=yes -p 3306:3306 -d docker.io/library/mariadb:latest`. This initializes the database in a container
2. Navigate to the root directory of the repository
3. Run the command `npm run start`. The console will output the port the API is listening on (should be 2600).
4. Search routes are accesible from `GET localhost:2600/api/search/name/:name/:page?`, `GET localhost:2600/api/search/description/:description/:page?`, or `localhost:2600/api/seach/name/:name/description/:description/:page?`.
  Where `:[name, description]` are url encoded query string parameters. `page` is an optional parameter, which is a single number, 1 indexed.
  The API will return all results if you do not include the page parameter. If you do include page parameter, it will include the results numbered (page-1)*10 - (page*10) results.
  E.g. page = 2 will return results 10 - 19., page = 100 will return results 990-999. If there are no results in the requested page, the api will return an empty array.

5. Patch route `PATCH localhost:2600/api/update/:id` (for updating projects) is partially implemented, but all it does is print out the request body.

## Addendum:
I really struggled to import the json file into the database. I chose to use the SQL library that I use on my current job, which I'm quite familiar with. 
The problem was that at my work, the databases already exist, so it is straightforward to connect to them, perform migrations, queries, etc. In this scenario,
I needed to connect to a database server, create a database, and then run migrations and seeds. I was unable to connect to the DB server without having first created
the database. Unfortunately I spent 1 hour trying to solve this issue, so when I finally gave up and decided to just hold the whole JSON file in memory, I wasn't able
to flesh out the features to the quality I'd be comfortable with. If I had to do this test again, I would probably write a script that converts the JSON file into SQL Insert Statements, and then run a postgreSQL database server in a docker container. My database library could then connect to the running server, and execute the prepared Insert Statements, prefaced by `CREATE DATABASE mosaic-api; USE mosaic-api;`. Once this was done, I would have much more time to create the routes themselves.

## Scaling:
If I planned to scale this up to serve thousands of users, I would first resolve this DB issue and actually use a SQL database. I would then use a SQL connection pool
to connect to the database, and a simple queue service such as AWS SQS to handle each request to the api, so that the API could process and respond to a surge in 
requests, and then dispatch them to the API at the speed that the API can handle them. I would also implement a REDIS cache in order to cache frequently requested data.
For example, I imagine a frequent request would be searching all projects that contain "New York" or "Brooklyn" or other city names in the description field. A redis cache
could be configured to return the relevant fields based on city names.
