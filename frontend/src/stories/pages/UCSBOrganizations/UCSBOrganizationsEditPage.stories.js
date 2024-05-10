import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import UCSBOrganizationsEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationsEditPage";
import { ucsbOrganizationsFixtures } from 'fixtures/ucsbOrganizationsFixtures';

export default {
    title: 'pages/UCSBOrganizations/UCSBOrganizationsEditPage',
    component: UCSBOrganizationsEditPage
};

const Template = () => <UCSBOrganizationsEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/UCSBOrganizations', (_req, res, ctx) => {
            return res(ctx.json(ucsbOrganizationsFixtures.threeUCSBOrganizations[0]));
        }),
        rest.put('/api/UCSBOrganizations', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}



