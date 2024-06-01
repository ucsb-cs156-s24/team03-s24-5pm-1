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
public class UCSBOrganizationsWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_UCSBOrganizations() throws Exception {
        setupUser(true);

        page.getByText("UCSBOrganizations").click();

        page.getByText("Create UCSBOrganizations").click();
        assertThat(page.getByText("Create New UCSBOrganizations")).isVisible();
        page.getByTestId("UCSBOrganizationsForm-orgTranslationShort").fill("SKYDIVING CLUB");
        page.getByTestId("UCSBOrganizationsForm-orgTranslation").fill("SKYDIVING CLUB AT UCSB");
        page.getByTestId("UCSBOrganizationsForm-submit").click();

        assertThat(page.getByTestId("UCSBOrganizationsTable-cell-row-0-col-orgTranslation"))
                .hasText("SKYDIVING CLUB AT UCSB");

        page.getByTestId("UCSBOrganizationsTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit UCSBOrganizations")).isVisible();
        page.getByTestId("UCSBOrganizationsForm-orgTranslation").fill("SKYDIVING CLUB AT UCSB");
        page.getByTestId("UCSBOrganizationsForm-submit").click();

        assertThat(page.getByTestId("UCSBOrganizationsTable-cell-row-0-col-orgTranslation")).hasText("SKYDIVING CLUB AT UCSB");

        page.getByTestId("UCSBOrganizationsTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("UCSBOrganizationsTable-cell-row-0-col-orgTranslationShort")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_UCSBOrganizations() throws Exception {
        setupUser(false);

        page.getByText("UCSBOrganizations").click();

        assertThat(page.getByText("Create UCSBOrganizations")).not().isVisible();
        assertThat(page.getByTestId("UCSBOrganizationsTable-cell-row-0-col-orgTranslationShort")).not().isVisible();
    }
}