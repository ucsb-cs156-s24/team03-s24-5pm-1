import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBRecommendationRequestsForm from "main/components/UCSBRecommendationRequests/UCSBRecommendationRequestsForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBRecommendationRequestsCreatePage({storybook=false}) {

  const objectToAxiosParams = (ucsbRecommendationRequests) => ({
    url: "/api/ucsbrecommendationrequests/post",
    method: "POST",
    params: {
      requesterEmail: ucsbRecommendationRequests.requesterEmail,
      professorEmail: ucsbRecommendationRequests.professorEmail,
      explanation: ucsbRecommendationRequests.explanation,
      dateRequested: ucsbRecommendationRequests.dateRequested,
      dateNeeded: ucsbRecommendationRequests.dateNeeded,
      done: ucsbRecommendationRequests.done
    }
  });

  const onSuccess = (ucsbRecommendationRequests) => {
    toast(`New ucsbRecommendationRequests Created - id: ${ucsbRecommendationRequests.id} requesterEmail: ${ucsbRecommendationRequests.requesterEmail}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/ucsbrecommendationrequests/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/UCSBRecommendationRequests" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSBRecommendationRequests</h1>

        <UCSBRecommendationRequestsForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}