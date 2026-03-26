package in.himanshu.moneymanager.controller;

import in.himanshu.moneymanager.dto.ExpenseDTO;
import in.himanshu.moneymanager.dto.FilterDto;
import in.himanshu.moneymanager.dto.IncomeDTO;
import in.himanshu.moneymanager.service.ExpenseService;
import in.himanshu.moneymanager.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/filter")
@RequiredArgsConstructor
public class FilterController {

    private final ExpenseService expenseService;
    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<?> filterTransactions(@RequestBody FilterDto filter){
        //preparing the data or validation
        LocalDate startDate = filter.getStartDate() != null ? filter.getStartDate() : LocalDate.MIN;
        LocalDate endDate = filter.getEndDate() != null ? filter.getEndDate() : LocalDate.now();
        String keyword = filter.getKeyword() != null ? filter.getKeyword():"";
        String sortField = filter.getSortField() != null ? filter.getSortField(): "date";
        Sort.Direction direction = "desc".equalsIgnoreCase(filter.getSortOrder()) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction,sortField);
        if("income".equals(filter.getType())){
            List<IncomeDTO> incomes = incomeService.filterExpenses(startDate,endDate,keyword,sort);
            return ResponseEntity.ok(incomes);
        } else if ("expense".equalsIgnoreCase(filter.getType())) {
            List<ExpenseDTO> expenses = expenseService.filterExpenses(startDate,endDate,keyword,sort);
            return ResponseEntity.ok(expenses);
        }else {
            return ResponseEntity.badRequest().body("Invalid type. Must be 'income' or 'expense'");
        }

    }
}
