import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBMenuItemForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemEditPage({storybook=false}) {
  let { id } = useParams();

  const { data: ucsbMenuItem, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/ucsbmenuitems?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/ucsbmenuitems`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (ucsbMenuItem) => ({
    url: "/api/ucsbmenuitems",
    method: "PUT",
    params: {
      id: ucsbMenuItem.id,
    },
    data: {
      quarterYYYYQ: ucsbMenuItem.diningCommonCode,
      name: ucsbMenuItem.name,
      station: ucsbMenuItem.station
    }
  });

  const onSuccess = (ucsbMenuItem) => {
    toast(`UCSBDiningCommonsMenuItem Updated - id: ${ucsbMenuItem.id} name: ${ucsbMenuItem.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/ucsbmenuitems?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsbmenuitems" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSBDiningCommonsMenuItem</h1>
        {
          ucsbMenuItem && <UCSBMenuItemForm initialContents={ucsbMenuItem} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}
