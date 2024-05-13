import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import HelpRequestsTable from 'main/components/HelpRequests/HelpRequestsTable';
import { Button } from 'react-bootstrap';
import { useCurrentUser , hasRole} from 'main/utils/currentUser';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function HellpRequestsIndexPage() {

  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
        return (
            <Button
                variant="primary"
                href="/helprequests/create"
                style={{ float: "right" }}
            >
                Create HelpRequest 
            </Button>
        )
    } 
  }

  const { data: dates, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/helprequest/all"],
      { method: "GET", url: "/api/helprequest/all" },
      []
    );

  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>Help Requests</h1>
        <HelpRequestsTable dates={dates} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}
