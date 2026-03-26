package in.himanshu.moneymanager.service;

import in.himanshu.moneymanager.dto.ExpenseDTO;
import in.himanshu.moneymanager.entity.ProfileEntity;
import in.himanshu.moneymanager.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final ProfileRepository profileRepository;
    private final EmailService emailService;
    private final ExpenseService expenseService;

    @Value("${money.manager.frontend.url}")
    private String frontendUrl;

    // ----------------------- Daily Income & Expense Reminder -----------------------
    @Scheduled(cron = "0 0 22 * * *", zone = "IST")
    public void sendDailyIncomeExpenseReminder() {
        log.info("Job started: sendDailyIncomeExpenseReminder()");
        List<ProfileEntity> profiles = profileRepository.findAll();

        for (ProfileEntity profile : profiles) {
            try {
                String body = buildReminderEmailBody(profile);
                sendEmailAsync(profile.getEmail(), "Daily reminder: Add your income and expenses", body);
            } catch (Exception e) {
                log.error("Failed to send reminder to {}: {}", profile.getEmail(), e.getMessage());
            }
        }
        log.info("Job completed: sendDailyIncomeExpenseReminder()");
    }

    // ----------------------- Daily Expense Summary -----------------------
    @Scheduled(cron = "0 0 23 * * *", zone = "IST")
    public void sendDailyExpenseSummary() {
        log.info("Job started: sendDailyExpenseSummary()");
        List<ProfileEntity> profiles = profileRepository.findAll();

        for (ProfileEntity profile : profiles) {
            try {
                List<ExpenseDTO> todayExpenses = expenseService.getExpenseForUserOnDate(profile.getId(), LocalDate.now());
                if (!todayExpenses.isEmpty()) {
                    String body = buildExpenseSummaryEmailBody(profile, todayExpenses);
                    sendEmailAsync(profile.getEmail(), "Your Daily Expense Summary", body);
                }
            } catch (Exception e) {
                log.error("Failed to send expense summary to {}: {}", profile.getEmail(), e.getMessage());
            }
        }
        log.info("Job completed: sendDailyExpenseSummary()");
    }

    // ----------------------- Helper Methods -----------------------

    /**
     * Builds HTML body for the daily reminder email.
     */
    private String buildReminderEmailBody(ProfileEntity profile) {
        return "Hi " + profile.getFullName() + ",<br><br>"
                + "This is a friendly reminder to add your income and expenses for today in Money Manager.<br><br>"
                + "<a href=\"" + frontendUrl + "\" "
                + "style=\"display:inline-block;padding:10px 20px;background-color:#4CAF50;color:#fff;"
                + "text-decoration:none;border-radius:5px;font-weight:bold;\">"
                + "Go to Money Manager</a><br><br>"
                + "Best regards,<br>"
                + "Money Manager Team";
    }

    /**
     * Builds HTML body for daily expense summary email with a table.
     */
    private String buildExpenseSummaryEmailBody(ProfileEntity profile, List<ExpenseDTO> expenses) {
        StringBuilder table = new StringBuilder();
        table.append("<table style='border-collapse:collapse;width:100%;'>")
                .append("<tr style='background-color:#f2f2f2;'>")
                .append("<th style='border:1px solid #ddd;padding:8px;'>S.No</th>")
                .append("<th style='border:1px solid #ddd;padding:8px;'>Name</th>")
                .append("<th style='border:1px solid #ddd;padding:8px;'>Amount</th>")
                .append("<th style='border:1px solid #ddd;padding:8px;'>Category</th>")
                .append("<th style='border:1px solid #ddd;padding:8px;'>Date</th>")
                .append("</tr>");

        int i = 1;
        for (ExpenseDTO expense : expenses) {
            table.append("<tr>")
                    .append("<td style='border:1px solid #ddd;padding:8px;'>").append(i++).append("</td>")
                    .append("<td style='border:1px solid #ddd;padding:8px;'>").append(expense.getName()).append("</td>")
                    .append("<td style='border:1px solid #ddd;padding:8px;'>").append(expense.getAmount()).append("</td>")
                    .append("<td style='border:1px solid #ddd;padding:8px;'>")
                    .append(expense.getCategoryId() != null ? expense.getCategoryName() : "N/A")
                    .append("</td>")
                    .append("<td style='border:1px solid #ddd;padding:8px;'>").append(expense.getDate()).append("</td>")
                    .append("</tr>");
        }

        table.append("</table>");

        return "Hi " + profile.getFullName() + ",<br/><br/>"
                + "Here is a summary of your expenses for today:<br/><br/>"
                + table
                + "<br/><br/>Best regards,<br/>Money Manager Team";
    }

    /**
     * Sends email asynchronously.
     */
    @Async
    private void sendEmailAsync(String to, String subject, String body) {
        emailService.sendEmail(to, subject, body);
    }
}
