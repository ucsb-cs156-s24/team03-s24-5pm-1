import React from 'react';
import UCSBRecommendationRequestsForm from "main/components/UCSBRecommendationRequests/UCSBRecommendationRequestsForm"
import { ucsbRecommendationRequestsFixtures } from 'fixtures/ucsbRecommendationRequestsFixtures';

export default {
    title: 'components/UCSBRecommendationRequests/UCSBRecommendationRequestsForm',
    component: UCSBRecommendationRequestsForm
};


const Template = (args) => {
    return (
        <UCSBRecommendationRequestsForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};

export const Update = Template.bind({});

Update.args = {
    initialContents: ucsbRecommendationRequestsFixtures.oneDate,
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};