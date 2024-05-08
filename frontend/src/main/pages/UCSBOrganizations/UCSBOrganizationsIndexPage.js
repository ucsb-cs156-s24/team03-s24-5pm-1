import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RestaurantTable from 'main/components/UCSBOrganizations/UCSBOrganizationsTable';
import { useCurrentUser , hasRole} from 'main/utils/currentUser'
import { Button } from 'react-bootstrap';

export default function UCSBOrganizationsIndexPage() {

    const currentUser = useCurrentUser();

    const { data: orgs, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/UCSBOrganizations/all"],
            { method: "GET", url: "/api/UCSBOrganizations/all" },
            // Stryker disable next-line all : don't test default value of empty list
            []
        );

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/UCSBOrganizations/create"
                    style={{ float: "right" }}
                >
                    Create UCSBOrganizations
                </Button>
            )
        } 
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                {createButton()}
                <h1>UCSBOrganizations</h1>
                <UCSBOrganizationsTable orgs={orgs} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}