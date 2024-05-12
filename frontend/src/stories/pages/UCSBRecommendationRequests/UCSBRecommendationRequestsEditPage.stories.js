import UCSBRecommendationRequestsEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

export default {
    title: 'pages/UCSBRecommendationRequests/UCSBRecommendationRequestsEditPage',
    component: UCSBRecommendationRequestsEditPage
};

const Template = () => <UCSBRecommendationRequestsEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbrecommendationrequests', (_req, res, ctx) => {
            return res(ctx.json(ucsbRecommendationRequestsFixtures.threeDates[0]));
        }),
        rest.put('/api/ucsbrecommendationrequests', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}