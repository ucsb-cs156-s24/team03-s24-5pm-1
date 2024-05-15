import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import UCSBRecommendationRequestsEditPage from "main/pages/UCSBRecommendationRequests/UCSBRecommendationRequestsEditPage";
import { recommendationrequestsFixtures } from 'fixtures/ucsbRecommendationRequestsFixtures';

export default {
    title: 'pages/UCSBRecommendationRequests/UCSBRecommendationRequestsEditPage',
    component: UCSBRecommendationRequestsEditPage
};

const Template = () => <UCSBRecommendationRequestsEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbrecommendationrequests', (_req, res, ctx) => {
            return res(ctx.json(recommendationrequestsFixtures.threerecommendationrequests[0]));
        }),
        rest.put('/api/ucsbrecommendationrequests', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}