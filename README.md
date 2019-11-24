# GitHub Streak API

Find your contributions streak on GitHub.

## Usage

```
GET https://github-streak.herokuapp.com/<user_name>
```

## Example

```javascript
Axios.get("https://github-streak.herokuapp.com/<user_name>")
  .then(resp => console.log(resp))
  .catch(err => console.log(err));
```

## Response

```javascript
{
  longestStreak: {
    days: Number,
    from: String,
    to: String
  },
  currentStreak: {
    days: Number,
    from: String,
    to: String
  }
}
```
