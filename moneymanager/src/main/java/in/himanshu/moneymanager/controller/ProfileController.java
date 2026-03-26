package in.himanshu.moneymanager.controller;


import in.himanshu.moneymanager.dto.AutoDTO;
import in.himanshu.moneymanager.dto.ProfileDto;
import in.himanshu.moneymanager.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping("/register")
    public ResponseEntity<ProfileDto> registerProfile(@RequestBody ProfileDto profileDto){
        ProfileDto registeredProfile = profileService.registerProfile(profileDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredProfile);
    }

    @GetMapping("/activate")
    public ResponseEntity<String> activationProfile(@RequestParam String token){
        boolean isActivated = profileService.activateProfile(token);
        if(isActivated){
            return ResponseEntity.ok("Profile activated successfully");
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Activation token not found or already used");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AutoDTO autoDTO){
        try{
            if(!profileService.isAccountActive(autoDTO.getEmail())){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message","Account is not active.Please activate your account first."));
            }
            Map<String, Object> response =  profileService.authenticateAndGenerateToken(autoDTO);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/test")
    public String test(){
        return "Test Successful";
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileDto> getPublicProfile(){
        ProfileDto profileDto = profileService.getPublicProfile(null);
        return ResponseEntity.ok(profileDto);
    }
}
