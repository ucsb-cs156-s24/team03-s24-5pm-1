import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import HelpRequestsForm from "main/components/HelpRequests/HelpRequestsForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HellpRequestsEditPage({storybook=false}) {

  let { id } = useParams();

  const { data: HelpRequest, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/helprequest?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/helprequest`,
        params: {
          id
        }
      }
    );

    const objectToAxiosPutParams = (HelpRequest) => ({
      url: "/api/helprequest",
      method: "PUT",
      params: {
        id: HelpRequest.id,
      },
      data: {
        requesterEmail: HelpRequest.requesterEmail,
        teamId: HelpRequest.teamId,
        tableOrBreakoutRoom: HelpRequest.tableOrBreakoutRoom,
        explanation: HelpRequest.explanation,
        solved: HelpRequest.solved,
        requestTime: HelpRequest.requestTime
      }
    });

    console.log(HelpRequest)

    const onSuccess = (HelpRequest) => {
      toast(`HelpRequest Updated - id: ${HelpRequest.id}`);
    }
  
    const mutation = useBackendMutation(
      objectToAxiosPutParams,
      { onSuccess },
      // Stryker disable next-line all : hard to set up test for caching
      [`/api/helprequest?id=${id}`]
    );
  
    const { isSuccess } = mutation
  
    const onSubmit = async (data) => {
      mutation.mutate(data);
    }


    if (isSuccess && !storybook) {
      return <Navigate to="/helprequests" />
    }

  // Stryker disable all : HellpRequests for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Help Request</h1>
        {
          HelpRequest && <HelpRequestsForm initialContents={HelpRequest} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}
