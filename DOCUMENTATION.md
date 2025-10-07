# Documentation
## CRUD Operations
The project is split into GET, POST, PUT, and DELETE operations

#### GET
There are two functions for reading the officer database
- `GET /officers`, which returns all officers in the database
- `GET /officers/{id}`, which returns the data for a single officer in the officer database given the UID of the officer

#### POST
There is one function for creating information in the database
- `POST /officer`, which creates a new officer entry with a randomized UID. It requires all requires fields to be filled out with social links being the only optional field

#### DELETE
There is one function for deleting information in the database
- `DELETE /officer/{id}`, which deletes the officer entry from the database given the UID of the officer

#### PUT
There is function for updating information in the database
- `PUT /officer/{id}`
This function is unique in the way that it doesn't require a fixed data entry like all other functions
The only fields you need to include in the payload are the fields you need to update. For example, if my profile is currently this:
```
GET /officer/74NmI3q8UfclXQKMbZmp
```
```json
{
  "id": "74NmI3q8UfclXQKMbZmp",
  "UID": "74NmI3q8UfclXQKMbZmp",
  "firstName": "Jeydin",
  "isActive": true,
  "lastName": "Pham",
  "netId": "DAL489430",
  "socialLinks": {
    "github": "https://github.com/jeydinpham",
    "linkedin": "https://www.linkedin.com/in/jeydinpham/",
    "personalEmail": "jeydinpham@gmail.com"
  },
  "standing": "Freshman",
  "accessLevel": 2,
  "roles": [
    {
      "division": "Development",
      "endDate": null,
      "level": 1,
      "startDate": {
        "_seconds": 1754006400,
        "_nanoseconds": 0
      },
      "title": "ACM Core Officer"
    }
  ],
  "expectedGrad": {
    "term": "Spring",
    "year": 2029
  }
}
```
and I wanted to edit my first name, my lastname, and my standing, all I would include in the payload is:
```
PUT /officer/74NmI3q8UfclXQKMbZmp
```
```json
{
  "firstName": "Bobby",
  "lastName": "Balls"
  "accessLevel": 2,
}
```

The **ONLY ONLY ONLY** exception to this rule is the roles and the expected graduation date, **those need all objects to be updated with it**
If you wanted to edit the role information in the data above, you would send the entire roles array like this:
```
PUT /officer/74NmI3q8UfclXQKMbZmp
```
```json
{
  "roles": [
    {
      "division": "Education",
      "endDate": null,
      "level": 1,
      "startDate": "2025-08-01T00:00:00Z",
      "title": "ACM Education Officer"
    }
  ]
}
```

And now the data is wrong so it's time to delete myself!
```
DELETE /officer/74NmI3q8UfclXQKMbZmp
```
