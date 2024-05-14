import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import MenuItemReviewsForm from "main/components/MenuItemReviews/MenuItemReviewsForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewsEditPage({storybook=false}) {
  let { id } = useParams();

  const { data: menuItemReviews, _error, _status } = 
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/menuitemreviews?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/menuitemreviews`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (menuItemReviews) => ({ 
    url: "/api/menuitemreviews",
    method: "PUT",
    params: {
      id: menuItemReviews.id,
    },
    data: {
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
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/menuitemreviews?id=${id}`]
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
        <h1>Edit MenuItemReviews</h1>
        {
          menuItemReviews && <MenuItemReviewsForm initialContents={menuItemReviews} submitAction={onSubmit} buttonLabel="Update" /> //todo
        }
      </div>
    </BasicLayout>
  )
}

