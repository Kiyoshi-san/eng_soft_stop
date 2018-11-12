import * as actionTypes from './actionTypes';

export function matchStart(id, letter, userList, categoryList, skillList) {
    return {
      type: actionTypes.MATCH_START,
      matchid: id,
      letter: letter,
      userList: userList,
      categoryList: categoryList,
      skillList: skillList
    }
}