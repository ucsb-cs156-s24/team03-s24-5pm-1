import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import UCSBRecommendationRequestsCreatePage from "main/pages/UCSBRecommendationRequests/UCSBRecommendationRequestsCreatePage";

export default {
    title: 'pages/UCSBRecommendationRequests/UCSBRecommendationRequestsCreatePage',
    component: UCSBRecommendationRequestsCreatePage
};

const Template = () => <UCSBRecommendationRequestsCreatePage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.post('/api/ucsbrecommendationrequests/post', (req, res, ctx) => {
            window.alert("POST: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
}


