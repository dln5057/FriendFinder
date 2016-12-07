console.log('API Route Connected ');

var friends = require('../data/friends.js');

function apiRoutes(app) {

  // A GET route with the url /api/friends. This will be used to display a JSON of all possible friends.
  app.get('/api/friends', function (req, res) {
    res.json(friends);
  });

  // A POST routes /api/friends. This will be used to handle incoming survey results. This route will also be used to handle the compatibility logic.
  app.post('/api/friends', function (req, res) {

    // Parse new friend input to get integers (AJAX post seemed to make the numbers strings)
    var newFriend = {
      name: req.body.name,
      photo: req.body.photo,
      scores: []
    };
    var scoresArray = [];
    for(var i=0; i < req.body.scores.length; i++){
      scoresArray.push( parseInt(req.body.scores[i]) )
    }
    newFriend.scores = scoresArray;

    //Checks the new friends entry if any other exisit 
    var scoreComparisionArray = [];
    for(var i=0; i < friends.length; i++){

      // Check each friend's scores and sum difference in points
      var currentComparison = 0;
      for(var j=0; j < newFriend.scores.length; j++){
        currentComparison += Math.abs( newFriend.scores[j] - friends[i].scores[j] );
      }

      // Pushes each comparison between friends to array
      scoreComparisionArray.push(currentComparison);
    }
    // Determine the best match using the postion of best match in the friendsData array
    var bestMatchPosition = 0; 
    for(var i=1; i < scoreComparisionArray.length; i++){
      
      if(scoreComparisionArray[i] <= scoreComparisionArray[bestMatchPosition]){
        bestMatchPosition = i;
      }
    }
    var bestFriendMatch = friends[bestMatchPosition];

    res.json(bestFriendMatch);

    friends.push(newFriend);

  });

}



module.exports = apiRoutes;
