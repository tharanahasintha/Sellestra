package com.ecom.productservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecom.productservice.entity.Product;
import com.ecom.productservice.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {
	@Autowired
    private ProductRepository repo;

    public Product add(Product p) {
        return repo.save(p);
    }

    public Product update(Long id, Product p) {
        Product existing = repo.findById(id).orElseThrow();
        existing.setName(p.getName());
        existing.setPrice(p.getPrice());
        existing.setDescription(p.getDescription());
        existing.setQuantity(p.getQuantity());
        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
    public List<Product> search(String name) {
        return repo.findByNameContaining(name);
    }

    public Product getById(Long id) {
        return repo.findById(id).orElseThrow();
    }
    public void reduceQuantity(Long id, int qty) {

        Product product = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getQuantity() < qty) {
            throw new RuntimeException("Not enough stock");
        }

        product.setQuantity(product.getQuantity() - qty);

        repo.save(product);
    }
    
    public List<Product> getAllProducts() {
        return repo.findAll();
    }
}