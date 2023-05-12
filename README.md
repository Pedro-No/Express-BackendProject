# VogueVibes

<br>

## Description

Online platform to find and create your own clothing outfits.

<br>

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to find a homepage that tells me what this app is about. 
- **sign up** - As a user I want to sign up on the web page so that I can create manage and find new outfits to add to my collection.
- **login** - As a user I want to be able to log in on the web page so that I can get back to my account.
- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account.
- **Profile** - As a user I want to go to my profile and be able to access and manage my collections (delete and edit).
- **Search bar** - As a user I want to see a list of outfits relate to what i searched.
- **Outfit look** - As a user I want to preview how the outfit could look.

<br>

## Server Routes (Back-end):

| **Method** | **Route**                          | **Description**                                              | Request  - Body                                          |
| ---------- | ---------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| `GET`      | `/`                                | Main page route.  Renders home `home` view.                 |                                                          |
| `GET`      | `/login`                           | Renders `login` form view.                                   |                                                          |
| `POST`     | `/login`                           | Sends Login form data to the server.                         | { email, password }                                      |
| `GET`      | `/signup`                          | Renders `signup` form view.                                  |                                                          |
| `GET`     | `/private/profile`                  | Private Profile page route. shows your collection (user favorites) | has a search bar                              |
| `GET`     | `/Search-outfits`                    | Searches the database for outfits containning the desired piece. |  {tops or bottom or shoes}                                     |
| `GET`      | `/private/edit-outfit`            | Private route. Renders `edit-outfit` form view.             |                                                          |
| `PUT`      | `/private/edit-outfit`            | Private route. Sends edit-outfit info to server and updates outfit in DB. | { top:, bottom: ,shoes: } |
| `POST`      | `/`            | Logsout user and redirects to home page| |
| `GET`      | `/private/preview-outfit`            | Private route. Shows the user a preview of the outfit | { top:, bottom: ,shoes: } |

## Models

User model

```javascript
{
  name: String,
  email: String,
  password: String,
  collections: [ obj, ogbj], // Outfit object
}
```

outfit model

```javascript
{
  top: obj,  //piece object
  bottom: obj,  //piece object
  shoes: obj,  //piece object
}
```

piece model

```javascript
{
  name: string, //white T-shirt
  image: string, //Url
  type: string, //type: tops,bottom or shoes
}
```

<br>

## Packages
cookie-parser <br>
dotenv <br>
express <br>
hbs <br>
mongoose <br>
morgan <br>
nodemon <br>
serve-favicon <br>

<br>

## Backlog

[See the Trello board.](https://trello.com/b/Ni3giVKf/ironhackproject)

<br>

## Links

### Git

The url to your repository and to your deployed project

[Repository Link]()

[Deploy Link]()

<br>

### Slides

The url to your presentation slides

[Slides Link](https://docs.google.com/presentation/d/1P5FIi0vHZBUcgUtmt1M4_lLCO5dwdJ4UOgtJa4ehGfk/edit?usp=sharing)

### Contributors
Robson Batista - [`Git hub`](https://github.com/RobBatista) - [`<linkedin-profile-link>`](https://www.linkedin.com/in/person1-username)

Pedro Nogueira - [`Git hub`](https://github.com/Pedro-No) - [`Linked In`](https://www.linkedin.com/in/pedro-nogueira-924851249/)