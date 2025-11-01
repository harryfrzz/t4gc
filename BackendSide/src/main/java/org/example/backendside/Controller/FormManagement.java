package org.example.backendside.Controller;

import org.example.backendside.Model.UserForms;
import org.example.backendside.Model.UserResponses;
import org.example.backendside.Repository.FormRepository;
import org.example.backendside.Repository.ResponseRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/forms")
@CrossOrigin(origins = "*") // Allow all origins for public form access
public class FormManagement {

    private final FormRepository formRepository;
    private final ResponseRepository responseRepository;

    public FormManagement(FormRepository formRepository, ResponseRepository responseRepository) {
        this.formRepository = formRepository;
        this.responseRepository = responseRepository;
    }

    @GetMapping
    public List<UserForms> getAllForms() {
        return formRepository.findAll();
    }

    @GetMapping("/{id}")
    public UserForms getForm(@PathVariable Long id) {
        return formRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Form not found with this id: " + id));
    }

    // Get form by shareable link
    @GetMapping("/share/{shareableLink}")
    public UserForms getFormByLink(@PathVariable String shareableLink) {
        return formRepository.findByShareableLink(shareableLink)
                .orElseThrow(() -> new RuntimeException("Form not found with this link: " + shareableLink));
    }

    @PostMapping
    public UserForms saveForm(@RequestBody UserForms form) {
        // Generate shareable link if not exists
        if (form.getShareableLink() == null || form.getShareableLink().isEmpty()) {
            form.setShareableLink(UUID.randomUUID().toString());
        }
        return formRepository.save(form);
    }

    @PostMapping("/{formId}/responses")
    public List<UserResponses> userResponses(@PathVariable Long formId, @RequestBody List<UserResponses> responses) {
        for(UserResponses response : responses){
            response.setFormId(formId);
        }
        return responseRepository.saveAll(responses);
    }

    @GetMapping("/{formId}/responses")
    public List<UserResponses> getResponses(@PathVariable Long formId) {
        return responseRepository.findByFormId(formId);
    }

    // Get form statistics
    @GetMapping("/{formId}/analytics")
    public FormAnalytics getFormAnalytics(@PathVariable Long formId) {
        UserForms form = formRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));

        List<UserResponses> responses = responseRepository.findByFormId(formId);

        FormAnalytics analytics = new FormAnalytics();
        analytics.setFormId(formId);
        analytics.setFormName(form.getFormName());
        analytics.setTotalResponses(responses.size());
        analytics.setQuestionCount(form.getUserQuestions().size());

        return analytics;
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteForm(@PathVariable Long id) {
        try {
            // Check if form exists
            if (!formRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }

            // Delete the form (cascades to questions and responses if configured)
            formRepository.deleteById(id);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting form: " + e.getMessage());
        }
    }

    // Inner class for analytics
    public static class FormAnalytics {
        private Long formId;
        private String formName;
        private int totalResponses;
        private int questionCount;

        // Getters and setters
        public Long getFormId() { return formId; }
        public void setFormId(Long formId) { this.formId = formId; }

        public String getFormName() { return formName; }
        public void setFormName(String formName) { this.formName = formName; }

        public int getTotalResponses() { return totalResponses; }
        public void setTotalResponses(int totalResponses) { this.totalResponses = totalResponses; }

        public int getQuestionCount() { return questionCount; }
        public void setQuestionCount(int questionCount) { this.questionCount = questionCount; }
    }
}