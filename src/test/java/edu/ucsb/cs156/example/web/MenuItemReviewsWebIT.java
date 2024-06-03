package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)

public class MenuItemReviewsWebIT extends WebTestCase{
    @Test
    public void admin_user_can_create_orgs() throws Exception {
        setupUser(true);

        page.getByText("MenuItemReviews").click();

        page.getByText("Create MenuItemReviews").click();
        assertThat(page.getByText("Create New MenuItemReviews")).isVisible();
        page.getByTestId("MenuItemReviewsForm-itemId").fill("20");
        page.getByTestId("MenuItemReviewsForm-reviewerEmail").fill("pmanopchantaroj@ucsb.edu");
        page.getByTestId("MenuItemReviewsForm-stars").fill("4");
        page.getByTestId("MenuItemReviewsForm-comments").fill("decent");
        page.getByTestId("MenuItemReviewsForm-submit").click();
    }

    @Test
    public void regular_user_cannot_create_orgs() throws Exception {
        setupUser(false);

        page.getByText("MenuItemReviews").click();

        assertThat(page.getByText("Create MenuItemReviews")).not().isVisible();
        assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-comments")).not().isVisible();
    }
}
