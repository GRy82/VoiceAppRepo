//This data structure is not going to change in any respect. It makes more 
//sense to store it locally, rather than in a database. Request failure and
//network failure will not be risks, and data retrieval will be no less rapid. 

const routeTree = [
    { number: 1, name: 'Speed out' },
    { number: 2, name: 'Slant' },
    { number: 3, name: 'Whip' },
    { number: 4, name: 'Drag' },
    { number: 5, name: 'Bench' },
    { number: 6, name: 'Dig' },
    { number: 7, name: 'Post corner' },
    { number: 8, name: 'Post' },
    { number: 9, name: 'Go Route' },
]

module.exports.routeTree = routeTree;