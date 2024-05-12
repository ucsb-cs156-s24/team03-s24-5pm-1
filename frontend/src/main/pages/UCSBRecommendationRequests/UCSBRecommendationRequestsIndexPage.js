import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBRecommendationRequestsTable from 'main/components/UCSBRecommendationRequests/UCSBRecommendationRequestsTable';
import { Button } from 'react-bootstrap';
import { useCurrentUser , hasRole} from 'main/utils/currentUser';

export default function UCSBRecommendationRequestsIndexPage() {

  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
        return (
            <Button
                variant="primary"
                href="/ucsbrecommendationrequests/create"
                style={{ float: "right" }}
            >
                Create UCSBRecommendationRequests 
            </Button>
        )
    } 
  }
  
  const { data: dates, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/ucsbrecommendationrequests/all"],
      { method: "GET", url: "/api/ucsbrecommendationrequests/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>UCSBRecommendationRequests</h1>
        <UCSBRecommendationRequestsTable dates={dates} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}