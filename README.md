# street-buff
Implementation and extension of the MEAN Stack tutorial from thinkster.io (https://thinkster.io/mean-stack-tutorial/)

Reddit clone :)

Independent exercises (end of the tutorial):
* feature downvote: Implement a 'downvoting' feature
* feature vote once: Only allow authenticated users to vote once.
* feature number of answers: Display the number of answers next to each question on the main page
* feature hide new answers box: use ng-hide to hide the 'new answer' and 'new question' input box until a user clicks a button to see the field
*

Independent exercises (thought up by myself, though, Reddit itself is the design document :) )
* feature: delete answers and questions: only authenticated user (and the user who posted the question or answer) (server and client)
* feature: upvoting causes the downvote to go away, and vice versa.
* feature: upvoting and already-upvoted (and vice versa) question/answer will un-upvote/downvote the question/answer

###To run:
1. ``cd`` to ``street-buff`` root directory
2. ``npm install``
3. ```set DEBUG=street-buff:server & npm start``` (Windows) | ```DEBUG=street-buff:server npm start``` (Mac and Linux)
