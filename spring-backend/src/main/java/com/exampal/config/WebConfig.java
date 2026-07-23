// package com.exampal.config;

// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
// import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// import java.nio.file.Path;
// import java.nio.file.Paths;

// @Configuration
// public class WebConfig implements WebMvcConfigurer {

//     private final AppProperties appProperties;

//     public WebConfig(AppProperties appProperties) {
//         this.appProperties = appProperties;
//     }

//     private Path projectRoot() {
//         return Paths.get(System.getProperty("user.dir")).getParent() != null
//                 && Paths.get(System.getProperty("user.dir")).getFileName().toString().equals("spring-backend")
//                 ? Paths.get(System.getProperty("user.dir")).getParent()
//                 : Paths.get(System.getProperty("user.dir"));
//     }

//     @Override
//     public void addResourceHandlers(ResourceHandlerRegistry registry) {
//         String clientPath = projectRoot().resolve("client").toAbsolutePath().toUri().toString();
//         String uploadsPath = projectRoot().resolve(appProperties.getUploadPath()).toAbsolutePath().toUri().toString();

//         registry.addResourceHandler("/uploads/**")
//                 .addResourceLocations(uploadsPath);
//         registry.addResourceHandler("/web/**")
//                 .addResourceLocations(clientPath);
//         registry.addResourceHandler("/index.html", "/main.js", "/styles.css", "/test.html")
//                 .addResourceLocations(clientPath);
//     }

//     @Override
//     public void addViewControllers(ViewControllerRegistry registry) {
//         registry.addViewController("/web").setViewName("forward:/web/index.html");
//         registry.addViewController("/test").setViewName("forward:/test.html");
//     }
// }




package com.exampal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
}