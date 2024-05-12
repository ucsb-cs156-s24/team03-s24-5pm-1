
import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbRecommendationRequestsFixtures } from "fixtures/ucsbRecommendationRequestsFixtures";
import { rest } from "msw";

import UCSBRecommendationRequestsIndexPage from "main/pages/UCSBRecommendationRequests/UCSBRecommendationRequestsIndexPage";

export default {
    title: 'pages/UCSBRecommendationRequests/UCSBRecommendationRequestsIndexPage',
    component: UCSBRecommendationRequestsIndexPage
};

const Template = () => <UCSBRecommendationRequestsIndexPage storybook={true}/>;

export const Empty = Template.bind({});
Empty.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbrecommendationrequests/all', (_req, res, ctx) => {
            return res(ctx.json([]));
        }),
    ]
}

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbrecommendationrequests/all', (_req, res, ctx) => {
            return res(ctx.json(ucsbRecommendationRequestsFixtures.threerecommendationrequests));
        }),
    ],
}

export const ThreeItemsAdminUser = Template.bind({});

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbrecommendationrequests/all', (_req, res, ctx) => {
            return res(ctx.json(ucsbRecommendationRequestsFixtures.threerecommendationrequests));
        }),
        rest.delete('/api/ucsbrecommendationrequests', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}