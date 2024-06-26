import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/MenuItemReviewsUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function MenuItemReviewsTable({ menuItemReviews, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/menuitemreviews/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/menuitemreviews/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'itemId',
            accessor: 'itemId',
        },
        {
            Header: 'reviewerEmail',
            accessor: 'reviewerEmail',
        },
        {
            Header: 'stars',
            accessor: 'stars',
        },
        {
            Header: 'comments',
            accessor: 'comments',
        },
        {
            Header: 'dateReviewed',
            accessor: 'dateReviewed',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "MenuItemReviewsTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "MenuItemReviewsTable"));
    } 

    return <OurTable
        data={menuItemReviews}
        columns={columns}
        testid={"MenuItemReviewsTable"}
    />;
};