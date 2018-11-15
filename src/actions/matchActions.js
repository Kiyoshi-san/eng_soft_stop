import * as actionTypes from './actionTypes';

export function matchStart(match) {
    return {
      type: actionTypes.MATCH_START,
      match: match
    }
}

/*
match object example
{
  "matchid": 64,
  "letter": "P",
  "userList": [
    {
      "id": 51,
      "main": true --indicates main user of the match
    },
    {
      "id": 123,
      "main": false
    },
    {
      "id": 154,
      "main": false
    },
  ],
  "categoryList": [
    "foo",
    "bar"
  ],
  "skillList": [
    {
      "id": 12,
      "userId": 51
    }
  ]
}

*/