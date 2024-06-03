package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBDiningCommonsMenuItemWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_menuitem() throws Exception {
        setupUser(true);

        page.getByText("Dining Commons Menu Items").click();

        page.getByText("Create UCSBDiningCommonsMenuItem").click();
        assertThat(page.getByText("Create New UCSBDiningCommonsMenuItem")).isVisible();
        page.getByTestId("UCSBMenuItemForm-diningCommonsCode").fill("carrillo");
        page.getByTestId("UCSBMenuItemForm-name").fill("Crispy Salmon Roll");
        page.getByTestId("UCSBMenuItemForm-station").fill("Euro");
        page.getByTestId("UCSBMenuItemForm-submit").click();

        assertThat(page.getByTestId("UCSBMenuItemsTable-cell-row-0-col-station"))
                .hasText("Crispy Salmon Roll");

        page.getByTestId("UCSBMenuItemsTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit")).isVisible();
        page.getByTestId("UCSBMenuItemForm-station").fill("Hot Cuisine");
        page.getByTestId("UCSBMenuItemForm-submit").click();

        assertThat(page.getByTestId("UCSBMenuItemsTable-cell-row-0-col-station")).hasText("Crispy Salmon Roll");

        page.getByTestId("UCSBMenuItemsTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("UCSBMenuItemsTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_menuItem() throws Exception {
        setupUser(false);

        page.getByText("Dining Commons Menu Items").click();

        assertThat(page.getByText("Create UCSBDiningCommonsMenuItem")).not().isVisible();
        assertThat(page.getByTestId("UCSBMenuItemsTable-cell-row-0-col-name")).not().isVisible();
    }
}