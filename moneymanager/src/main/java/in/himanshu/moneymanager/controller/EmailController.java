package in.himanshu.moneymanager.controller;

import in.himanshu.moneymanager.entity.ProfileEntity;
import in.himanshu.moneymanager.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/email")
public class EmailController {

    private final ExcelService excelService;
    private final IncomeService incomeService;
    private final EmailService emailService;
    private final ExpenseService expenseService;
    private final ProfileService profileService;

    @GetMapping("/income-excel")
    public ResponseEntity<Void> emailIncomeExcel() throws IOException {
        ProfileEntity profile = profileService.getCurrentProfile();
        ByteArrayOutputStream baos= new ByteArrayOutputStream();
        excelService.writeIncomeToExcel(baos,incomeService.getCurrentMonthIncomesForCurrentUser());
        emailService.sendEmailWithAttachment(profile.getEmail(),
                "Your Income Excel Report",
                "Please find attached your income report",
                baos.toByteArray(),
                "income_report.xlsx");
        return ResponseEntity.ok().build();
    }

    @GetMapping("/expense-excel")
    public ResponseEntity<Void> emailExpenseExcel() throws IOException {
        ProfileEntity profile = profileService.getCurrentProfile();
        ByteArrayOutputStream baos= new ByteArrayOutputStream();
        excelService.writeExpenseToExcel(baos,expenseService.getCurrentMonthExpenseForCurrentUser());
        emailService.sendEmailWithAttachment(profile.getEmail(),
                "Your Expense Excel Report",
                "Please find attached your expense report",
                baos.toByteArray(),
                "expenses.xlsx");
        return ResponseEntity.ok().build();
    }
}
