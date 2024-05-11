
import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { rest } from "msw";

import UCSBDiningCommonsMenuItemIndexPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemIndexPage";

export default {
    title: 'pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemIndexPage',
    component: UCSBDiningCommonsMenuItemIndexPage
};

const Template = () => <UCSBDiningCommonsMenuItemIndexPage storybook={true}/>;

export const Empty = Template.bind({});
Empty.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbmenuitems/all', (_req, res, ctx) => {
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
        rest.get('/api/ucsbmenuitems/all', (_req, res, ctx) => {
            return res(ctx.json(ucsbMenuItemFixtures.threeDates));
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
        rest.get('/api/ucsbmenuitems/all', (_req, res, ctx) => {
            return res(ctx.json(ucsbMenuItemFixtures.threeDates));
        }),
        rest.delete('/api/ucsbmenuitems', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}