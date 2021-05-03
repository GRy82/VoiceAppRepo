//This data structure is not going to change in any respect. It makes more 
//sense to store it locally, rather than in a database. Request failure and
//network failure will not be risks, and data retrieval will be no less rapid. 
//This is kept in separate file to maintain a singular purpose for index.js
//as an intent handling server or sorts. -GR


const routeTree = [
    'Speed out',
    'Slant',
    'Whip',
    'Drag',
    'Bench',
    'Dig',
    'Post corner',
    'Post',
    'Go Route',
]

module.exports = routeTree;