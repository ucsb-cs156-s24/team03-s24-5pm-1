const helpRequestsFixtures = {
    oneDate: {
        "id": 1,
        "requesterEmail": "test",
        "teamId": "teamTest",
        "tableOrBreakoutRoom": "table",
        "requestTime": "2024-05-30T16:58:00",
        "explanation": "explain",
        "solved": true
      },
    threeDates: [
        {
            "id": 1,
            "requesterEmail": "test@test.com",
            "teamId": "team1",
            "tableOrBreakoutRoom": "table1",
            "requestTime": "2024-05-15T17:13:00",
            "explanation": "explanation1",
            "solved": true
          },
          {
            "id": 2,
            "requesterEmail": "test2@test.com",
            "teamId": "team2",
            "tableOrBreakoutRoom": "table2",
            "requestTime": "2024-05-29T17:14:00",
            "explanation": "explanation2",
            "solved": false
          },
          {
            "id": 3,
            "requesterEmail": "test3@test.com",
            "teamId": "team3",
            "tableOrBreakoutRoom": "table3",
            "requestTime": "2024-05-20T17:15:00",
            "explanation": "explanation3",
            "solved": false
          }
    ]
};


export { helpRequestsFixtures };