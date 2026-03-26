package in.himanshu.moneymanager.controller;

import in.himanshu.moneymanager.service.ExcelService;
import in.himanshu.moneymanager.service.ExpenseService;
import in.himanshu.moneymanager.service.IncomeService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/excel")
@RequiredArgsConstructor
public class ExcelController {

    private final ExcelService excelService;
    private final IncomeService incomeService;
    private final ExpenseService expenseService;

    @GetMapping("/download/income")
    public void downloadIncomeExcel(HttpServletResponse response) throws IOException {
        // 1. Set response content type for Excel
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        // 2. Set header so browser downloads the file instead of displaying it
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=income.xlsx");
        // 3. Generate Excel and write directly to response output stream
        excelService.writeIncomeToExcel(response.getOutputStream(),incomeService.getCurrentMonthIncomesForCurrentUser());
    }

    @GetMapping("download/expense")
    public void downloadExpenseExcel(HttpServletResponse response) throws IOException{
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=expense.xlsx");
        excelService.writeExpenseToExcel(response.getOutputStream(),expenseService.getCurrentMonthExpenseForCurrentUser());

    }
}
