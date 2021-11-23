# mosaic-tht
This project uses Express.js, MySQL with Sequelize ORM, and jest for testing. The database server runs in a docker container. It supports importing a dataset from a json file, and then the api can search, filter, and update data from that dataset.. The test suite currently tests a previous version of the API, written before I added Sequelize ORM to the project. 

## Setup instructions:
1. Clone the repository
2. run the docker command `docker run --name mosaicdb -e MYSQL_USER=user -e MYSQL_PASSWORD=password -e MYSQL_DATABASE=mosaic-api -e MYSQL_RANDOM_ROOT_PASSWORD=yes -p 3306:3306 -d docker.io/library/mariadb:10.2`. This initializes the database in a container.
2. Navigate to the root directory of the repository
3. Run the command `npm run seeds`. This will set up the database tables and insert everything in the file `/src/utility/dataset.json` into the database. If you want to add a custom file with the same structure, you can place it in the same directory, and edit the `.env` file with the environment variable `JSON_FILENAME` to be whatever your data file is.
3. Run the command `npm run start`. The console will output the port the API is listening on (should be 2600).
4. Search is accessible from `GET localhost:2600/search/?query=[QUERY]&filters[FILTER_ATTRIBUTE][FILTER_OPERAND]=[NUMBER|DATE]&page=[NUMBER]`
  Where:
  * `[QUERY]` is a query string (remove the [] for all query params). ONLY REQUIRED PARAMETER.
  * `[FILTER_ATTRIBUTE]` is one of `actualStartDate`, `plannedEndDate`, `actualEndDate`, `budgetAmount`, `phaseCostEstimate`, `phaseCostActual`
  * `[FILTER_OPERAND]` is:
    * `lt` (less than), `gt` (greater than), `eq` (equals) for `FILTER_ATTRIBUTE` = `budgetAmount`, `phaseCostEstimate`, `phaseCostActual`
    * `before`, `after`, `equals` for `FILTER_ATTRIBUTE` = `actualStartDate`, `plannedEndDate`, `actualEndDate`.
  * `[NUMBER]` is a number
  * `[DATE]` is a date string of the format `MM/DD/YYYY`.

  You can include as many filters as you want following the same structure (JSON encoded URL query parameters).
  
  The API returns pages of 3, offset by the number of the `page` parameter. If there are fewer records found than `(page-1)*3`, the API will return an empty array.

5. Update is accessible from `PATCH localhost:2600/update`. The request body should be JSON-encoded as follows:
```
{
  "id": [NUMBER]
  "actualStartDate": [DATE],
  "phaseCostActual": [NUMBER]
}
```
You must include a valid ID, and at least one of the other two parameters for the update to be valid. If it isn't valid, it will return a 400 error. If it is valid, it will return a JSON object with the old record and the updated record.
## Scaling:
If I planned to scale this up to serve thousands of users I would do the following:
* Since my API is stateless, I'd put it inside a container and run it with kubernetes or some other orchestration tool. As the API got larger and larger, I would break off parts of it to run in other containers in a microservices architecture.
* I would also write the API documentation in OpenAPI in order to standardize and simply its use
* I would implement a REDIS cache for the`search` requests. The keys 
requests, and then dispatch them to the API at the speed that the API can handle them. I would also implement a REDIS cache in order to cache frequently requested data.
For example, I imagine a frequent request would be searching all projects that contain "New York" or "Brooklyn" or other city names in the description field. A redis cache
could be configured to return the relevant fields based on city names. I might also use a tool like Cockroach DB to implement intelligent DB scaling. I would also flesh out the tests so that they actually test the project (I'd probably do this first).
