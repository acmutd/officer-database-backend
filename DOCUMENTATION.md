# Documentation
## CRUD Operations
The project is split into GET, POST, PUT, and DELETE operations

#### GET
There are two routes for reading the officer database
- `GET /officers`, which returns all officers in the database
- `GET /officers/{id}`, which returns the data for a single officer in the officer database given the UID of the officer

#### POST
There is one route for creating information in the database
- `POST /officers`, which creates a new officer entry with a randomized UID. It requires all required fields to be filled out with social links being the only optional field. A JSON payload is **required** for this route, with an example payload below.

#### DELETE
There is one route for deleting information in the database
- `DELETE /officers/{id}`, which deletes the officer entry from the database given the UID of the officer

#### PATCH
There is one route for updating information in the database
- `PATCH /officers/{id}`
This route is unique in the way that it doesn't require a fixed data entry like all other routes

The only fields you need to include in the payload are the fields you need to update. For example, if my profile is currently this:

```json
// GET /officer/74NmI3q8UfclXQKMbZmp
{
  "UID": "74NmI3q8UfclXQKMbZmp",
  "firstName": "Jeydin",
  "lastName": "Pham",
  "netId": "DAL489430",
  "isActive": true,
  "standing": "Freshman",
  "accessLevel": 2,
  "joinDate": {
    "term": "Fall",
    "year": 2025
  },
  "expectedGrad": {
    "term": "Spring",
    "year": 2029
  },
  "roles": [
    {
      "title": "ACM Core Officer",
      "division": "Development",
      "level": 1,
      "startDate": {
        "term": "Fall",
        "year": 2025,
      },
      "endDate": null,
    }
  ],
  "socialLinks": {
    "github": "https://github.com/jeydinpham",
    "linkedin": "https://www.linkedin.com/in/jeydinpham/",
    "personalEmail": "jeydinpham@gmail.com"
  },
}
```
and I wanted to edit my first name, my lastname, and my access level, all I would include in the payload is:
```json
// PATCH /officer/74NmI3q8UfclXQKMbZmp
{
  "firstName": "Bobby",
  "lastName": "Balls",
  "accessLevel": 2,
}
```

**However**, any objects in the officer data, like the dates and roles, **those need all fields to be updated with it**

If you wanted to edit the role information in the data above, you would send the entire roles array like this:

```json
// PATCH /officer/74NmI3q8UfclXQKMbZmp
{
  "roles": [
    // Here, we're adding a new officer role to my roles array, which means that I would be an officer of two divisions at once
    {
      "title": "ACM Events Officer",
      "division": "Community",
      "level": 1,
      "startDate": {
        "term": "Spring",
        "year": 2026
      },
      "endDate": null, // If endDate is null, the officer is still working in that role
    },
    {
      "title": "ACM Core Officer",
      "division": "Development",
      "level": 1,
      "startDate": {
        "term": "Fall",
        "year": 2025,
      },
      "endDate": null,
    }
  ]
}
```