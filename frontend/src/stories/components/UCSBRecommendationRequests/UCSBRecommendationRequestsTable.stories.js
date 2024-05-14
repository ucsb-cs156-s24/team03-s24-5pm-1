import React from 'react';
import RecommendationRequestsTable from "main/components/UCSBRecommendationRequests/UCSBRecommendationRequestsTable";
import { recommendationrequestsFixtures } from 'fixtures/ucsbRecommendationRequestsFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/UCSBRecommendationRequests/UCSBRecommendationRequestsTable',
    component: RecommendationRequestsTable
};

const Template = (args) => {
    return (
        <RecommendationRequestsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    recommendationrequests: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    recommendationrequests: recommendationrequestsFixtures.threerecommendationrequests,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    recommendationrequests: recommendationrequestsFixtures.threerecommendationrequests,
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