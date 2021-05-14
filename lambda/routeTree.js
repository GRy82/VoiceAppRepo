//This data structure is not going to change in any respect. It makes more 
//sense to store it locally, rather than in a database. Request failure and
//network failure will not be risks, and data retrieval will be no less rapid. 
//This is kept in separate file to maintain a singular purpose for index.js
//as an intent handling server or sorts. -GR


const routeTree = [
    { 
        name: 'Speed out', 
        info: 'Take one step forward, then run towards the sideline.' 
    },
    { 
        name: 'Slant', 
        info: 'On your third step, change direction diagonally, aiming to run behind the linebackers.', 
        textedUrl: 'https://www.youtube.com/watch?v=UO7LgtJRFeY'
    },
    { 
        name: 'Whip', 
        info: 'Fake a slant route, but instead break outward towards the sideline.' 
    },
    { 
        name: 'Drag', 
        info: 'A drag is similar to a slant, but you will bend your route horizontally across the field. The depth of your route will depend on the depth of linebackers.' 
    },
    { 
        name: 'Bench', 
        info: 'Run eight to ten yards forward, then break outward towards the sideline.' 
    },
    { 
        name: 'Dig', 
        info: 'Run eight to ten yards forward, then break inward across the field.' 
    },
    { 
        name: 'Post corner', 
        info: 'Run ten to twelve yards forward, and break diagonally upfield and towards the sideline.' 
    },
    {
        name: 'Post', 
        info: 'Run ten to twelve yards forward, and break diagonally upfield and towards the hashes.'  
    },
    { 
        name: 'Go Route', 
        info: 'Run upfield for an over the shoulder pass.' 
    },
]

module.exports = routeTree;