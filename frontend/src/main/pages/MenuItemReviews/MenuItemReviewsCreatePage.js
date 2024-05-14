import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
import MenuItemReviewsForm from "main/components/MenuItemReviews/MenuItemReviewsForm";

export default function MenuItemReviewsCreatePage({ storybook = false }) {

  const objectToAxiosParams = (menuItemReviews) => ({
    url: "/api/menuitemreviews/post",
    method: "POST",
    params: {
      itemId: menuItemReviews.itemId,
      reviewerEmail: menuItemReviews.reviewerEmail,
      stars: menuItemReviews.stars,
      dateReviewed: menuItemReviews.dateReviewed,
      comments: menuItemReviews.comments
    }
  });

  const onSuccess = (menuItemReviews) => { 
    toast(`New menuItemReviews Created - id: ${menuItemReviews.id} itemId: ${menuItemReviews.itemId}  stars: ${menuItemReviews.stars}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/menuitemreviews/all"]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/menuitemreviews" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New MenuItemReviews</h1>

        <MenuItemReviewsForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}