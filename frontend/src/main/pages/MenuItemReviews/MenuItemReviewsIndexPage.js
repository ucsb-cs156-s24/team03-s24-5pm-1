import React from 'react'
import { useBackend } from 'main/utils/useBackend';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Button } from 'react-bootstrap';
import { useCurrentUser , hasRole} from 'main/utils/currentUser';
import MenuItemReviewsTable from 'main/components/MenuItemReviews/MenuItemReviewsTable';

export default function UCSBDatesIndexPage() {

  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
        return (
            <Button
                variant="primary"
                href="/menuitemreviews/create"
                style={{ float: "right" }}
            >
                Create MenuItemReviews
            </Button>
        )
    } 
  }
  
  const { data: menuItemReviews, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/menuitemreviews/all"],
      { method: "GET", url: "/api/menuitemreviews/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>MenuItemReviews</h1>
        <MenuItemReviewsTable dates={menuItemReviews} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}