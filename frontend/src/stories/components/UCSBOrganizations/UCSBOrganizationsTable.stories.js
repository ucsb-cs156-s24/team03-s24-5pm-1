import React from 'react';
import UCSBOrganizationsTable from 'main/components/UCSBOrganizations/UCSBOrganizationsTable';
import { ucsbOrganizationsFixtures } from 'fixtures/ucsbOrganizationsFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/UCSBOrganizations/UCSBOrganizationsTable',
    component: UCSBOrganizationsTable
};

const Template = (args) => {
    return (
        <UCSBOrganizationsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    orgs: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    orgs: ucsbOrganizationsFixtures.threeUCSBOrganizations,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    orgs: ucsbOrganizationsFixtures.threeUCSBOrganizations,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/orgs', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};
