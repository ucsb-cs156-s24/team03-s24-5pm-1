
import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { rest } from "msw";

import UCSBMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";

export default {
    title: 'pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage',
    component: UCSBDiningCommonsMenuItemEditPage
};

const Template = () => <UCSBMenuItemEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbmenuitems', (_req, res, ctx) => {
            return res(ctx.json(ucsbMenuItemFixtures.threeDates[0]));
        }),
        rest.put('/api/ucsbmenuitems', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}



