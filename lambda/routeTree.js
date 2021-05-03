//This data structure is not going to change in any respect. It makes more 
//sense to store it locally, rather than in a database. Request failure and
//network failure will not be risks, and data retrieval will be no less rapid. 
//This is kept in separate file to maintain a singular purpose for index.js
//as an intent handling server or sorts. -GR


const routeTree = [
    { name: 'Speed out', info: '' },
    { name: 'Slant', info: '' },
    { name: 'Whip', info: '' },
    { name: 'Drag', info: '' },
    { name: 'Bench', info: '' },
    { name: 'Dig', info: '' },
    { name: 'Post corner', info: '' },
    { name: 'Post', info: '' },
    { name: 'Go Route', info: '' },
]

module.exports = routeTree;