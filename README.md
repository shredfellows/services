
# Shredfellows Backend Services

[![Build Status](https://travis-ci.com/shredfellows/services.svg?branch=staging-branch)](https://travis-ci.com/shredfellows/services)

Shred Fellows is a  living instructional platform that can be integrated into any course, providing students a means of practice, self-study, and consistent curriculum delivery for short topics. Additionally, this could power a “Try Us Out” system where potential students could interact with an experience the uniquely Code Fellows methods of instruction.
___

**HEROKU (MASTER)** [https://shred-fellows-server.herokuapp.com/](https://shred-fellows-server.herokuapp.com/)

**HEROKU (STAGING):** [https://shred-fellows-staging.herokuapp.com/](https://shred-fellows-staging.herokuapp.com/)

**TRAVIS BUILD (STAGING):** [https://travis-ci.com/shredfellows/services](https://travis-ci.com/shredfellows/services)

**GITHUB REPO (STAGING):** 
[https://github.com/shredfellows/services](https://github.com/shredfellows/services)
___

## Branches
  * [dev-branch]
  * [staging-branch]
  
___
## Table of contents
* [Overview](#overview)
* [Configuration](#configuration)
* [Routes](#routes)
	* [Server Endpoints - MongoDB/MLab](#mongo)
	* [Server Endpoints - GitHub API](#github)
	* [Server Endpoints - OAuth](#oauth)
* [Models](#models)
	* [User Model](#user-model)
	* [Profiles Model](#profiles-model)
	* [Assignment Model](#ass-model)
* [Further Work](#further-work)

___
<a id="overview"></a>
## Overview

This app uses authentication by oAuth,
This app draws from Canvas, and Githunb API's,
This app is made to streamline the workflow for students and teachers of CodeFellows.
The problem being solved is that resources required for schoolwork are wide spread.
The solution is to bring all those resources to one place.

<a id="configuration"></a>
## Configuration, Tech/Framework Used

* written in JavaScript ES6
* babel-env
* babel-eslint
* babel-register
* bcrypt
* cors
* dotenv
* eslint
* express
* jest
* jsonwebtoken
* mongoose
* morgan
* nel
* require-dir
* superagent
___
<a id="routes"></a>
## Routes

<a id="mongo"></a>
### Server Endpoints - *MongoDB/MLab*

#### ***Status*** - *Most of these routes are scaffolded out, but not yet fully integrated with mongoose commands.*


**GET** `api/v1/:model`

***Usage:*** `api/v1/assignments` could be used to show all past assignments  for all students (maybe protected route for instructional staff). 
(Question: What else could this be used for?)
___

**GET** `/api/v1/:model/:id/`

***Usage:*** `/api/v1/:model/:id` would be used to retrieve a single past assignment already submitted by a user (for study or revision). **Note:** *In this case, the `:id` is the assignment name. `:id` is a generic parameter, but doesn't need to be a number.* 

(Question: is it necessary to have `:studentId` as a route parameter as well. I think you'd get this for free from the auth middleware as req.user)
___

**POST** `/api/v1/:model`

***Usage:*** `/api/v1/:model` would be used to save/submit an assignment. It would be stored in the database for the authenticated user.
___

**PUT** `/api/v1/:model/:id`
***Usage:*** `/api/v1/:model/:id` would be used to edit an already submitted assignment.

___
<a id="github"></a>
### Server Endpoints - *GitHub API*

#### *Need to get with Ovi to see how these should look. Something like...*
**GET** `/api/v1/github/:assignments`
Gets all assignments (for public use).
(Question: Should this github related endpoints go in a separate js file/folder? )
___

**GET** `/api/v1/github/:assignments/:assignmentName`
Gets one assignments (for public use).
(Question: Should this github related endpoints go in a separate js file/folder? )

___
<a id="oauth"></a>
### Server Endpoints - *OAuth*

**GET** `/oauth`

___
<a id="models"></a>
## Models

<a id="user-model"></a>
### 1. User Model (for Authentication/Authorization)
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'profiles' }
    
<a id="profiles-model"></a>
### 2. Profiles Model
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    username: { type: mongoose.Schema.Types.String, ref: 'users'},
    email: { type: String, required: true, unique: true },
    assignments: [{type:mongoose.Schema.Types.ObjectId, ref: 'assignment'}]
    
<a id="ass-model"></a>    
### 3. Assignment Model
    courseId: {type: String},
    assignmentId: {type:Number},
    profileId: {type: mongoose.Schema.Types.ObjectId, ref:'profiles'},
    notes: {type: String},
    code: {
	    challenge: { type:String },
		 }
## Assignment Routes

### Post: post assignment '/api/v1/assignment'

- Posts an assignment to the user profile

 * Input

```
{
       "courseId": "12315",
       "assignmentId": 1231234,
       "profileId": "5b22df96cea1b400146cf65c",
       "notes": "I think this is medium.",
       "code": {"challenge1": "console.log('Challenge1')",
                "challenge2": "console.log('challenge2"}
}
```

* Output

```
{
    "_id": "5b23f4219546980014d3e39e",
    "courseId": "12315",
    "assignmentId": 1231234,
    "profileId": "5b22df96cea1b400146cf65c",
    "notes": "I think this is medium.",
    "code": {
        "challenge1": "console.log('Challenge1')",
        "challenge2": "console.log('challenge2"
    },
    "__v": 0
}
```

### Put: update note '/api/v1/assignment/note/:assignmentid'

- Updates assignment note by the user

* Input

```
{
      "courseId": "12315",
      "assignmentId": 6685863,
      "profileId": "5b22df96cea1b400146cf65c",
      > "notes": "I think this is super easy.",
      "code": {"challenge1": "let x = 2; console.log(x + x);" }
}
```

* Output

```
{
	"_id": "5b23f4219546980014d3e39e",
	"courseId": "12315",
	"assignmentId": 6685863,
	"profileId": "5b22df96cea1b400146cf65c",
	> "notes": "I think this is super easy.",
	"code": {"challenge1": "let x = 2; console.log(x + x);" }
}
```

### Put: update code '/api/v1/assignment/code/:assignmentid'

- Updates assignment code by the user

* Input

```

```

* Output

```

```

### Get: get assignment '/api/v1/model/assignment/:courseid/:studentid/:assignmentid'

- Gets a specific assignment by student ID and assignment ID


* Input

```

```

* Output

```

```
___
   
 ## User Stories  (*Do we need this section? Which ones to include?*)
 > ***1. As a user, I want a link on each Canvas assignment that re-directs me to the corresponding ShredFellows page.***

 - This link needs to pass to ShredFellows the course & assignment IDs.

> ***2. As a user, I want to be able to easily login through the Canvas OAuth utility.***

 - When the link is clicked from the Canvas assignment, it will first go through the OAuth workflow to authenticate/authorize the user. 
 - [Relevant OAuth documentation from Canvas](https://canvas.instructure.com/doc/api/file.oauth.html)

> ***3. As a user, once finished with the assignment, I want to be able to submit it back to Canvas with one click of a button.***

- This will be accomplished with a simple ajax post back to the canvas API. For example,
> ### POST /api/v1/courses/:course_id/assignments/:assignment_id/submissions

 - Submission body will be taken from REPL form field (or alternatively, as a URL for that ShredFellows page, which would require some kind of admin priviliges to view all students' pages). 
 - More info on post body and parameters can be found [here](https://canvas.instructure.com/doc/api/submissions.html).
___

<a id="futher-work"></a>
## TODO

- create front end
- increase test coverage

## Authors

Khalil Ahmned, Jen Bach, Jason Burns, Timea Heidenreich, Ben Hurst, Justin Morris, Ovin Parasca, Michael Sklepowich

## Credits

To John Cokos and Catherine Looper for the research, help and guidance

