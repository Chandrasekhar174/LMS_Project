
package com.lms.controller;

import com.lms.model.User;
import com.lms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/init")
    public String init() {
        if (userRepository.count() == 0) {
            userRepository.saveAll(List.of(
                    new User("admin", "admin123", "ADMIN"),
                    new User("teacher", "teach123", "TEACHER"),
                    new User("student", "stud123", "STUDENT")
            ));
        }
        return "Initialized";
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        Optional<User> userOpt = userRepository.findByUsername(username);
        Map<String, Object> res = new HashMap<>();
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            User user = userOpt.get();
            res.put("id", user.getId());
            res.put("username", user.getUsername());
            res.put("role", user.getRole());
            res.put("marks", user.getMarks());
            return res;
        } else {
            res.put("error", "Invalid credentials");
            return res;
        }
    }

    @PostMapping("/admin/student")
    public Map<String, Object> addStudent(@RequestBody Map<String, Object> body) {
        String username = (String) body.get("username");
        String password = (String) body.get("password");
        Integer marks = body.get("marks") == null ? null : (Integer) body.get("marks");
        Map<String, Object> res = new HashMap<>();
        if (userRepository.findByUsername(username).isPresent()) {
            res.put("error", "Username exists");
            return res;
        }
        User u = new User(username, password, "STUDENT");
        u.setMarks(marks);
        userRepository.save(u);
        res.put("status", "success");
        res.put("user", u);
        return res;
    }

    @PutMapping("/admin/student/{id}")
    public Map<String, Object> updateStudent(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Optional<User> opt = userRepository.findById(id);
        Map<String, Object> res = new HashMap<>();
        if (opt.isEmpty()) { res.put("error", "Not found"); return res; }
        User u = opt.get();
        if (body.get("username") != null) u.setUsername((String) body.get("username"));
        if (body.get("password") != null) u.setPassword((String) body.get("password"));
        if (body.get("marks") != null) u.setMarks((Integer) body.get("marks"));
        userRepository.save(u);
        res.put("status", "updated");
        res.put("user", u);
        return res;
    }

    @DeleteMapping("/admin/student/{id}")
    public Map<String, Object> deleteStudent(@PathVariable Long id) {
        Map<String, Object> res = new HashMap<>();
        if (!userRepository.existsById(id)) { res.put("error", "Not found"); return res; }
        userRepository.deleteById(id);
        res.put("status", "deleted");
        return res;
    }

    @PostMapping("/teacher/student")
    public Map<String, Object> teacherAddStudent(@RequestBody Map<String, Object> body) {
        return addStudent(body);
    }

    @GetMapping("/teacher/students")
    public List<Map<String, Object>> teacherGetStudents() {
        List<User> students = userRepository.findAll();
        List<Map<String,Object>> out = new ArrayList<>();
        for (User u : students) {
            if ("STUDENT".equals(u.getRole())) {
                Map<String,Object> m = new HashMap<>();
                m.put("id", u.getId());
                m.put("username", u.getUsername());
                m.put("marks", u.getMarks());
                out.add(m);
            }
        }
        return out;
    }

    @GetMapping("/student/{username}/marks")
    public Map<String, Object> studentMarks(@PathVariable String username) {
        Optional<User> opt = userRepository.findByUsername(username);
        Map<String,Object> res = new HashMap<>();
        if (opt.isEmpty()) { res.put("error","Not found"); return res; }
        User u = opt.get();
        res.put("username", u.getUsername());
        res.put("marks", u.getMarks());
        return res;
    }

    @GetMapping("/admin/users")
    public List<User> allUsers() {
        return userRepository.findAll();
    }
}
