
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequestsForm from "main/components/HelpRequests/HelpRequestsForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HelpRequestsCreatePage({storybook=false}) {

  const objectToAxiosParams = (HelpRequest) => ({
    url: "/api/helprequest/post",
    method: "POST",
    params: {
      requesterEmail: HelpRequest.requesterEmail,
      teamId: HelpRequest.teamId,
      tableOrBreakoutRoom: HelpRequest.tableOrBreakoutRoom,
      explanation: HelpRequest.explanation,
      solved: HelpRequest.solved,
      localDateTime: HelpRequest.requestTime
    }
  });

  // Stryker disable all : placeholder for future implementation
  const onSuccess = (HelpRequest) => {
    toast(`New helprequest Created - id: ${HelpRequest.id}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/helprequest/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/helprequests" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Help Request</h1>

        <HelpRequestsForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}
