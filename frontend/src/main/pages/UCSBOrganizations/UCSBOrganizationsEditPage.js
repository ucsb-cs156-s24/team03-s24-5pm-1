import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RestaurantForm from 'main/components/UCSBOrganizations/UCSBOrganizationsForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationsEditPage({storybook=false}) {
    let { orgCode } = useParams();

    const { data: orgs, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/UCSBOrganizations?orgCode=${orgCode}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/UCSBOrganizations`,
                params: {
                    orgCode
                }
            }
        );

    const objectToAxiosPutParams = (orgs) => ({
        url: "/api/Organizations",
        method: "PUT",
        params: {
            orgCode: orgs.orgCode,
        },
        data: {
            orgTranslationShort: orgs.orgTranslationShort,
            orgTranslation: orgs.orgTranslation,
            inactive: orgs.inactive
        }
    });

    const onSuccess = (orgs) => {
        toast(`New org Created - orgCode: ${orgs.orgCode} orgTranslationShort: ${orgs.orgTranslationShort} orgTranslation: ${orgs.orgTranslation} inactive: ${orgs.inactive}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/UCSBOrganizations?orgCode=${orgCode}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/UCSBOrganizations" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit UCSBOrganizations</h1>
                {
                    orgs && <UCSBOrganizationsForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={orgs} />
                }
            </div>
        </BasicLayout>
    )

}