import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/UCSBDiningCommonsMenuItemUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBMenuItemsTable({ menuItems, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/ucsbmenuitems/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/ucsbmenuitems/all"]
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
            Header: 'Dining Common Code',
            accessor: 'diningCommonsCode',
        },
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Dining Common Station',
            accessor: 'station',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "UCSBMenuItemsTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "UCSBMenuItemsTable"));
    } 

    return <OurTable
        data={menuItems}
        columns={columns}
        testid={"UCSBMenuItemsTable"}
    />;
};
