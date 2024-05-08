import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RestaurantForm from "main/components/UCSBOrganizations/UCSBOrganizationsForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationsCreatePage({storybook=false}) {

  const objectToAxiosParams = (orgs) => ({
    url: "/api/UCSBOrganizations/post",
    method: "POST",
    params: {
     orgCode: orgs.orgCode,
     orgTranslationShort: orgs.orgTranslationShort,
     orgTranslation: orgs.orgTranslation,
     inactive: orgs.inactive
    }
  });

  const onSuccess = (orgs) => {
    toast(`New org Created - orgCode: ${orgs.orgCode} orgTranslationShort: ${orgs.orgTranslationShort} orgTranslation: ${orgs.orgTranslation} inactive: ${orgs.inactive}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/UCSBOrganizations/all"] // mutation makes this key stale so that pages relying on it reload
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
        <h1>Create New Organization</h1>
        <RestaurantForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
