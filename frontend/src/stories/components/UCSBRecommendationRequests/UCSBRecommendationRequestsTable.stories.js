import React from 'react';
import UCSBRecommendationRequests from "main/components/UCSBRecommendationRequests/UCSBRecommendationRequestsTable";
import { ucsbRecommendationRequestsFixtures } from 'fixtures/ucsbRecommendationRequestsFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/UCSBRecommendationRequests/UCSBRecommendationRequestsTable',
    component: UCSBRecommendationRequestsTable
};

const Template = (args) => {
    return (
        <UCSBRecommendationRequestsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    dates: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    dates: ucsbRecommendationRequestsFixtures.threerecommendationrequests,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    dates: ucsbRecommendationRequestsFixtures.threerecommendationrequests,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/ucsbrecommendationrequests', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};